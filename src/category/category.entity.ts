import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';

@Entity('category')
export class Category {
    @ApiProperty({ description: 'Category id', type: Number, example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Category name', type: String, example: 'food' })
    @Column({ unique: true })
    name: string;

    @ApiProperty({ description: 'Category creation date', type: Date, example: '2023-02-23' })
    @CreateDateColumn({ type: 'date' })
    createdAt: Date;

    @ApiProperty({
        description: 'Category creator',
        type: () => User,
        example: { id: 1, email: 'newUser@gmail.com', createdAt: '2023-02-23' },
    })
    @ManyToOne(() => User, (user) => user.categories)
    user: User;

    @ManyToMany(() => Transaction, (transaction) => transaction.categories, { onDelete: 'RESTRICT' })
    @JoinTable({ name: 'category_transaction' })
    transactions: Transaction[];
}
