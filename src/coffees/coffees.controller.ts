import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto/pagination-query.dto';
import { ParseIntPipe } from '../common/pipes/parse-int/parse-int.pipe';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { Protocol } from '../common/decorators/protocal.decorator';

@UsePipes(ValidationPipe)
@Controller('coffees')
export class CoffeesController {
  constructor(
    /**告诉Nest将提供程序注入到控制器类中以便我们使用它 */
    private readonly coffeesService: CoffeesService,
  ) {}
  @Public()
  @Get()
  findAll(
    @Protocol('https') protocal: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    console.log(protocal);
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get(':id')
  findone(@Param('id', ParseIntPipe) id: string) {
    return this.coffeesService.findOne(id);
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto,
  ) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(id);
  }
}
