import { IsInt, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Is } from "sequelize-typescript";


export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5, { message: 'Content must be at least 5 characters long', })
    content: string;
    @IsNotEmpty()
    @IsInt({ message: 'taskId must be an integer' })
    taskId: number;
    @IsNotEmpty({ message: 'UserId is required' })
    @IsInt({ message: 'userId must be an integer' })
    userId: number;
}
