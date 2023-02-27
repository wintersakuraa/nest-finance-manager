import { BadRequestException } from '@nestjs/common';

export class EmailAlreadyExistsException extends BadRequestException {
    constructor() {
        super('User with such email already exists');
    }
}
