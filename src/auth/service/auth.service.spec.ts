import { AuthController } from './auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../../user/dto';
import { AuthService } from '../service/auth.service';

describe('AuthController', () => {
    let authController: AuthController;

    const mockAuthService = {
        register: jest.fn().mockImplementation(async (userDto) => {
            return {
                accessToken: 'token acc',
                refreshToken: 'token ref',
            };
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService],
        })
            .overrideProvider(AuthService)
            .useValue(mockAuthService)
            .compile();

        authController = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('register user', () => {
        const userDto: CreateUserDto = {
            email: 'wintersakura@gmail.com',
            password: '123456',
        };

        it('should return tokens', async () => {
            const tokens = {
                accessToken: 'token acc',
                refreshToken: 'token ref',
            };
            expect(await authController.register(userDto)).toEqual(tokens);
        });
    });
});
