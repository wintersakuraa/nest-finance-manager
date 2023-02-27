import { NotFoundException } from '@nestjs/common';

export class InvalidCredentialsException extends NotFoundException {
    constructor() {
        super('Password does not match');
    }
}
