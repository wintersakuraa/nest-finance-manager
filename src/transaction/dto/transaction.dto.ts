import { ArrayNotEmpty, IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { TransactionType } from '../transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
    @ApiProperty({ description: 'Transaction amount', type: Number, example: 100.0 })
    @IsPositive({ message: 'Transaction amount should be a positive number' })
    @IsNotEmpty({ message: 'Transaction amount is required' })
    @IsNumber({ maxDecimalPlaces: 2 })
    amount: number;

    @ApiProperty({ description: 'Transaction type', enum: TransactionType, example: 0 })
    @IsNotEmpty({ message: 'Transaction type is required' })
    @IsEnum(TransactionType)
    type: TransactionType;

    @ApiProperty({ description: 'Transaction bank id', type: Number, example: 1 })
    @IsNotEmpty({ message: 'Transaction bankId is required' })
    bankId: number;

    @ApiProperty({ description: 'Bank owner id', type: Number, example: 1 })
    @IsNotEmpty({ message: 'Transaction userId is required' })
    userId: number;

    @ApiProperty({ description: 'Transaction category ids', type: [Number], example: [1, 2] })
    @ArrayNotEmpty({ message: 'Provide at list one category id' })
    @IsNumber({}, { each: true, message: 'Category id should be a number' })
    categoryIds: number[];
}
