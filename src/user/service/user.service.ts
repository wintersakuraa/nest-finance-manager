import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { UserNotFoundException } from '../exception';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async createUser(userDto: CreateUserDto): Promise<User> {
        return await this.userRepository.save({ ...userDto });
    }

    async updateUser(id: number, userDto: UpdateUserDto): Promise<User> {
        await this.userRepository.update(id, userDto);

        const user = await this.userRepository.findOne({
            where: { id },
        });
        if (!user) {
            throw new UserNotFoundException();
        }

        return user;
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id },
        });
        if (!user) {
            throw new UserNotFoundException();
        }

        return user;
    }

    async getUserByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                banks: true,
                createdAt: true,
                refreshToken: true,
            },
        });
    }
}
