import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Transaction } from '../transaction/transaction.entity';
import { ColumnNumericTransformer } from '../common/transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('bank')
export class Bank {
    @ApiProperty({ description: 'Bank id', type: Number, example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Bank name', type: String, example: 'my first bank' })
    @Column()
    name: string;

    @ApiProperty({ description: 'Bank balance', type: Number, example: 100.0 })
    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2,
        default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    balance: number;

    @ApiProperty({ description: 'Bank creation date', type: Date, example: '2023-02-23' })
    @CreateDateColumn({ type: 'date' })
    createdAt: Date;

    @ApiProperty({
        description: 'Bank owner',
        type: () => User,
        example: { id: 1, email: 'newUser@gmail.com', createdAt: '2023-02-23' },
    })
    @ManyToOne(() => User, (user) => user.banks)
    user: User;

    @OneToMany(() => Transaction, (transaction) => transaction.bank, { onDelete: 'RESTRICT' })
    transactions: Transaction[];
}
