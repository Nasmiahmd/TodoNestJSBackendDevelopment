import { IsBoolean, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty({ message: 'Provide a Todo!' })
  @MinLength(2, { message: 'Todo must be at least 2 charaters long' })
  text: string;

  @IsOptional()
  @IsBoolean({ message: 'Completed status must be a boolean (true or false).' })
  completed?: boolean;
}
