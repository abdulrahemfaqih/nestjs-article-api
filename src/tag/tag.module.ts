import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity.js';
import { TagService } from './tag.service.js';
import { TagController } from './tag.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService, TypeOrmModule],
})
export class TagModule {}
