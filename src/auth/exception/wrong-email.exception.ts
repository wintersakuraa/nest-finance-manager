import { BadRequestException } from '@nestjs/common';

export class WrongEmailException extends BadRequestException {
    constructor() {
        super('User with such email not found');
    }
}
