import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ description: 'User email', example: 'newUser@gmail.com' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ description: 'User refresh token', example: 'your_refresh_token' })
    @IsString()
    @IsOptional()
    refreshToken?: string;
}
