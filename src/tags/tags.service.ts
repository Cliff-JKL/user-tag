import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async create(createdTagDto: CreateTagDto, creatorUid: string): Promise<Tag> {
    const createdTag = new Tag();
    createdTag.name = createdTagDto.name;
    createdTag.sortOrder = createdTagDto.sortOrder;
    createdTag.creator = creatorUid;

    return await this.tagsRepository.save(createdTag);
  }

  // async findOne(email: string): Promise<Tag | undefined> {
  //   return await this.tagsRepository.findOne({
  //     where: { email: email },
  //   });
  // }

  async findById(id: number): Promise<Tag | undefined> {
    return await this.tagsRepository.findOne({
      where: { id: id },
    });
  }

  async findAll(creator: string): Promise<Tag[]> {
    return await this.tagsRepository.find({
      where: { creator: creator },
    });
  }

  async update(id: number, updateTagDto: UpdateTagDto, creator: string): Promise<Tag> {
    const updatedTag = await this.tagsRepository.findOne({
      where: { id: id, creator: creator },
    });

    if (updatedTag == undefined) {
      throw new NotFoundException();
    }

    return await this.tagsRepository.save({
      ...updatedTag,
      ...updateTagDto,
    });
  }

  // async delete(id: string): Promise<void> {
  //   await this.usersRepository.delete(id);
  // }
}
