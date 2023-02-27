import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryDto {
    @ApiProperty({ minimum: 0, default: 0, type: Number, required: false })
    @Type(() => Number)
    @IsInt({ message: 'skip parameter should be an integer' })
    @IsOptional()
    skip?: number;

    @ApiProperty({ type: Number, minimum: 0, required: false })
    @Type(() => Number)
    @IsInt({ message: 'take parameter should be an integer' })
    @IsOptional()
    take?: number;
}
