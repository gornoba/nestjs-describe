import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CatMongoDto, ObjectIdDto } from './dto/cat.mongo.dto';
import { MongoService } from './mongo.service';
import { PersonMongoDto } from './dto/person.mongo.dto';

@ApiTags('Mongo')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('mongo')
export class MongoController {
  constructor(private readonly mongoService: MongoService) {}

  @Get('all')
  async findAll() {
    return await this.mongoService.findAll();
  }

  @Get('one/:id')
  async findOne(@Param() param: ObjectIdDto) {
    return await this.mongoService.findOne(param.id);
  }

  @Post('create')
  async create(@Body() body: CatMongoDto) {
    return await this.mongoService.create(body);
  }

  @Delete('all')
  async deleteAll() {
    return await this.mongoService.deleteAll();
  }

  @Delete('one/:id')
  async deleteOne(@Param() param: ObjectIdDto) {
    return await this.mongoService.deleteOne(param.id);
  }

  @Post('person')
  async createPerson(@Body() body: PersonMongoDto) {
    return await this.mongoService.createPerson(body);
  }
}
