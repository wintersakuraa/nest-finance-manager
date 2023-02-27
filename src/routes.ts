import { Routes } from 'nest-router';
import { BankModule } from './bank/bank.module';
import { TransactionModule } from './transaction/transaction.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WebhookModule } from './webhook/webhook.module';

export const routes: Routes = [
    {
        path: '/auth',
        module: AuthModule,
    },
    {
        path: '/user',
        module: UserModule,
    },
    {
        path: '/webhook',
        module: WebhookModule,
    },
    {
        path: '/category',
        module: CategoryModule,
    },
    {
        path: '/bank',
        module: BankModule,
        children: [{ path: ':bankId/transaction', module: TransactionModule }],
    },
];
