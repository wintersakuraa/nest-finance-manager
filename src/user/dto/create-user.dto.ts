import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'User email', example: 'newUser@gmail.com' })
    @IsEmail()
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({ description: 'User password', example: '123456' })
    @MinLength(6, { message: 'Password should be at least 6 characters' })
    @MaxLength(25, { message: 'Password should be less than 25 characters' })
    @IsString({ message: 'Password should be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
