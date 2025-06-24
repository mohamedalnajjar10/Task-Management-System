import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

function generateRandomPassword() {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=';
    let password = '';
    const passwordLength = Math.floor(Math.random() * (20 - 4 + 1)) + 4;

    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    return password;
}


@Injectable()
export class OauthService {
    private generateToken(user: User) {
        return this.jwtService.sign(
            {
                sub: user.id,
                email: user.email,
                role: user.role,
            },
            {
                secret: process.env.JWT_SECRET,
                expiresIn: process.env.JWT_EXPIRES_IN,
            },
        );

    }

    constructor(
        @InjectModel(User) private userModel: typeof User,
        private jwtService: JwtService,
        private mailService: MailerService,
    ) { }
    async validate(user: any): Promise<any> {
        //sign-up=> if not, create a new user (create new token) (create new password)
        const existingUser = await this.userModel.findOne({
            where: {
                email: user.email,
            },
        });
        if (!existingUser) {
            const randomPassword = generateRandomPassword();
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            await this.userModel.create({
                email: user.email,
                name: user.name,
                picture: user.picture,
                password: hashedPassword,
                role: 'user', 
            });
        }
        const token = this.generateToken(existingUser || user);
        
        return {
            user: {
                id: existingUser?.id || user.id,
                email: user.email,
                name: user.name,
                picture: user.picture,
                role: existingUser?.role || 'user', 
                message : 'User signed up successfully',
            },
            token,
        };
    }
    //sign-in=> check if user exists in the db (create new token)
    async signIn(user: any): Promise<any> {
        const existingUser = await this.userModel.findOne({
            where: {
                email: user.email,
            },
        });
        if (!existingUser) {
            throw new Error('User not found');
        }
        const token = this.generateToken(existingUser);
        return {
            user: {
                id: existingUser.id,
                email: existingUser.email,
                name: existingUser.name,
                picture: existingUser.picture,
                role: existingUser.role,
                message : 'User signed in successfully',
            },
            token,
        };
    }
}

//  <sign-up>
// case 1: لزم يدخل باسورد عشان يقدر يخش علي النظام
// case 2: مش لزم المستخدم يدخل باسورد و ممكن يدخله في اي وقت كان .. في حالة تسجيل الدخول مرة اخري لزم يسجل بنفس المنصة الخارجية\
