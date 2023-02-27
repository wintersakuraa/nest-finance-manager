import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../../user/dto';
import { UserAlreadyExistsException, WrongEmailException, WrongPasswordException } from '../exception';
import * as argon from 'argon2';
import { AccessDeniedException } from '../exception/access-denied.exception';

describe('AuthService', () => {
    let authService: AuthService;

    const mockUserService = {
        createUser: jest.fn().mockImplementation((userDto: CreateUserDto) => Promise.resolve(userDto)),
        updateUser: jest.fn(),
        getUserByEmail: jest.fn(),
        getUserById: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                JwtService,
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            switch (key) {
                                case 'JWT_ACCESS_SECRET':
                                    return 'somesecret';
                                case 'JWT_REFRESH_SECRET':
                                    return 'somesecretrefresh';
                                default:
                                    return null;
                            }
                        }),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('register user', () => {
        const userDto: CreateUserDto = {
            email: 'wintersakura@gmail.com',
            password: '123456',
        };

        describe('when the user does not exist', () => {
            beforeEach(() => {
                mockUserService.updateUser.mockReturnValue(null);
                mockUserService.getUserByEmail.mockReturnValue(null);
            });

            it('should return tokens', async () => {
                await expect(authService.register(userDto)).resolves.toEqual({
                    accessToken: expect.any(String),
                    refreshToken: expect.any(String),
                });
                expect(mockUserService.getUserByEmail).toHaveBeenCalled();
                expect(mockUserService.createUser).toHaveBeenCalled();
                expect(mockUserService.updateUser).toHaveBeenCalled();
            });
        });

        describe('when the user exists', () => {
            beforeEach(() => {
                mockUserService.updateUser.mockReturnValue(null);
                mockUserService.getUserByEmail.mockReturnValue({});
            });

            it('should throw UserAlreadyExistsException', async () => {
                await expect(authService.register(userDto)).rejects.toThrow(UserAlreadyExistsException);
                expect(mockUserService.getUserByEmail).toHaveBeenCalled();
            });
        });
    });

    describe('login user', () => {
        const userDto: CreateUserDto = {
            email: 'wintersakura@gmail.com',
            password: '123456',
        };

        describe('when the user exists', () => {
            beforeEach(() => {
                mockUserService.updateUser.mockReturnValue(null);
            });

            describe('and password match', () => {
                beforeEach(async () => {
                    const hash = await argon.hash('123456');
                    mockUserService.getUserByEmail.mockReturnValue(Promise.resolve({ password: hash }));
                });

                it('should return tokens', async () => {
                    await expect(authService.login(userDto)).resolves.toEqual({
                        accessToken: expect.any(String),
                        refreshToken: expect.any(String),
                    });
                    expect(mockUserService.getUserByEmail).toHaveBeenCalled();
                    expect(mockUserService.updateUser).toHaveBeenCalled();
                });
            });

            describe('and password does not match', () => {
                beforeEach(async () => {
                    const hash = await argon.hash('123457');
                    mockUserService.getUserByEmail.mockReturnValue(Promise.resolve({ password: hash }));
                });

                it('should throw WrongPasswordException', async () => {
                    await expect(authService.login(userDto)).rejects.toThrow(WrongPasswordException);
                    expect(mockUserService.getUserByEmail).toHaveBeenCalled();
                });
            });
        });

        describe('when the user does not exist', () => {
            beforeEach(() => {
                mockUserService.updateUser.mockReturnValue(null);
                mockUserService.getUserByEmail.mockReturnValue(null);
            });

            it('should throw WrongEmailException', async () => {
                await expect(authService.login(userDto)).rejects.toThrow(WrongEmailException);
                expect(mockUserService.getUserByEmail).toHaveBeenCalled();
            });
        });
    });

    describe('refresh tokens', () => {
        const userId = 1;
        const refreshToken = 'token';

        describe('when the user exists and has refresh token', () => {
            beforeEach(() => {
                mockUserService.updateUser.mockReturnValue(null);
            });

            describe('and refresh tokens match', () => {
                beforeEach(async () => {
                    const testToken = await argon.hash('token');
                    mockUserService.getUserById.mockReturnValue(Promise.resolve({ refreshToken: testToken }));
                });

                it('should return tokens', async () => {
                    await expect(authService.refreshTokens(userId, refreshToken)).resolves.toEqual({
                        accessToken: expect.any(String),
                        refreshToken: expect.any(String),
                    });
                    expect(mockUserService.getUserById).toHaveBeenCalled();
                    expect(mockUserService.updateUser).toHaveBeenCalled();
                });
            });

            describe('and refresh tokens does not match', () => {
                beforeEach(async () => {
                    const testToken = await argon.hash('token_not_match');
                    mockUserService.getUserById.mockReturnValue(Promise.resolve({ refreshToken: testToken }));
                });

                it('should throw AccessDeniedException', async () => {
                    await expect(authService.refreshTokens(userId, refreshToken)).rejects.toThrow(
                        AccessDeniedException,
                    );
                    expect(mockUserService.getUserById).toHaveBeenCalled();
                });
            });
        });

        describe('when the user does not exist or does not have refresh token', () => {
            beforeEach(() => {
                mockUserService.updateUser.mockReturnValue(null);
                mockUserService.getUserById.mockReturnValue(null);
            });

            it('should throw AccessDeniedException', async () => {
                await expect(authService.refreshTokens(userId, refreshToken)).rejects.toThrow(AccessDeniedException);
                expect(mockUserService.getUserById).toHaveBeenCalled();
            });
        });
    });
});
