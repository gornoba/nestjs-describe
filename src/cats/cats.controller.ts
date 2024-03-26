import { Controller, Get, Post, Put, Delete } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Post()
  create() {
    return 'This action adds a new cat';
  }

  @Get()
  findAll() {
    return `This action returns all cats`;
  }

  @Get(':id')
  findOne() {
    return `This action returns a cat`;
  }

  @Put(':id')
  update() {
    return `This action updates a cat`;
  }

  @Delete(':id')
  remove() {
    return `This action removes a cat`;
  }
}
