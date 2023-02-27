import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../user.entity';
import { ReqUser } from '../../common/decorator';
import { UpdateUserDto } from '../dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../auth/guard';

@ApiTags('user')
@ApiBearerAuth('jwt-auth')
@UseGuards(AccessTokenGuard)
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Get Current User' })
    @ApiOkResponse({ description: 'User', type: User })
    @Get()
    async getMe(@ReqUser() user: User): Promise<User> {
        return user;
    }

    @ApiOperation({ summary: 'Update User' })
    @ApiOkResponse({ description: 'Updated user', type: User })
    @Patch()
    async updateUser(@ReqUser() user: User, @Body() userDto: UpdateUserDto): Promise<User> {
        return this.userService.updateUser(user.id, userDto);
    }
}
