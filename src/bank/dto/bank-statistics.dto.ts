import { ArrayNotEmpty, IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BankStatisticsDto {
    @ApiProperty({ description: 'Array of category ids', example: [1, 2, 3], type: [Number] })
    @ArrayNotEmpty({ message: 'Provide at list one category id' })
    @IsNumber({}, { each: true, message: 'Category id should be a number' })
    categoryIds: number[];

    @ApiProperty({ description: 'From period date', example: '2023-01-01', type: Date })
    @IsDate({ message: 'From period should be a date' })
    @IsNotEmpty({ message: 'From period is required' })
    @Transform(({ value }) => new Date(value))
    fromPeriod: Date;

    @ApiProperty({ description: 'To period date', example: '2023-02-23', type: Date })
    @IsDate({ message: 'To period should be a date' })
    @IsNotEmpty({ message: 'To period is required' })
    @Transform(({ value }) => new Date(value))
    toPeriod: Date;
}
