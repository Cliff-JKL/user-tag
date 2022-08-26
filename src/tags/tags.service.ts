import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { GetTagInterface, GetTagsInterface, QueryTagInterface, TagInterface } from "./interfaces/tag.interface";

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async create(createdTagDto: CreateTagDto, creatorUid: string): Promise<GetTagInterface> {
    const createdTag = new Tag();
    createdTag.name = createdTagDto.name;
    createdTag.sortOrder = createdTagDto.sortOrder;
    createdTag.creator = creatorUid;

    return await this.tagsRepository.save(createdTag);
  }

  async findOneById(id: number): Promise<TagInterface | undefined> {
    const tagData = await this.tagsRepository.findOne({
      relations: [ 'user' ],
      where: { id: id },
    });

    if (!tagData) {
      throw new NotFoundException();
    }

    return {
      "creator": {
        "nickname": tagData.user.nickname,
        "uid": tagData.user.uid,
      },
      "name": tagData.name,
      "sortOrder": tagData.sortOrder,
    };
  }

  async findUserTags(creator: string): Promise<GetTagsInterface> {
    const tags = await this.tagsRepository.find({
      where: { creator: creator },
    });

    return {
      "tags": tags.map(tag => {
        return {
          "id": tag.id,
          "name": tag.name,
          "sortOrder": tag.sortOrder,
        };
      }),
    };
  }

  async findAll(sortByOrder?: string, sortByName?: string, offset?: number, length?: number): Promise<QueryTagInterface> {
    const tags = await this.tagsRepository.find({
      relations: [ 'user' ],
      order : {
        sortOrder: typeof sortByOrder !== undefined ? "ASC" : null,
        name: typeof sortByName !== undefined ? "ASC" : null,
      },
      // offset
      skip: offset ? offset : null,
      // limit
      take: length ? length : null,
    });

    const quantity = await this.tagsRepository.count();

    return {
      "data": tags.map(tag => {
        return {
          "creator" : {
            "nickname": tag.user.nickname,
            "uid": tag.user.uid,
          },
          "name": tag.name,
          "sortOrder": tag.sortOrder,
        };
      }),
      "meta": {
        "offset": offset || 0,
        "length": length || 0,
        "quantity": quantity,
      },
    };
  }

  async update(id: number, updateTagDto: UpdateTagDto, creator: string): Promise<TagInterface> {
    const updatedTag = await this.tagsRepository.findOne({
      relations: ['user'],
      where: { id: id, creator: creator },
    });

    if (!updatedTag) {
      throw new NotFoundException();
    }

    const tag = await this.tagsRepository.save({
      ...updatedTag,
      ...updateTagDto,
    });

    return {
      "creator": {
        "nickname": tag.user.nickname,
        "uid": tag.user.uid,
      },
      "name": tag.name,
      "sortOrder": tag.sortOrder,
    };
  }

  async delete(id: number, creatorUid: string): Promise<void> {
    const deletedTag = await this.tagsRepository.findOne({
      where: { creator: creatorUid, id: id },
    });
    if (!deletedTag) {
      throw new NotFoundException();
    }
    await this.tagsRepository.delete(deletedTag);
  }

  async findMany(ids: number[]): Promise<Tag[]> {
    const tags = await this.tagsRepository.find({
      where: { id: In(ids) }
    });
    return tags;
  }
}
