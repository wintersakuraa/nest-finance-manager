import { NotFoundException } from '@nestjs/common';

export class BankNotFoundException extends NotFoundException {
    constructor() {
        super('Bank not found');
    }
}
