import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBankDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
