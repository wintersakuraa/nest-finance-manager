import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategy';

@Module({
    controllers: [AuthController],
    imports: [UserModule, PassportModule, JwtModule.register({}), TypeOrmModule.forFeature([User])],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
