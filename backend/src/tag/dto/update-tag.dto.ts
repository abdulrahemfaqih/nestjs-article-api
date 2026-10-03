import { PartialType } from '@nestjs/swagger';
import { CreateTagDTO } from './create-tag.dto.js';

export class UpdateTagDTO extends PartialType(CreateTagDTO) {}
