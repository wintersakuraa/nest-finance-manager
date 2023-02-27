import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { WebhookService } from '../service/webhook.service';
import { TransactionDto } from '../../transaction/dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('webhook')
@Controller()
export class WebhookController {
    constructor(private readonly webhookService: WebhookService) {}

    @ApiOperation({ summary: 'Request For Transaction Creation' })
    @ApiOkResponse({ description: 'Request received' })
    @HttpCode(HttpStatus.OK)
    @Post()
    async handleIncomingEvents(@Body() transactionDto: TransactionDto) {
        await this.webhookService.processTransactionCreate(transactionDto);
    }
}
