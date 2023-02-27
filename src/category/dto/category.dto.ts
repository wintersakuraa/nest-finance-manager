import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
    @ApiProperty({ description: 'Category name', type: String, example: 'food' })
    @IsString({ message: 'Category name should be a string' })
    @IsNotEmpty({ message: 'Category name is required' })
    name: string;
}
