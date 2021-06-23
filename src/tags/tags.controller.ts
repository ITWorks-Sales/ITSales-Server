import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateTagDTO } from './dto/create-tag.dto';
import { DeleteTagDTO } from './dto/delete-tag.dto';
import { UpdateTagDTO } from './dto/update-tag.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  get(@Query('id') id: number, @Query('type') type: 'all' | 'one') {
    if (type === 'all') return this.tagsService.findAll();
    if (type === 'one') return this.tagsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTagDto: CreateTagDTO) {
    return this.tagsService.create(createTagDto);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() updateTagDto: UpdateTagDTO) {
    return this.tagsService.update(updateTagDto);
  }

  @Delete()
  @HttpCode(HttpStatus.ACCEPTED)
  delete(@Body() deleteTagDto: DeleteTagDTO) {
    return this.tagsService.delete(deleteTagDto);
  }
}
