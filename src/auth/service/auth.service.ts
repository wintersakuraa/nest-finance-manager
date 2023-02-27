import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import * as argon from 'argon2';

@Injectable({})
export class AuthService {
    constructor(private userService: UserService) {}

    async register(userDto: CreateUserDto) {
        // check if new user
        const candidate = await this.userService.findByEmail(userDto.email);
        if (candidate) {
            throw new HttpException('User with such email already exists', HttpStatus.BAD_REQUEST);
        }

        const hash = await argon.hash(userDto.password);
        const user = await this.userService.createUser({ ...userDto, password: hash });
        return this.generateToken(user);

        // save user to db

        // return saved user
        return { userDto };
    }

    login(userDto: CreateUserDto) {
        return { userDto };
    }

    private async generateToken(user: UserEntity) {
        const payload = { id: user.id, email: user.email };
        return {
            token: payload,
        };
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.findByEmail(userDto.email);
        const passwordEquals = await argon.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({ message: 'Invalid credentials' });
    }
}
