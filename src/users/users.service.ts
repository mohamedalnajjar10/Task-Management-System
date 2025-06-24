import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';
import { I18nContext, I18nService } from 'nestjs-i18n';


@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User)
    private userRepository: Repository<User>,
    private readonly i18n: I18nService,
  ) { }


  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userExists) {
      throw new ConflictException(this.i18n.t('test.HELLO', { lang: I18nContext.current()?.lang ?? 'en' }));
      //'User already exists'
    }

    const hashedPassword: string = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: this.userRepository['role'] || 'user',
    });

    return newUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll({
      attributes: ['id', 'name', 'email', 'role'],
      order: [['id', 'ASC']],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(
    id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // Check if email is being updated and if it already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }
    // Hash password if it's being updated
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    // Update user
    await this.userRepository.update(updateUserDto, {
      where: { id },
    });
    // Return updated user
    const updatedUser = await this.userRepository.findOne({
      where: { id },
      attributes: ['id', 'name', 'email'],
    });
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.destroy({ where: { id } });
    return {
      message: `User with ID ${id} deleted successfully`,
    };
  }
}