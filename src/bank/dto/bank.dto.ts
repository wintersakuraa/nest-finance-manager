import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BankDto {
    @ApiProperty({ description: 'Bank name', example: 'my first bank' })
    @IsString({ message: 'Bank name should be a string' })
    @IsNotEmpty({ message: 'Bank name is required' })
    name: string;
}
