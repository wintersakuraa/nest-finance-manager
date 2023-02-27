import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() userDto: CreateUserDto) {
        return this.authService.register(userDto);
    }

    @Post('login')
    login(@Body() userDto: CreateUserDto) {
        return this.authService.login(userDto);
    }
}
