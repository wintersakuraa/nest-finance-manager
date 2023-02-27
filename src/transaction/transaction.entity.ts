import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../category/category.entity';
import { Bank } from '../bank/bank.entity';
import { ColumnNumericTransformer } from '../common/transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionType {
    CONSUMABLE = 0,
    PROFITABLE = 1,
}

@Entity('transaction')
export class Transaction {
    @ApiProperty({ description: 'Transaction id', type: Number, example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Transaction amount', type: Number, example: 100.0 })
    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
    })
    amount: number;

    @ApiProperty({ description: 'Transaction type', enum: TransactionType, example: 0 })
    @Column({ type: 'enum', enum: TransactionType })
    type: TransactionType;

    @ApiProperty({ description: 'Transaction creation date', type: Date, example: '2023-02-23' })
    @CreateDateColumn({ type: 'date' })
    createdAt: Date;

    @ApiProperty({
        description: 'Transaction categories',
        type: () => Bank,
        example: {
            id: 1,
            name: 'first bank',
            balance: 100,
            createdAt: '2023-02-23',
        },
    })
    @ManyToOne(() => Bank, (bank) => bank.transactions)
    bank: Bank;

    @ApiProperty({
        description: 'Transaction categories',
        type: [Category],
        example: [
            {
                id: 1,
                name: 'salary',
                createdAt: '2023-02-23',
            },
        ],
    })
    @ManyToMany(() => Category, (category) => category.transactions, { onDelete: 'CASCADE' })
    categories: Category[];
}
