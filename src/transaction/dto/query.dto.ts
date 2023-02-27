import { ArrayNotEmpty, IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { TransactionType } from '../transaction.entity';

export class TransactionDto {
    @IsPositive()
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    amount: string;

    @IsNotEmpty()
    @IsEnum(TransactionType)
    type: TransactionType;

    @IsNotEmpty()
    bankId: number;

    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    categoryIds: number[];
}
