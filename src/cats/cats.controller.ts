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
  UseInterceptors,
  Logger,
  Session,
  Res,
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
import { CatsEntity } from 'src/db/entities/cat.entity';
import { CatsCacheService } from './cats-cache.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CustomEmitterService } from '../lib/services/custom-emiter';
import { Response } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';

@ApiTags('cats')
@UseGuards(SessionGuard)
@Auth(Role.User)
@Controller('cats')
export class CatsController {
  private readonly logger = new Logger(CatsController.name);
  constructor(
    private readonly catsService: CatsService,
    private readonly catsCacheService: CatsCacheService,
    @InjectQueue('cats') private catsQueue: Queue,
    private readonly customEmitterService: CustomEmitterService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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
  async create(
    @Body() createCatDto: CreateCatDto,
  ): Promise<CatsEntity | CatsEntity[]> {
    return await this.catsService.create(createCatDto);
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
  async createMany(
    @Body() createCatDto: ArrayCreateCatDto,
  ): Promise<CatsEntity | CatsEntity[]> {
    return await this.catsService.createMany(createCatDto.data);
  }

  @ApiOkResponse({
    description: '모든 고양이를 반환합니다.',
    type: [CatsDto],
  })
  @ApiOperation({
    summary: '모든 고양이를 반환합니다.',
  })
  @Cron('0 0 */1 * * *', {
    name: 'cats-all',
    timeZone: 'Asia/Seoul',
  })
  @Get()
  async findAll() {
    const result = await this.catsQueue.add(
      'findAll',
      'findAll',
      {}, // 추가옵션이 있다면
    );
    return await result.finished();
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
  @UseInterceptors(CacheInterceptor)
  @CacheKey('getCat')
  @CacheTTL(10)
  @Get('get/:id')
  async findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<CatsEntity | CatsEntity[]> {
    const cacheData = (await this.catsCacheService.findOne(
      id,
    )) as unknown as CatsEntity;

    if (!cacheData) {
      const result = await this.catsService.findOne(id);
      await this.catsCacheService.wrap(id, result);
      return result;
    }

    return cacheData;
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
  @Put('put/:id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<CatsEntity | CatsEntity[]> {
    return await this.catsService.update(id, updateCatDto);
  }

  @Put('pu-emit/:id')
  async updateEmit(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateCatDto: UpdateCatDto,
  ) {
    this.eventEmitter.emit('cat.updated', { id, updateCatDto });
  }

  @ApiOkResponse({
    description: '모든 고양이를 반환합니다.',
    type: CatsDto,
  })
  @ApiOperation({
    summary: '해당 아이디의 고양이를 삭제합니다.',
  })
  @Delete('delete/:id')
  async remove(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<CatsEntity> {
    return await this.catsService.remove(id);
  }

  @Get('lazy')
  lazy() {
    return this.catsService.lazy();
  }

  @Get('custom-emit')
  async customEmit(
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    this.customEmitterService.handleMessage(
      {
        sessionId: session.id,
        payload: 'CatsService.findAll',
      },
      res,
    );
  }
}
