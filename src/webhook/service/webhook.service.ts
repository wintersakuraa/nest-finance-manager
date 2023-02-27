import { Injectable } from '@nestjs/common';
import { TransactionDto } from '../../transaction/dto';
import { TransactionService } from '../../transaction/service/transaction.service';

@Injectable()
export class WebhookService {
    constructor(private readonly transactionService: TransactionService) {}

    public async processTransactionCreate(transactionDto: TransactionDto) {
        await this.transactionService.createTransaction(transactionDto);
    }
}
