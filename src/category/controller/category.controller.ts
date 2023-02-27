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
import { CategoryService } from '../service/category.service';
import { CategoryDto } from '../dto';
import { Category } from '../category.entity';
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
import { ReqUser } from '../../common/decorator';
import { User } from '../../user/user.entity';
import { AccessTokenGuard } from '../../auth/guard';

@ApiTags('category')
@ApiBearerAuth('jwt-auth')
@UseGuards(AccessTokenGuard)
@Controller()
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @ApiOperation({ summary: 'Create Category' })
    @ApiCreatedResponse({ description: 'New category', type: Category })
    @Post()
    async createCategory(@ReqUser() user: User, @Body() categoryDto: CategoryDto): Promise<Category> {
        return this.categoryService.createCategory(user, categoryDto);
    }

    @ApiOperation({ summary: 'Get All Categories' })
    @ApiOkResponse({ description: 'Categories', type: [Category] })
    @Get()
    async getAllCategories(@ReqUser() user: User): Promise<Category[]> {
        return this.categoryService.getAllCategories(user);
    }

    @ApiOperation({ summary: 'Get Category By Id' })
    @ApiParam({ name: 'id' })
    @ApiOkResponse({ description: 'Category', type: Category })
    @ApiNotFoundResponse({ description: 'Category not found' })
    @Get(':id')
    async getCategoryById(@ReqUser() user: User, @Param('id', ParseIntPipe) categoryId): Promise<Category> {
        return this.categoryService.getCategoryById(user, categoryId);
    }

    @ApiOperation({ summary: 'Update Category' })
    @ApiParam({ name: 'id' })
    @ApiOkResponse({ description: 'Updated Category', type: Category })
    @ApiNotFoundResponse({ description: 'Category not found' })
    @Patch(':id')
    async updateCategory(
        @ReqUser() user: User,
        @Param('id', ParseIntPipe) categoryId,
        @Body() categoryDto: CategoryDto,
    ): Promise<Category> {
        return this.categoryService.updateCategory(user, categoryId, categoryDto);
    }

    @ApiOperation({ summary: 'Delete Category' })
    @ApiParam({ name: 'id' })
    @ApiNoContentResponse({ description: 'Category deleted successfully' })
    @ApiNotFoundResponse({ description: 'Category not found' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async deleteCategory(@ReqUser() user: User, @Param('id', ParseIntPipe) categoryId) {
        await this.categoryService.deleteCategory(user, categoryId);
    }
}
