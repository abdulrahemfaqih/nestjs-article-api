import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TagService } from './tag.service.js';
import { CreateTagDTO } from './dto/create-tag.dto.js';
import { UpdateTagDTO } from './dto/update-tag.dto.js';
import { Tag } from './entities/tag.entity.js';
import { FindOneParams } from './dto/find-one.params.js';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  async create(@Body() createTagDTO: CreateTagDTO): Promise<Tag> {
    return await this.tagService.create(createTagDTO);
  }

  @Get()
  async findAll(): Promise<Tag[]> {
    return await this.tagService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: FindOneParams): Promise<Tag> {
    return await this.tagService.findOne(params.id);
  }

  @Patch(':id')
  async update(
    @Param() params: FindOneParams,
    @Body() updateTagDTO: UpdateTagDTO,
  ): Promise<Tag> {
    return await this.tagService.update(params.id, updateTagDTO);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param() params: FindOneParams): Promise<void> {
    await this.tagService.remove(params.id);
  }
}
