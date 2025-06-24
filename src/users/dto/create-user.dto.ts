import { IsString, MinLength, IsEmail } from "class-validator";

export class CreateUserDto {
    @IsString()
    name : string;
    @IsEmail({}, { message: 'Invalid email address' })
    email : string;
    @IsString()
    @MinLength(6, { message: 'Password is too short. Minimum length is 6 characters' })
    password : string;
}
