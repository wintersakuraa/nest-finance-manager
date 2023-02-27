import { DataSource, DeepPartial } from 'typeorm';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { TransactionService } from './transaction.service';
import { Transaction } from '../transaction.entity';
import { QueryDto, TransactionDto } from '../dto';
import { BankService } from '../../bank/service/bank.service';
import { CategoryService } from '../../category/service/category.service';
import { UserService } from '../../user/service/user.service';
import { Category } from '../../category/category.entity';
import { Bank } from '../../bank/bank.entity';
import { TransactionNotFoundException } from '../exception';

describe('TransactionService', () => {
    let transactionService: TransactionService;

    const mockTransactionRepository = {
        create: jest.fn().mockImplementation((transaction: DeepPartial<Transaction>) => new Transaction()),
        save: jest.fn().mockImplementation((transaction: Transaction) => Promise.resolve(transaction)),
        remove: jest.fn().mockImplementation((transaction: Transaction) => Promise.resolve(transaction)),
        update: jest.fn().mockReturnValue((criteria, partialEntity) => Promise.resolve(UpdateResult)),
        find: jest.fn(),
        findOne: jest.fn(),
    };

    const getCategoryById = jest
        .fn()
        .mockImplementation((user: User, categoryId: number) => Promise.resolve({} as Category));

    const getUserById = jest.fn().mockImplementation((userId: number) => Promise.resolve({} as User));

    const getBankById = jest
        .fn()
        .mockImplementation((user: User, bankId: number) => Promise.resolve({ balance: 0 } as Bank));

    const createQueryRunner = jest.fn().mockImplementation(() => ({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        release: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        manager: {
            save: jest.fn(),
            update: jest.fn(),
        },
    }));

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionService,
                {
                    provide: getRepositoryToken(Transaction),
                    useValue: mockTransactionRepository,
                },
                {
                    provide: BankService,
                    useValue: {
                        getBankById,
                    },
                },
                {
                    provide: CategoryService,
                    useValue: {
                        getCategoryById,
                    },
                },
                {
                    provide: UserService,
                    useValue: {
                        getUserById,
                    },
                },
                {
                    provide: DataSource,
                    useValue: {
                        createQueryRunner,
                    },
                },
            ],
        }).compile();

        transactionService = module.get<TransactionService>(TransactionService);
    });

    it('should be defined', () => {
        expect(transactionService).toBeDefined();
    });

    describe('create transaction', () => {
        const transactionDto: TransactionDto = {
            amount: 1,
            type: 1,
            bankId: 1,
            userId: 1,
            categoryIds: [1, 2],
        };

        it('should call manager.update and manager.save', async () => {
            await transactionService.createTransaction(transactionDto);

            expect(getUserById).toHaveBeenCalledWith(transactionDto.userId);
            expect(getUserById).toHaveReturnedWith(Promise.resolve({} as User));

            expect(getCategoryById).toHaveBeenCalled();
            expect(getCategoryById).toHaveReturnedWith(Promise.resolve({} as Category));

            expect(getBankById).toHaveBeenCalled();
            expect(getBankById).toHaveReturnedWith(Promise.resolve({ balance: 0 } as Bank));

            expect(createQueryRunner).toHaveBeenCalled();

            expect(mockTransactionRepository.create).toHaveBeenCalled();
        });
    });

    describe('get all transaction', () => {
        const user = {} as User;
        const bankId = 1;

        describe('when no query provided', () => {
            const query: QueryDto = {
                skip: 0,
                take: 0,
            };

            beforeEach(() => {
                mockTransactionRepository.find.mockReturnValue(Promise.resolve([] as Transaction[]));
            });

            it('should return transactions array', async () => {
                await expect(transactionService.getAllTransactions(user, bankId, query)).resolves.toEqual(
                    [] as Transaction[],
                );
                expect(mockTransactionRepository.find).toHaveBeenCalled();
            });
        });

        describe('when no query provided', () => {
            const query: QueryDto = {
                skip: 0,
                take: 2,
            };

            beforeEach(() => {
                mockTransactionRepository.find.mockReturnValue(
                    Promise.resolve([{} as Transaction, {} as Transaction] as Transaction[]),
                );
            });

            it('should return transactions array with 2 values', async () => {
                await expect(transactionService.getAllTransactions(user, bankId, query)).resolves.toEqual([
                    {} as Transaction,
                    {} as Transaction,
                ] as Transaction[]);
                expect(mockTransactionRepository.find).toHaveBeenCalled();
            });
        });
    });

    describe('delete transaction', () => {
        const user = {} as User;
        const transactionId = 1;

        describe('when transaction exists', () => {
            beforeEach(() => {
                mockTransactionRepository.findOne.mockReturnValue(Promise.resolve({} as Transaction));
            });

            it('should call remove', async () => {
                await transactionService.deleteTransaction(user, transactionId);
                expect(mockTransactionRepository.findOne).toHaveBeenCalled();
                expect(mockTransactionRepository.remove).toHaveBeenCalledWith({} as Transaction);
                expect(mockTransactionRepository.remove).toHaveReturnedWith(Promise.resolve(Transaction));
            });
        });

        describe('when transaction does not exist', () => {
            beforeEach(() => {
                mockTransactionRepository.findOne.mockReturnValue(Promise.resolve(null));
            });

            it('should throw TransactionNotFoundException', async () => {
                await expect(transactionService.deleteTransaction(user, transactionId)).rejects.toThrow(
                    TransactionNotFoundException,
                );
                expect(mockTransactionRepository.findOne).toHaveBeenCalled();
                expect(mockTransactionRepository.remove).toHaveBeenCalledWith(null);
            });
        });
    });
});
