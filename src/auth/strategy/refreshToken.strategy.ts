import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from './accessToken.strategy';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: JwtPayload) {
        const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
        return { ...payload, refreshToken };
    }
}

