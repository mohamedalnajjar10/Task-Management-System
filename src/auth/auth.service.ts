import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto, ResetPasswordDto, SingInDto } from './dto/auth.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
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

    async singup(singupDto: SingInDto) {
        const user = await this.userModel.findOne({
            where: {
                email: singupDto.email
            }
        })
        if (user) {
            throw new ConflictException('User already exists');
        }
        const hahedPassword = await bcrypt.hash(singupDto.password, 10);

        const newUser = await this.userModel.create({
            ...singupDto,
            password: hahedPassword
        });


        const token = this.generateToken(newUser);

        return {
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            },
            token
        }
    }

    async login(singinDto: SingInDto) {
        const user = await this.userModel.findOne({
            where: {
                email: singinDto.email
            }
        })
        if (!user) {
            throw new ConflictException('User not found');
        }
        const isMatch = await bcrypt.compare(singinDto.password, user.password);
        if (!isMatch) {
            throw new ConflictException('Invalid credentials');
        }

        const token = this.generateToken(user);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token
        }
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const user = await this.userModel.findOne({
            where: {
                email: resetPasswordDto.email
            }
        })
        if (!user) {
            throw new ConflictException('User not found');
        }
        //create code 6 digit

        const code = Math.floor(100000 + Math.random() * 900000).toString().padStart(6, '0');

        const hashedCode = await crypto
            .createHash('sha256')
            .update(code)
            .digest('hex');

        await this.userModel.update(
            {
                passwordResetCode: hashedCode,
                passwordResetExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
            },
            {
                where: { email: resetPasswordDto.email },
            }
        );
        // return code;
        await this.userModel.findOne({
            where: {
                email: resetPasswordDto.email
            }
        })

        const message = `Forgot your password? If you didn't forget your password, please ignore this email!
                          Your password reset code is ${code}. The code is valid for 15 m.`;

        this.mailService.sendMail({
            from: 'Task-Management Admin' + '<' + process.env.EMAIL_USER + '>',
            to: resetPasswordDto.email,
            subject: 'Reset Password',
            html: `
        <h1>Hello ${user.name},</h1>
        <p>${message}</p>
        <p>Your reset code is: <strong>${code}</strong></p>
        <p>This code will expire in 15 minutes.</p>
    `
        });
        return {
            message: 'Reset password code sent to your email',

        }
    }

    async verifyResetCode(email: string, code: string) {
        const user = await this.userModel.findOne({
            where: {
                email: email
            }
        })
        if (!user) {
            throw new ConflictException('User not found');
        }
        const hashedCode = await crypto
            .createHash('sha256')
            .update(code)
            .digest('hex');

        if (user.passwordResetCode !== hashedCode) {
            throw new ConflictException('Invalid code');
        }

        if (user.passwordResetExpires < new Date()) {
            throw new ConflictException('Code expired');
        }

        await this.userModel.update(
            { passwordResetCode: hashedCode, verifyResetCode: true },
            { where: { email: email } }
        );

        await this.userModel.findOne({
            where: {
                email: email
            }
        })
        return {
            message: 'Code verified successfully',
        }
    }

    async changePassword(changePasswordDto: ChangePasswordDto) {
        const user = await this.userModel.findOne({
            where: {
                email: changePasswordDto.email
            }
        });
        if (!user) {
            throw new ConflictException('User not found');
        }

        const isMatch = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
        if (!isMatch) {
            throw new ConflictException('Invalid credentials');
        }
        if (changePasswordDto.oldPassword === changePasswordDto.newPassword) {
            throw new ConflictException('New password must be different from old password');
        }
        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        await this.userModel.update(
            {
                password: hashedPassword,
                passwordChangedAt: new Date(),
                passwordResetCode: null,
                passwordResetExpires: null,
            },
            { where: { email: changePasswordDto.email } }
        );
        return {
            message: 'Password changed successfully',
        };
    }
}

