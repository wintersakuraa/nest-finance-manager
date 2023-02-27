import { Module } from '@nestjs/common';
import { WebhookController } from './controller/webhook.controller';
import { WebhookService } from './service/webhook.service';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
    imports: [TransactionModule],
    controllers: [WebhookController],
    providers: [WebhookService],
})
export class WebhookModule {}
