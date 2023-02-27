import { UnauthorizedException } from '@nestjs/common';

export class UserUnauthorizedException extends UnauthorizedException {
    constructor() {
        super('You are not authorized to perform the operation');
    }
}
