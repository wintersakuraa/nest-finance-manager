import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BankEntity } from '../bank/bank.entity';

@Entity('_user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => BankEntity, (bank) => bank.user)
    banks: BankEntity[];
}
