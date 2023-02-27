import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../user/dto';
import { UserService } from '../../user/service/user.service';
import { User } from '../../user/user.entity';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthResponse } from '../auth.response';
import { UserAlreadyExistsException, WrongEmailException, WrongPasswordException } from '../exception';
import { AccessDeniedException } from '../exception/access-denied.exception';

@Injectable({})
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async register(userDto: CreateUserDto): Promise<AuthResponse> {
        // check if user exists
        const candidate = await this.userService.getUserByEmail(userDto.email);
        if (candidate) {
            throw new UserAlreadyExistsException();
        }

        // generate hash and save user to db
        const hash = await argon.hash(userDto.password);
        const user = await this.userService.createUser({ ...userDto, password: hash });

        // generate tokens and update user
        const tokens = await this.generateTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async login(userDto: CreateUserDto): Promise<AuthResponse> {
        // verify user
        const user = await this.userService.getUserByEmail(userDto.email);
        if (!user) {
            throw new WrongEmailException();
        }

        const passwordEquals = await argon.verify(user.password, userDto.password);
        if (!passwordEquals) {
            throw new WrongPasswordException();
        }

        const tokens = await this.generateTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async refreshTokens(userId: number, refreshToken: string) {
        const user = await this.userService.getUserById(userId);
        if (!user || !user.refreshToken) {
            console.log('no user');
            throw new AccessDeniedException();
        }

        const refreshTokenMatches = await argon.verify(user.refreshToken, refreshToken);
        if (!refreshTokenMatches) {
            throw new AccessDeniedException();
        }

        const tokens = await this.generateTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    private async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = await argon.hash(refreshToken);
        await this.userService.updateUser(userId, {
            refreshToken: hashedRefreshToken,
        });
    }

    private async generateTokens(user: User): Promise<AuthResponse> {
        const payload = { sub: user.id, email: user.email };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}
