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
  Session,
  ValidationPipe,
} from '@nestjs/common';
import {
  CatsDto,
  ArrayCreateCatDto,
  CreateCatDto,
  UpdateCatDto,
} from './dto/cats.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { HeaderGuard } from 'src/lib/auth/header.guard';
import { JwtAuthGuard } from 'src/lib/auth/jwt/jwt.guard';
import { SessionGuard } from 'src/lib/auth/session/session.guard';
import { Roles } from 'src/lib/auth/rbac/rbac.decorator';
import { Role } from 'src/lib/auth/rbac/rbac.role';
import { RolesGuard } from 'src/lib/auth/rbac/rbac.guard';
import { User } from 'src/lib/decorators/user.decorator';
import { UsersDto } from 'src/login/dto/login.dto';
import { Auth } from 'src/lib/decorators/auth.decorator';

@ApiTags('cats')
@Controller('cats')
export class CatsController {
  private cats: CatsDto = {
    id: 1,
    name: 'Kitty',
    age: 3,
    breed: 'Scottish Fold',
  };

  constructor() {}

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '생성된 고양이를 반환합니다.',
    type: CatsDto,
  })
  @ApiOperation({
    summary: '고양이 생성',
    description:
      '이 API는 새로운 고양이를 생성합니다.<br/>고양이의 이름, 나이, 품종을 입력하세요.',
  })
  @UseGuards(HeaderGuard)
  @Post()
  create(@Body() createCatDto: CreateCatDto): CatsDto {
    return this.cats;
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
  @UseGuards(JwtAuthGuard)
  @Post('many')
  createMany(@Body() createCatDto: ArrayCreateCatDto): CatsDto[] {
    return [this.cats];
  }

  @ApiOkResponse({
    description: '모든 고양이를 반환합니다.',
    type: [CatsDto],
  })
  @ApiOperation({
    summary: '모든 고양이를 반환합니다.',
  })
  @UseGuards(SessionGuard)
  @Get()
  findAll(@Session() session: Record<string, any>): CatsDto[] {
    console.log(session);
    return [this.cats];
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
  @Auth(Role.Admin)
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number, @User() user: UsersDto) {
    return user;
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
    return this.cats;
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
    return this.cats;
  }
}
