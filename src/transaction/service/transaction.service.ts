import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionType } from '../transaction.entity';
import { DataSource, Repository } from 'typeorm';
import { QueryDto, TransactionDto } from '../dto';
import { BankService } from '../../bank/service/bank.service';
import { CategoryService } from '../../category/service/category.service';
import { Category } from '../../category/category.entity';
import { Bank } from '../../bank/bank.entity';
import { User } from '../../user/user.entity';
import { UserService } from '../../user/service/user.service';
import { TransactionNotFoundException } from '../exception';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
        private readonly bankService: BankService,
        private readonly categoryService: CategoryService,
        private readonly userService: UserService,
        private readonly dataSource: DataSource,
    ) {}

    async createTransaction(transactionDto: TransactionDto) {
        // find transaction owner
        const user = await this.userService.getUserById(transactionDto.userId);

        // get all categories listed in dto
        const categories: Category[] = [];
        for (const categoryId of transactionDto.categoryIds) {
            const category = await this.categoryService.getCategoryById(user, categoryId);
            categories.push(category);
        }

        const transaction = this.transactionRepository.create({
            ...transactionDto,
            categories,
        });

        // find bank and calculate balance
        const bank = await this.bankService.getBankById(user, transactionDto.bankId);
        switch (transaction.type) {
            case TransactionType.CONSUMABLE:
                bank.balance -= transactionDto.amount;
                break;
            case TransactionType.PROFITABLE:
                bank.balance += transactionDto.amount;
                break;
        }

        // update bank balance and save bank transaction (in DB transaction)
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(Bank, bank.id, { balance: bank.balance });
            transaction.bank = bank;
            await queryRunner.manager.save(transaction);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getAllTransactions(user: User, bankId: number, query: QueryDto): Promise<Transaction[]> {
        return await this.transactionRepository.find({
            relations: {
                bank: true,
                categories: true,
            },
            where: {
                bank: {
                    id: bankId,
                    user: user,
                },
            },
            skip: query.skip,
            take: query.take,
        });
    }

    async deleteTransaction(user: User, transactionId: number) {
        const transaction = await this.transactionRepository.findOne({
            where: {
                id: transactionId,
                bank: {
                    user: user,
                },
            },
        });

        const res = await this.transactionRepository.remove(transaction);
        if (!res) {
            throw new TransactionNotFoundException();
        }
    }
}
