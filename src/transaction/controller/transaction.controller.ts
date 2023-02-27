import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { TransactionService } from '../service/transaction.service';
import { QueryDto } from '../dto';
import { Transaction } from '../transaction.entity';
import {
    ApiBearerAuth,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { ReqUser } from '../../common/decorator';
import { User } from '../../user/user.entity';
import { AccessTokenGuard } from '../../auth/guard';

@ApiTags('transaction')
@ApiBearerAuth('jwt-auth')
@UseGuards(AccessTokenGuard)
@Controller()
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @ApiOperation({ summary: 'Get All Transactions' })
    @ApiOkResponse({ description: 'Transactions', type: [Transaction] })
    @ApiParam({ name: 'bankId' })
    @Get()
    async getAllTransactions(
        @ReqUser() user: User,
        @Param('bankId', ParseIntPipe) bankId,
        @Query() query: QueryDto,
    ): Promise<Transaction[]> {
        return this.transactionService.getAllTransactions(user, bankId, query);
    }

    @ApiOperation({ summary: 'Delete Transaction' })
    @ApiParam({ name: 'bankId' })
    @ApiParam({ name: 'id' })
    @ApiNoContentResponse({ description: 'Transaction deleted successfully' })
    @ApiNotFoundResponse({ description: 'Transaction not found' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async deleteTransaction(@ReqUser() user: User, @Param('id', ParseIntPipe) transactionId) {
        await this.transactionService.deleteTransaction(user, transactionId);
    }
}
