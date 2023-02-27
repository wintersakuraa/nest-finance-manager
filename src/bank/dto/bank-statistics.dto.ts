import { ArrayNotEmpty, IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBankDto {
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    categoryIds: number[];

    @IsDate()
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    fromPeriod: Date;

    @IsDate()
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    toPeriod: Date;
}
