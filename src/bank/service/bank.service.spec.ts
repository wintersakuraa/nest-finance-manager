import { Test, TestingModule } from '@nestjs/testing';
import { BankService } from './bank.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bank } from '../bank.entity';
import { DeepPartial } from 'typeorm';
import { User } from '../../user/user.entity';
import { BankDto, BankStatisticsDto } from '../dto';
import { CategoryService } from '../../category/service/category.service';
import { BankNotFoundException } from '../exception';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { Category } from '../../category/category.entity';
import { Transaction, TransactionType } from '../../transaction/transaction.entity';

describe('BankService', () => {
    let bankService: BankService;

    const mockBankRepository = {
        create: jest.fn().mockImplementation((bank: DeepPartial<Bank>) => new Bank()),
        save: jest.fn().mockImplementation((bank: Bank) => Promise.resolve(bank)),
        remove: jest.fn().mockImplementation((bank: Bank) => Promise.resolve(bank)),
        update: jest.fn().mockReturnValue((criteria, partialEntity) => Promise.resolve(UpdateResult)),
        find: jest.fn(),
        findOne: jest.fn(),
    };

    // mock for category service
    let getCategoriesForStatistics: jest.Mock;

    beforeEach(async () => {
        getCategoriesForStatistics = jest.fn();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BankService,
                {
                    provide: getRepositoryToken(Bank),
                    useValue: mockBankRepository,
                },
                {
                    provide: CategoryService,
                    useValue: { getCategoriesForStatistics },
                },
            ],
        }).compile();

        bankService = module.get<BankService>(BankService);
    });

    it('should be defined', () => {
        expect(bankService).toBeDefined();
    });

    describe('create bank', () => {
        const user = {} as User;
        const bankDto: BankDto = {
            name: 'new bank',
        };

        it('should return new bank', async () => {
            await expect(bankService.createBank(user, bankDto)).resolves.toEqual({} as Bank);
            expect(mockBankRepository.create).toHaveBeenCalledWith({ ...bankDto, user });
            expect(mockBankRepository.save).toHaveBeenCalledWith({} as Bank);
        });
    });

    describe('get all banks', () => {
        const user = {} as User;

        beforeEach(() => {
            mockBankRepository.find.mockReturnValue(Promise.resolve([] as Bank[]));
        });

        it('should return bank array', async () => {
            await expect(bankService.getAllBanks(user)).resolves.toEqual([] as Bank[]);
            expect(mockBankRepository.find).toHaveBeenCalled();
        });
    });

    describe('get bank by id', () => {
        const user = {} as User;
        const bankId = 1;

        describe('when bank exists', () => {
            beforeEach(() => {
                mockBankRepository.findOne.mockReturnValue(Promise.resolve({} as Bank));
            });

            it('should return bank', async () => {
                await expect(bankService.getBankById(user, bankId)).resolves.toEqual({} as Bank);
                expect(mockBankRepository.findOne).toHaveBeenCalled();
            });
        });

        describe('when bank does not exist', () => {
            beforeEach(() => {
                mockBankRepository.findOne.mockReturnValue(Promise.resolve(null));
            });

            it('should throw BankNotFoundException', async () => {
                await expect(bankService.getBankById(user, bankId)).rejects.toThrow(BankNotFoundException);
                expect(mockBankRepository.findOne).toHaveBeenCalled();
            });
        });
    });

    describe('update bank', () => {
        const user = {} as User;
        const bankId = 1;
        const bankDto: BankDto = {
            name: 'new bank name',
        };

        describe('when bank exists', () => {
            beforeEach(() => {
                mockBankRepository.findOne.mockReturnValue(Promise.resolve({} as Bank));
            });

            it('should return bank', async () => {
                await expect(bankService.updateBank(user, bankId, bankDto)).resolves.toEqual({} as Bank);
                expect(mockBankRepository.update).toHaveBeenCalledWith(
                    {
                        id: bankId,
                        user,
                    },
                    bankDto,
                );
                expect(mockBankRepository.findOne).toHaveBeenCalled();
            });
        });

        describe('when bank does not exist', () => {
            beforeEach(() => {
                mockBankRepository.findOne.mockReturnValue(Promise.resolve(null));
            });

            it('should throw BankNotFoundException', async () => {
                await expect(bankService.updateBank(user, bankId, bankDto)).rejects.toThrow(BankNotFoundException);
                expect(mockBankRepository.update).toHaveBeenCalledWith(
                    {
                        id: bankId,
                        user,
                    },
                    bankDto,
                );
                expect(mockBankRepository.findOne).toHaveBeenCalled();
            });
        });
    });

    describe('delete bank', () => {
        const user = {} as User;
        const bankId = 1;

        describe('when bank exists', () => {
            beforeEach(() => {
                mockBankRepository.findOne.mockReturnValue(Promise.resolve({} as Bank));
            });

            it('should call remove', async () => {
                await bankService.deleteBank(user, bankId);
                expect(mockBankRepository.findOne).toHaveBeenCalled();
                expect(mockBankRepository.remove).toHaveBeenCalledWith({} as Bank);
                expect(mockBankRepository.remove).toHaveReturnedWith(Promise.resolve(Bank));
            });
        });

        describe('when bank does not exist', () => {
            beforeEach(() => {
                mockBankRepository.findOne.mockReturnValue(Promise.resolve(null));
            });

            it('should throw BankNotFoundException', async () => {
                await expect(bankService.deleteBank(user, bankId)).rejects.toThrow(BankNotFoundException);
                expect(mockBankRepository.findOne).toHaveBeenCalled();
                expect(mockBankRepository.remove).toHaveBeenCalledWith(null);
            });
        });
    });

    describe('get bank statistics', () => {
        const user = {} as User;
        const bankId = 1;
        const bankStatisticsDto: BankStatisticsDto = {
            categoryIds: [1, 2],
            fromPeriod: new Date(),
            toPeriod: new Date(),
        };

        describe('when categories array not empty', () => {
            // input data
            const transactionProfit = {
                type: TransactionType.PROFITABLE,
                amount: 1,
            } as Transaction;
            const transactionConsume = {
                type: TransactionType.CONSUMABLE,
                amount: 1,
            } as Transaction;
            const categorySalary = {
                name: 'salary',
                transactions: [transactionProfit],
            } as Category;
            const categoryFood = {
                name: 'food',
                transactions: [transactionConsume],
            } as Category;

            beforeEach(() => {
                getCategoriesForStatistics.mockReturnValue(
                    Promise.resolve([categorySalary, categoryFood] as Category[]),
                );
            });

            it('should return statistics array', async () => {
                await expect(bankService.getBankStatistics(user, bankId, bankStatisticsDto)).resolves.toEqual([
                    { salary: 1 },
                    { food: -1 },
                ]);
                expect(getCategoriesForStatistics).toHaveBeenCalledWith(user, bankId, bankStatisticsDto);
                expect(getCategoriesForStatistics).toHaveReturnedWith(
                    Promise.resolve([categorySalary, categoryFood] as Category[]),
                );
            });
        });

        describe('when categories array empty', () => {
            beforeEach(() => {
                getCategoriesForStatistics.mockReturnValue(Promise.resolve([] as Category[]));
            });

            it('should return empty array', async () => {
                await expect(bankService.getBankStatistics(user, bankId, bankStatisticsDto)).resolves.toEqual([]);
                expect(getCategoriesForStatistics).toHaveBeenCalledWith(user, bankId, bankStatisticsDto);
                expect(getCategoriesForStatistics).toHaveReturnedWith(Promise.resolve([] as Category[]));
            });
        });
    });
});
