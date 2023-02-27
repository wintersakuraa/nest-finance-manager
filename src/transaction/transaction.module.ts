import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionController } from './controller/transaction.controller';
import { TransactionService } from './service/transaction.service';
import { CategoryModule } from '../category/category.module';
import { BankModule } from '../bank/bank.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Transaction]), BankModule, CategoryModule, UserModule],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [TransactionService],
})
export class TransactionModule {}
