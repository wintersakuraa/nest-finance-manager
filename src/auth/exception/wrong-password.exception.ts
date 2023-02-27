import { BadRequestException } from '@nestjs/common';

export class WrongPasswordException extends BadRequestException {
    constructor() {
        super('Password does not match');
    }
}
