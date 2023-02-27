import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Category } from '../category.entity';
import { CategoryDto } from '../dto';
import { BankStatisticsDto } from '../../bank/dto';
import { User } from '../../user/user.entity';
import { CategoryNotFoundException } from '../exception';

@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}

    async createCategory(user: User, categoryDto: CategoryDto): Promise<Category> {
        const category = this.categoryRepository.create({
            ...categoryDto,
            user,
        });

        return await this.categoryRepository.save(category);
    }

    async getAllCategories(user: User): Promise<Category[]> {
        return await this.categoryRepository.find({
            where: { user },
        });
    }

    async getCategoryById(user: User, categoryId: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: {
                id: categoryId,
                user,
            },
        });
        if (!category) {
            throw new CategoryNotFoundException();
        }

        return category;
    }

    async updateCategory(user: User, categoryId: number, categoryDto: CategoryDto): Promise<Category> {
        await this.categoryRepository.update({ id: categoryId, user }, categoryDto);

        const category = await this.categoryRepository.findOne({
            where: {
                id: categoryId,
                user,
            },
        });
        if (!category) {
            throw new CategoryNotFoundException();
        }

        return category;
    }

    async deleteCategory(user: User, categoryId: number) {
        const category = await this.categoryRepository.findOne({
            where: {
                id: categoryId,
                user,
            },
        });
        const res = await this.categoryRepository.remove(category);
        if (!res) {
            throw new CategoryNotFoundException();
        }
    }

    async getCategoriesForStatistics(
        user: User,
        bankId: number,
        bankStatisticsDto: BankStatisticsDto,
    ): Promise<Category[]> {
        // find categories that contain transactions created in determined period and bank id
        return await this.categoryRepository.find({
            relations: { transactions: true },
            select: {
                name: true,
                transactions: {
                    amount: true,
                    type: true,
                },
            },
            where: {
                id: In(bankStatisticsDto.categoryIds),
                user,
                transactions: {
                    createdAt: Between(bankStatisticsDto.fromPeriod, bankStatisticsDto.toPeriod),
                    bank: {
                        id: bankId,
                    },
                },
            },
        });
    }
}
