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
  Delete,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createTagDto: CreateTagDto,
    @CurrentUser() user: User,
  ): Promise<CreateTagDto> {
    return this.tagsService.create(createTagDto, user.uid);
  }

  // Currently ...
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@CurrentUser() user: User): Promise<Tag[]> {
    return this.tagsService.findAll(user.uid);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Tag | undefined> {
    return this.tagsService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
    @CurrentUser() user: User,
  ): Promise<UpdateTagDto> {
    return this.tagsService.update(+id, updateTagDto, user.uid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<Tag> {
    // return this.tagsService.delete(id, user.uid);
    return undefined;
  }
}
