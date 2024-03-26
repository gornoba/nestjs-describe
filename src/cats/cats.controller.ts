import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateCatDto, UpdateCatDto } from './dto/cats.dto';

@Controller('cats')
export class CatsController {
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return `This action adds a new cat ${createCatDto.name}`;
  }

  @Get()
  findAll() {
    return `This action returns all cats`;
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return `This action returns a cat ${id}`;
  }

  @Put(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateCatDto: UpdateCatDto,
  ) {
    return `This action updates a cat ${id}`;
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return `This action removes a cat ${id}`;
  }
}
