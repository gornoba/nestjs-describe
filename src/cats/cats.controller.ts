import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  CatsDto,
  ArrayCreateCatDto,
  CreateCatDto,
  UpdateCatDto,
} from './dto/cats.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SessionGuard } from 'src/lib/auth/session/session.guard';
import { Role } from 'src/lib/auth/rbac/rbac.role';
import { Auth } from 'src/lib/decorators/auth.decorator';
import { CatsService } from './cats.service';

@ApiTags('cats')
@UseGuards(SessionGuard)
@Auth(Role.Admin)
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @ApiCreatedResponse({
    description: '생성된 고양이를 반환합니다.',
    type: CatsDto,
  })
  @ApiOperation({
    summary: '고양이 생성',
    description:
      '이 API는 새로운 고양이를 생성합니다.<br/>고양이의 이름, 나이, 품종을 입력하세요.',
  })
  @Post()
  create(@Body() createCatDto: CreateCatDto): CatsDto {
    return this.catsService.create(createCatDto);
  }

  @ApiCreatedResponse({
    description: '생성된 고양이들을 반환합니다.',
    type: [CatsDto],
  })
  @ApiOperation({
    summary: '고양이들을 생성',
    description:
      '고양이 정보를 `data: CreateCatDto[]` 형식으로 `body`를 보내세요.',
  })
  @Post('many')
  createMany(@Body() createCatDto: ArrayCreateCatDto): CatsDto[] {
    return this.catsService.createMany(createCatDto.data);
  }

  @ApiOkResponse({
    description: '모든 고양이를 반환합니다.',
    type: [CatsDto],
  })
  @ApiOperation({
    summary: '모든 고양이를 반환합니다.',
  })
  @Get()
  findAll() {
    return this.catsService.findAll();
  }

  @ApiOkResponse({
    description: '모든 고양이를 반환합니다.',
    type: CatsDto,
  })
  @ApiOperation({
    summary: '해당 아이디의 고양이를 반환합니다.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    required: true,
    type: Number,
  })
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number): CatsDto {
    return this.catsService.findOne(id);
  }

  @ApiOkResponse({
    description: '모든 고양이를 반환합니다.',
    type: CatsDto,
  })
  @ApiOperation({
    summary: '해당 아이디의 고양이를 갱신합니다.',
    description:
      'id는 param으로 변경될 정보는 body로 보내주세요.<br/>변경되는 정보만 보내주셔도 됩니다.',
  })
  @Put(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateCatDto: UpdateCatDto,
  ): CatsDto {
    return this.catsService.update(id, updateCatDto);
  }

  @ApiOkResponse({
    description: '모든 고양이를 반환합니다.',
    type: CatsDto,
  })
  @ApiOperation({
    summary: '해당 아이디의 고양이를 삭제합니다.',
  })
  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number): CatsDto {
    return this.catsService.remove(id);
  }
}
