import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  UseGuards,
  Request,
  Session,
  Query,
  Delete, HttpCode, HttpStatus, ParseIntPipe
} from "@nestjs/common";
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { GetTagInterface, QueryTagInterface, TagInterface } from "./interfaces/tag.interface";

@UseGuards(JwtAuthGuard)
@Controller('tag')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async create(
    @Body() createTagDto: CreateTagDto,
    @CurrentUser() user: User,
  ): Promise<GetTagInterface> {
    const tag = await this.tagsService.create(createTagDto, user.uid);
    return {
      "id": tag.id,
      "name": tag.name,
      "sortOrder": tag.sortOrder,
    };
  }

  @Get()
  async findAll(
    @Query('sortByOrder') sortByOrder,
    @Query('sortByName') sortByName,
    @Query('offset') offset: number,
    @Query('length') length: number,
    @CurrentUser() user: User
  ): Promise<QueryTagInterface> {
    return this.tagsService.findAll(sortByOrder, sortByName, +offset, +length);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TagInterface | undefined> {
    return this.tagsService.findOneById(+id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
    @CurrentUser() user: User,
  ): Promise<TagInterface> {
    return this.tagsService.update(+id, updateTagDto, user.uid);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User
  ): Promise<void> {
    return this.tagsService.delete(+id, user.uid);
  }
}
