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

    const createUser = jest.fn().mockImplementation((userDto: CreateUserDto) => Promise.resolve(userDto));
    let updateUser: jest.Mock;
    let getUserByEmail: jest.Mock;
    let getUserById: jest.Mock;

    beforeEach(async () => {
        updateUser = jest.fn();
        getUserByEmail = jest.fn();
        getUserById = jest.fn();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                UserService,
                JwtService,
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
        })
            .overrideProvider(UserService)
            .useValue({
                updateUser,
                getUserByEmail,
                getUserById,
                createUser,
            })
            .compile();

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
                updateUser.mockReturnValue(null);
                getUserByEmail.mockReturnValue(Promise.resolve(null));
            });

            it('should return tokens', async () => {
                expect(await authService.register(userDto)).toEqual({
                    accessToken: expect.any(String),
                    refreshToken: expect.any(String),
                });
            });
        });

        describe('when the user exists', () => {
            beforeEach(() => {
                updateUser.mockReturnValue(null);
                getUserByEmail.mockReturnValue({});
            });

            it('should throw UserAlreadyExistsException', async () => {
                expect.assertions(3);

                try {
                    await authService.register(userDto);
                } catch (e) {
                    expect(e).toBeInstanceOf(UserAlreadyExistsException);
                    expect(e).toHaveProperty('message', 'User with such email already exists');
                    expect(e).toHaveProperty('status', 400);
                }
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
                updateUser.mockReturnValue(null);
            });

            describe('and password match', () => {
                beforeEach(async () => {
                    const hash = await argon.hash('123456');
                    getUserByEmail.mockReturnValue(Promise.resolve({ password: hash }));
                });

                it('should return tokens', async () => {
                    expect(await authService.login(userDto)).toEqual({
                        accessToken: expect.any(String),
                        refreshToken: expect.any(String),
                    });
                });
            });

            describe('and password does not match', () => {
                beforeEach(async () => {
                    const hash = await argon.hash('123457');
                    getUserByEmail.mockReturnValue(Promise.resolve({ password: hash }));
                });

                it('should throw WrongPasswordException', async () => {
                    expect.assertions(3);

                    try {
                        await authService.login(userDto);
                    } catch (e) {
                        expect(e).toBeInstanceOf(WrongPasswordException);
                        expect(e).toHaveProperty('message', 'Password does not match');
                        expect(e).toHaveProperty('status', 400);
                    }
                });
            });
        });

        describe('when the user does not exist', () => {
            beforeEach(() => {
                updateUser.mockReturnValue(null);
                getUserByEmail.mockReturnValue(null);
            });

            it('should throw WrongEmailException', async () => {
                expect.assertions(3);

                try {
                    await authService.login(userDto);
                } catch (e) {
                    expect(e).toBeInstanceOf(WrongEmailException);
                    expect(e).toHaveProperty('message', 'User with such email not found');
                    expect(e).toHaveProperty('status', 400);
                }
            });
        });
    });

    describe('refresh tokens', () => {
        const userId = 1;
        const refreshToken = 'token';

        describe('when the user exists and has refresh token', () => {
            beforeEach(() => {
                updateUser.mockReturnValue(null);
            });

            describe('and refresh tokens match', () => {
                beforeEach(async () => {
                    const testToken = await argon.hash('token');
                    getUserById.mockReturnValue(Promise.resolve({ refreshToken: testToken }));
                });

                it('should return tokens', async () => {
                    expect(await authService.refreshTokens(userId, refreshToken)).toEqual({
                        accessToken: expect.any(String),
                        refreshToken: expect.any(String),
                    });
                });
            });

            describe('and refresh tokens does not match', () => {
                beforeEach(async () => {
                    const testToken = await argon.hash('token_not_match');
                    getUserById.mockReturnValue(Promise.resolve({ refreshToken: testToken }));
                });

                it('should throw AccessDeniedException', async () => {
                    expect.assertions(3);

                    try {
                        await authService.refreshTokens(userId, refreshToken);
                    } catch (e) {
                        expect(e).toBeInstanceOf(AccessDeniedException);
                        expect(e).toHaveProperty('message', 'Access Denied');
                        expect(e).toHaveProperty('status', 403);
                    }
                });
            });
        });

        describe('when the user does not exist or does not have refresh token', () => {
            beforeEach(() => {
                updateUser.mockReturnValue(null);
                getUserById.mockReturnValue(null);
            });

            it('should throw AccessDeniedException', async () => {
                expect.assertions(3);

                try {
                    await authService.refreshTokens(userId, refreshToken);
                } catch (e) {
                    expect(e).toBeInstanceOf(AccessDeniedException);
                    expect(e).toHaveProperty('message', 'Access Denied');
                    expect(e).toHaveProperty('status', 403);
                }
            });
        });
    });
});
