import { BankService } from '../service/bank.service';
import { BankDto, BankStatisticsDto } from '../dto';
import { Bank } from '../bank.entity';
import { ReqUser } from '../../common/decorator';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { User } from '../../user/user.entity';
import { AccessTokenGuard } from '../../auth/guard';

@ApiTags('bank')
@ApiBearerAuth('jwt-auth')
@UseGuards(AccessTokenGuard)
@Controller()
export class BankController {
    constructor(private readonly bankService: BankService) {}

    @ApiOperation({ summary: 'Create Bank' })
    @ApiCreatedResponse({ description: 'New bank', type: Bank })
    @Post()
    async createBank(@ReqUser() user: User, @Body() bankDto: BankDto): Promise<Bank> {
        return this.bankService.createBank(user, bankDto);
    }

    @ApiOperation({ summary: 'Get All Banks' })
    @ApiOkResponse({ description: 'Banks', type: [Bank] })
    @Get()
    async getAllBanks(@ReqUser() user: User): Promise<Bank[]> {
        return this.bankService.getAllBanks(user);
    }

    @ApiOperation({ summary: 'Get Bank By Id' })
    @ApiParam({ name: 'id' })
    @ApiOkResponse({ description: 'Bank', type: Bank })
    @ApiNotFoundResponse({ description: 'Bank not found' })
    @Get(':id')
    async getBankById(@ReqUser() user: User, @Param('id', ParseIntPipe) bankId): Promise<Bank> {
        return this.bankService.getBankById(user, bankId);
    }

    @ApiOperation({ summary: 'Update Bank' })
    @ApiParam({ name: 'id' })
    @ApiOkResponse({ description: 'Updated Bank', type: Bank })
    @ApiNotFoundResponse({ description: 'Bank not found' })
    @Patch(':id')
    async updateBank(
        @ReqUser() user: User,
        @Param('id', ParseIntPipe) bankId,
        @Body() bankDto: BankDto,
    ): Promise<Bank> {
        return this.bankService.updateBank(user, bankId, bankDto);
    }

    @ApiOperation({ summary: 'Delete Bank' })
    @ApiParam({ name: 'id' })
    @ApiNoContentResponse({ description: 'Bank deleted successfully' })
    @ApiNotFoundResponse({ description: 'Bank not found' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async deleteBank(@ReqUser() user: User, @Param('id', ParseIntPipe) bankId) {
        await this.bankService.deleteBank(user, bankId);
    }

    @ApiOperation({ summary: 'Bank Statistics' })
    @ApiParam({ name: 'id' })
    @ApiOkResponse({ description: 'Bank statistics' })
    @HttpCode(HttpStatus.OK)
    @Post(':id/statistics')
    async getBankStatistics(
        @ReqUser() user: User,
        @Param('id', ParseIntPipe) bankId,
        @Body() bankStatisticsDto: BankStatisticsDto,
    ) {
        return this.bankService.getBankStatistics(user, bankId, bankStatisticsDto);
    }
}
