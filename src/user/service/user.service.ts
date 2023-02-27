import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async createUser(userDto: CreateUserDto): Promise<UserEntity> {
        return await this.userRepository.save({ ...userDto });
    }

    async findUsers(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async findById(id: number): Promise<UserEntity> {
        return await this.userRepository.findOneBy({ id });
    }

    async findByEmail(email: string): Promise<UserEntity> {
        return await this.userRepository.findOneBy({ email });
    }
}
