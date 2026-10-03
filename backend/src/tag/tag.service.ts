import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tag } from './entities/tag.entity.js';
import { CreateTagDTO } from './dto/create-tag.dto.js';
import { UpdateTagDTO } from './dto/update-tag.dto.js';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDTO: CreateTagDTO): Promise<Tag> {
    const existing = await this.tagRepository.findOne({
      where: { name: createTagDTO.name },
    });
    if (existing) {
      throw new ConflictException(`Tag dengan nama "${createTagDTO.name}" sudah ada`);
    }

    const tag = this.tagRepository.create(createTagDTO);
    return await this.tagRepository.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.find({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
    if (!tag) {
      throw new NotFoundException(`Tag dengan ID ${id} tidak ditemukan`);
    }
    return tag;
  }

  async findByIds(ids: string[]): Promise<Tag[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    return await this.tagRepository.findBy({ id: In(ids) });
  }

  async update(id: string, updateTagDTO: UpdateTagDTO): Promise<Tag> {
    const tag = await this.findOne(id);
    if (updateTagDTO.name && updateTagDTO.name !== tag.name) {
      const existing = await this.tagRepository.findOne({
        where: { name: updateTagDTO.name },
      });
      if (existing) {
        throw new ConflictException(
          `Tag dengan nama "${updateTagDTO.name}" sudah ada`,
        );
      }
    }
    Object.assign(tag, updateTagDTO);
    return await this.tagRepository.save(tag);
  }

  async remove(id: string): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagRepository.remove(tag);
  }
}
