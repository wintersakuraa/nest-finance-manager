import { DeepPartial } from 'typeorm';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { Category } from '../category.entity';
import { User } from '../../user/user.entity';
import { CategoryDto } from '../dto';
import { CategoryNotFoundException } from '../exception';
import { BankStatisticsDto } from '../../bank/dto';

describe('CategoryService', () => {
    let categoryService: CategoryService;

    const mockCategoryRepository = {
        create: jest.fn().mockImplementation((category: DeepPartial<Category>) => new Category()),
        save: jest.fn().mockImplementation((category: Category) => Promise.resolve(category)),
        remove: jest.fn().mockImplementation((category: Category) => Promise.resolve(category)),
        update: jest.fn().mockReturnValue((criteria, partialEntity) => Promise.resolve(UpdateResult)),
        find: jest.fn(),
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryService,
                {
                    provide: getRepositoryToken(Category),
                    useValue: mockCategoryRepository,
                },
            ],
        }).compile();

        categoryService = module.get<CategoryService>(CategoryService);
    });

    it('should be defined', () => {
        expect(categoryService).toBeDefined();
    });

    describe('create category', () => {
        const user = {} as User;
        const categoryDto: CategoryDto = {
            name: 'food',
        };

        it('should return new category', async () => {
            await expect(categoryService.createCategory(user, categoryDto)).resolves.toEqual({} as Category);
            expect(mockCategoryRepository.create).toHaveBeenCalledWith({ ...categoryDto, user });
            expect(mockCategoryRepository.save).toHaveBeenCalledWith({} as Category);
        });
    });

    describe('get all categories', () => {
        const user = {} as User;

        beforeEach(() => {
            mockCategoryRepository.find.mockReturnValue(Promise.resolve([] as Category[]));
        });

        it('should return category array', async () => {
            await expect(categoryService.getAllCategories(user)).resolves.toEqual([] as Category[]);
            expect(mockCategoryRepository.find).toHaveBeenCalled();
        });
    });

    describe('get category by id', () => {
        const user = {} as User;
        const categoryId = 1;

        describe('when category exists', () => {
            beforeEach(() => {
                mockCategoryRepository.findOne.mockReturnValue(Promise.resolve({} as Category));
            });

            it('should return category', async () => {
                await expect(categoryService.getCategoryById(user, categoryId)).resolves.toEqual({} as Category);
                expect(mockCategoryRepository.findOne).toHaveBeenCalled();
            });
        });

        describe('when category does not exist', () => {
            beforeEach(() => {
                mockCategoryRepository.findOne.mockReturnValue(Promise.resolve(null));
            });

            it('should throw CategoryNotFoundException', async () => {
                await expect(categoryService.getCategoryById(user, categoryId)).rejects.toThrow(
                    CategoryNotFoundException,
                );
                expect(mockCategoryRepository.findOne).toHaveBeenCalled();
            });
        });
    });

    describe('update category', () => {
        const user = {} as User;
        const categoryId = 1;
        const categoryDto: CategoryDto = {
            name: 'food',
        };

        describe('when category exists', () => {
            beforeEach(() => {
                mockCategoryRepository.findOne.mockReturnValue(Promise.resolve({} as Category));
            });

            it('should return category', async () => {
                await expect(categoryService.updateCategory(user, categoryId, categoryDto)).resolves.toEqual(
                    {} as Category,
                );
                expect(mockCategoryRepository.update).toHaveBeenCalledWith(
                    {
                        id: categoryId,
                        user,
                    },
                    categoryDto,
                );
                expect(mockCategoryRepository.findOne).toHaveBeenCalled();
            });
        });

        describe('when category does not exist', () => {
            beforeEach(() => {
                mockCategoryRepository.findOne.mockReturnValue(Promise.resolve(null));
            });

            it('should throw CategoryNotFoundException', async () => {
                await expect(categoryService.updateCategory(user, categoryId, categoryDto)).rejects.toThrow(
                    CategoryNotFoundException,
                );
                expect(mockCategoryRepository.update).toHaveBeenCalledWith(
                    {
                        id: categoryId,
                        user,
                    },
                    categoryDto,
                );
                expect(mockCategoryRepository.findOne).toHaveBeenCalled();
            });
        });
    });

    describe('delete category', () => {
        const user = {} as User;
        const categoryId = 1;

        describe('when category exists', () => {
            beforeEach(() => {
                mockCategoryRepository.findOne.mockReturnValue(Promise.resolve({} as Category));
            });

            it('should call remove', async () => {
                await categoryService.deleteCategory(user, categoryId);
                expect(mockCategoryRepository.findOne).toHaveBeenCalled();
                expect(mockCategoryRepository.remove).toHaveBeenCalledWith({} as Category);
                expect(mockCategoryRepository.remove).toHaveReturnedWith(Promise.resolve(Category));
            });
        });

        describe('when category does not exist', () => {
            beforeEach(() => {
                mockCategoryRepository.findOne.mockReturnValue(Promise.resolve(null));
            });

            it('should throw BankNotFoundException', async () => {
                await expect(categoryService.deleteCategory(user, categoryId)).rejects.toThrow(
                    CategoryNotFoundException,
                );
                expect(mockCategoryRepository.findOne).toHaveBeenCalled();
                expect(mockCategoryRepository.remove).toHaveBeenCalledWith(null);
            });
        });
    });

    describe('get categories for statistics', () => {
        const user = {} as User;
        const bankId = 1;
        const bankStatisticsDto: BankStatisticsDto = {
            categoryIds: [1, 2],
            fromPeriod: new Date(),
            toPeriod: new Date(),
        };

        describe('when category exists', () => {
            beforeEach(() => {
                mockCategoryRepository.find.mockReturnValue(Promise.resolve([] as Category[]));
            });

            it('should return categories array', async () => {
                await categoryService.getCategoriesForStatistics(user, bankId, bankStatisticsDto);
                expect(mockCategoryRepository.find).toHaveBeenCalled();
                expect(mockCategoryRepository.find).toHaveReturnedWith(Promise.resolve([] as Category[]));
            });
        });
    });
});
