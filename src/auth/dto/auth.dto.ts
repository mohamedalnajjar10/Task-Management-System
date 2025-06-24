import { IsString, MaxLength, MinLength, IsEmail } from "class-validator";

export class SingUpDto {
    @IsString()
    @MinLength(3, { message: "Name must be at least 3 characters" })
    @MaxLength(20, { message: "Name must be at most 20 characters" })
    name: string;

    @IsString()
    @IsEmail({}, { message: "Email is not valid" })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @MinLength(3, { message: 'password must be at least 3 characters' })
    @MaxLength(20, { message: 'password must be at most 20 characters' })
    password: string;

    @IsString()
    @MinLength(3, { message: "Role must be at least 3 characters" })
    @MaxLength(20, { message: "Role must be at most 20 characters" })
    role: string;
}

export class SingInDto {
    @IsString()
    @IsEmail({}, { message: "Email is not valid" })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @MinLength(3, { message: 'password must be at least 3 characters' })
    @MaxLength(20, { message: 'password must be at most 20 characters' })
    password: string;
    
}

export class ResetPasswordDto {
    @IsString()
    @IsEmail({}, { message: "Email is not valid" })
    email: string;
}

export class ChangePasswordDto {

    @IsString()
    @MinLength(3, { message: "password must be at least 3 characters" })
    @MaxLength(20, { message: "password must be at most 20 characters" })
    oldPassword: string;

    @IsString()
    @MinLength(3, { message: "password must be at least 3 characters" })
    @MaxLength(20, { message: "password must be at most 20 characters" })
    newPassword: string;

    @IsString()
    @IsEmail({}, { message: "Email is not valid" })
    email: string;
}