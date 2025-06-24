import { IsString, MinLength , IsOptional , IsInt , IsIn , IsDateString, IsNotEmpty} from "class-validator";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    @MinLength(3, { message: 'Title is too short. Minimum length is 3 characters' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'Description is required' })
    @MinLength(10, { message: 'Description is too short. Minimum length is 10 characters' })
    description: string;

    @IsOptional()
    @IsDateString({}, { message: 'dueDate must be a valid ISO date string' })
    dueDate?: string;

    @IsOptional()
    @IsIn(['low', 'medium', 'high'], { message: 'Priority must be low, medium, or high' })
    priority?: string;

    @IsNotEmpty({ message: 'UserId is required' })
    @IsInt({ message: 'userId must be an integer' })
    userId: number;
}
