import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BankModule } from './bank/bank.module';
import { TransactionModule } from './transaction/transaction.module';
import { CategoryModule } from './category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from 'nest-router';
import { routes } from './routes';
import { WebhookModule } from './webhook/webhook.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        BankModule,
        TransactionModule,
        CategoryModule,
        WebhookModule,
        RouterModule.forRoutes(routes),
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('POSTGRES_HOST'),
                port: configService.get<number>('POSTGRES_PORT'),
                username: configService.get<string>('POSTGRES_USER'),
                password: configService.get<string>('POSTGRES_PASSWORD'),
                database: configService.get<string>('POSTGRES_DB'),
                entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
                synchronize: true,
                autoLoadEntities: true,
            }),
        }),
    ],
})
export class AppModule {}
