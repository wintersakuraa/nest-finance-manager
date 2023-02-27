import { NotFoundException } from '@nestjs/common';

export class TransactionNotFoundException extends NotFoundException {
    constructor() {
        super('Transaction not found');
    }
}
