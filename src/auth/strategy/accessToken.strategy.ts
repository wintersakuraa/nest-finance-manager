import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserUnauthorizedException } from '../exception';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/service/user.service';

export interface JwtPayload {
    sub: number;
    email: string;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService, private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userService.getUserById(payload.sub);
        if (!user) {
            throw new UserUnauthorizedException();
        }

        return user;
    }
}
