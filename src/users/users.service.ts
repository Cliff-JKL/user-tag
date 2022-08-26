import { forwardRef, Injectable, Inject, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PartialUserInterface } from "./interfaces/user.interface";
import { GetTagsInterface } from "../tags/interfaces/tag.interface";
import { GetUserDto } from "./dto/get-user.dto";
import { TagsService } from "../tags/tags.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly tagsService: TagsService,
  ) {}

  hashData(data: string): string {
    return bcrypt.hashSync(data, 10);
  }

  async create(createdUserDto: CreateUserDto): Promise<User> {
    const createdUser = new User();
    createdUser.email = createdUserDto.email;
    createdUser.nickname = createdUserDto.nickname;
    createdUser.password = this.hashData(createdUserDto.password);

    return await this.usersRepository.save(createdUser);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({
      relations: ['createdTags', 'tags'],
      where: { email: email },
    });
  }

  async findOneByUid(uid: string, relations?: string[]): Promise<User | undefined> {
    return await this.usersRepository.findOne({
      relations: relations,
      where: { uid: uid },
    });
  }

  async update(uid: string, updateUserDto: UpdateUserDto): Promise<PartialUserInterface> {
    console.log(updateUserDto);
    const updatedUser = await this.findOneByUid(uid);

    if (!updatedUser) {
      throw new NotFoundException();
    }

    if (updateUserDto.password) {
      updateUserDto.password = this.hashData(updateUserDto.password);
    }

    const user = await this.usersRepository.save({
      ...updatedUser,
      ...updateUserDto,
    });

    return {
      "email": user.email,
      "nickname": user.nickname,
    };
  }

  async delete(uid: string): Promise<void> {
    await this.usersRepository.delete({ uid: uid });
  }

  async addTags(uid: string, tags: number[]): Promise<GetTagsInterface> {
    const user = await this.findOneByUid(uid, [ 'tags' ]);

    if (!user) {
      throw new NotFoundException();
    }

    const tagsToAdd = await this.tagsService.findMany(tags);

    if (tagsToAdd.length !== tags.length) {
      throw new NotFoundException();
    }

    // TODO проверка на добавление уже имеющихся тэгов
    for (let i = 0; i < tagsToAdd.length; i++) {
      if (user.tags.indexOf(tagsToAdd[i]) === -1) {
        user.tags.push(tagsToAdd[i]);
      }
    }

    await this.usersRepository.save(user);

    return {
      "tags": user.tags.map(tag => ({
        "id": tag.id,
        "name": tag.name,
        "sortOrder": tag.sortOrder
      })),
    };
  }

  async findCreatedTags(uid: string): Promise<GetTagsInterface> {
    return await this.tagsService.findUserTags(uid);
  }

  async deleteTag(uid: string, tagId: number): Promise<GetTagsInterface> {
    const user = await this.usersRepository.findOne({
      relations: [ 'tags' ],
      where: { uid: uid },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const tagToDelete = await this.tagsService.findOneById(tagId);

    if (!tagToDelete) {
      throw new NotFoundException();
    }

    user.tags.splice(user.tags.findIndex(tag => tag.id === tagId), 1);
    await this.usersRepository.save(user);

    return {
      "tags": user.tags.map(tag => ({
        "id": tag.id,
        "name": tag.name,
        "sortOrder": tag.sortOrder
      })),
    };
  }
}
