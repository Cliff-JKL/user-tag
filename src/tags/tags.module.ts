import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), UsersModule],
  providers: [TagsService, JwtStrategy],
  controllers: [TagsController],
  exports: [TagsService, TypeOrmModule],
})
export class TagsModule {}
