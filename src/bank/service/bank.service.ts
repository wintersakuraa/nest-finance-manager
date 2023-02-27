import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from '../bank.entity';
import { BankDto, BankStatisticsDto } from '../dto';
import { Injectable } from '@nestjs/common';
import { User } from '../../user/user.entity';
import { CategoryService } from '../../category/service/category.service';
import { Transaction, TransactionType } from '../../transaction/transaction.entity';
import { BankNotFoundException } from '../exception';

@Injectable()
export class BankService {
    constructor(
        @InjectRepository(Bank) private readonly bankRepository: Repository<Bank>,
        private readonly categoryService: CategoryService,
    ) {}

    async createBank(user: User, bankDto: BankDto): Promise<Bank> {
        const bank = this.bankRepository.create({
            ...bankDto,
            user,
        });

        return await this.bankRepository.save(bank);
    }

    async getAllBanks(user: User): Promise<Bank[]> {
        return await this.bankRepository.find({
            where: { user },
            relations: { user: true },
        });
    }

    async getBankById(user: User, bankId: number): Promise<Bank> {
        const bank = await this.bankRepository.findOne({
            where: {
                id: bankId,
                user,
            },
            relations: { user: true },
        });
        if (!bank) {
            throw new BankNotFoundException();
        }

        return bank;
    }

    async updateBank(user: User, bankId: number, bankDto: BankDto): Promise<Bank> {
        await this.bankRepository.update({ id: bankId, user }, bankDto);

        const bank = await this.bankRepository.findOne({
            where: {
                id: bankId,
                user,
            },
            relations: {
                user: true,
            },
        });
        if (!bank) {
            throw new BankNotFoundException();
        }

        return bank;
    }

    async deleteBank(user: User, bankId: number) {
        const bank = await this.bankRepository.findOne({
            where: {
                id: bankId,
                user,
            },
        });

        const res = await this.bankRepository.remove(bank);
        if (!res) {
            throw new BankNotFoundException();
        }
    }

    async getBankStatistics(user: User, bankId: number, bankStatisticsDto: BankStatisticsDto) {
        const categories = await this.categoryService.getCategoriesForStatistics(user, bankId, bankStatisticsDto);

        const statistics = [];
        for (const category of categories) {
            const totalAmount = category.transactions.reduce((acc: number, value: Transaction) => {
                switch (value.type) {
                    case TransactionType.PROFITABLE:
                        acc += value.amount;
                        break;
                    case TransactionType.CONSUMABLE:
                        acc -= value.amount;
                        break;
                }
                return acc;
            }, 0);
            statistics.push({ [category.name]: totalAmount });
        }

        return statistics;
    }
}
