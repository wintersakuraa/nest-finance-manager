import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../../user/dto';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthResponse } from '../auth.response';
import { User } from '../../user/user.entity';
import { RefreshTokenGuard } from '../guard';
import { ReqUser } from '../../common/decorator';

@ApiTags('auth')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Register User' })
    @ApiCreatedResponse({
        description: 'Access and refresh tokens as a response',
        type: AuthResponse,
    })
    @ApiBadRequestResponse({ description: 'User cannot register' })
    @Post('register')
    async register(@Body() userDto: CreateUserDto): Promise<AuthResponse> {
        return this.authService.register(userDto);
    }

    @ApiOperation({ summary: 'Login User' })
    @ApiOkResponse({ description: 'Access and refresh tokens as a response', type: AuthResponse })
    @ApiUnauthorizedResponse({ description: 'User cannot login' })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() userDto: CreateUserDto): Promise<AuthResponse> {
        return this.authService.login(userDto);
    }

    @ApiOperation({ summary: "Refresh User's Token" })
    @ApiOkResponse({ description: 'Access and refresh tokens as a response', type: AuthResponse })
    @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    refreshTokens(@ReqUser() user: User): Promise<AuthResponse> {
        return this.authService.refreshTokens(user.id, user.refreshToken);
    }
}
