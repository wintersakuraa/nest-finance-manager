import { Module } from '@nestjs/common';
import { BankController } from './controller/bank.controller';
import { BankService } from './service/bank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from './bank.entity';
import { CategoryModule } from '../category/category.module';

@Module({
    imports: [TypeOrmModule.forFeature([Bank]), CategoryModule],
    controllers: [BankController],
    providers: [BankService],
    exports: [BankService],
})
export class BankModule {}
