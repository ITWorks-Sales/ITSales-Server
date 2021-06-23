import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
import { CreateTagDTO } from './dto/create-tag.dto';
import { DeleteTagDTO } from './dto/delete-tag.dto';
import { UpdateTagDTO } from './dto/update-tag.dto';
import { Tag } from './tags.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  findAll() {
    return this.tagsRepository.find();
  }

  findOne(id: number) {
    return this.tagsRepository.findOne(id);
  }

  create(createTagDto: CreateTagDTO) {
    return this.tagsRepository.save(createTagDto);
  }

  async update(updateTagDto: UpdateTagDTO) {
    const tag = await this.tagsRepository.findOne(updateTagDto.id);

    delete updateTagDto.id;

    _.merge(tag, updateTagDto);

    return this.tagsRepository.save(tag);
  }

  delete(deleteTagDto: DeleteTagDTO) {
    return this.tagsRepository.delete({ id: deleteTagDto.id });
  }
}
