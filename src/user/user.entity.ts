import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Bank } from '../bank/bank.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../category/category.entity';

@Entity('_user')
export class User {
    @ApiProperty({ description: 'User id', type: Number, example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'User email', type: String, example: 'newUser@gmail.com' })
    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @ApiProperty({ description: 'User registration date', type: Date, example: '2023-02-23' })
    @CreateDateColumn({ type: 'date' })
    createdAt: Date;

    @ApiProperty({ description: 'User refresh token', type: String })
    @Column({ nullable: true })
    refreshToken?: string;

    @OneToMany(() => Bank, (bank) => bank.user)
    banks: Bank[];

    @OneToMany(() => Category, (category) => category.user)
    categories: Category[];
}
