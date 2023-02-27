import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DeepPartial } from 'typeorm';
import { User } from '../user.entity';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { UserNotFoundException } from '../exception';

describe('UserService', () => {
    let userService: UserService;

    const mockUserRepository = {
        create: jest.fn().mockImplementation((user: DeepPartial<User>) => new User()),
        save: jest.fn().mockImplementation((user: User) => Promise.resolve(user)),
        remove: jest.fn().mockImplementation((user: User) => Promise.resolve(user)),
        update: jest.fn().mockReturnValue((criteria, partialEntity) => Promise.resolve(UpdateResult)),
        find: jest.fn(),
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    describe('create user', () => {
        const userDto: CreateUserDto = {
            email: 'wintersakura@gmail.com',
            password: '123456',
        };

        it('should return new user', async () => {
            await expect(userService.createUser(userDto)).resolves.toEqual({ ...userDto } as User);
            expect(mockUserRepository.save).toHaveBeenCalledWith({ ...userDto });
        });
    });

    describe('update user', () => {
        const userId = 1;
        const userDto: UpdateUserDto = {
            email: 'wintersakura@gmail.com',
        };

        describe('when user exists', () => {
            beforeEach(() => {
                mockUserRepository.findOne.mockReturnValue(Promise.resolve({} as User));
            });

            it('should return user', async () => {
                await expect(userService.updateUser(userId, userDto)).resolves.toEqual({} as User);
                expect(mockUserRepository.update).toHaveBeenCalledWith(userId, userDto);
                expect(mockUserRepository.findOne).toHaveBeenCalled();
            });
        });

        describe('when user does not exist', () => {
            beforeEach(() => {
                mockUserRepository.findOne.mockReturnValue(Promise.resolve(null));
            });

            it('should throw UserNotFoundException', async () => {
                await expect(userService.updateUser(userId, userDto)).rejects.toThrow(UserNotFoundException);
                expect(mockUserRepository.update).toHaveBeenCalledWith(userId, userDto);
                expect(mockUserRepository.findOne).toHaveBeenCalled();
            });
        });
    });

    describe('get user by id', () => {
        const userId = 1;

        describe('when user exists', () => {
            beforeEach(() => {
                mockUserRepository.findOne.mockReturnValue(Promise.resolve({} as User));
            });

            it('should return user', async () => {
                await expect(userService.getUserById(userId)).resolves.toEqual({} as User);
                expect(mockUserRepository.findOne).toHaveBeenCalled();
            });
        });

        describe('when user does not exist', () => {
            beforeEach(() => {
                mockUserRepository.findOne.mockReturnValue(Promise.resolve(null));
            });

            it('should throw UserNotFoundException', async () => {
                await expect(userService.getUserById(userId)).rejects.toThrow(UserNotFoundException);
                expect(mockUserRepository.findOne).toHaveBeenCalled();
            });
        });
    });

    describe('get user by email', () => {
        const email = 'wintersakura@gmail.com';

        describe('when user exists', () => {
            beforeEach(() => {
                mockUserRepository.findOne.mockReturnValue(Promise.resolve({} as User));
            });

            it('should return user', async () => {
                await expect(userService.getUserByEmail(email)).resolves.toEqual({} as User);
                expect(mockUserRepository.findOne).toHaveBeenCalled();
            });
        });

        describe('when user does not exist', () => {
            beforeEach(() => {
                mockUserRepository.findOne.mockReturnValue(Promise.resolve(null));
            });

            it('should return null', async () => {
                await expect(userService.getUserByEmail(email)).resolves.toEqual(null);
                expect(mockUserRepository.findOne).toHaveBeenCalled();
            });
        });
    });
});
