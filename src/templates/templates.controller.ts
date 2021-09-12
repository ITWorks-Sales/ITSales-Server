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
  Request,
} from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { CreateTemplateDTO } from './dto/create-template.dto';
import { UpdateTemplateDTO } from './dto/update-template.dto';
import { TemplatesService } from './templates.service';
import { TemplatesFilters } from './types';

@Controller('templates')
export class TemplatesController {
  constructor(private templatesService: TemplatesService) {}

  @Get()
  @HttpCode(HttpStatus.ACCEPTED)
  async getOne(@Query('id') templateId: number) {
    return this.templatesService.getOne(templateId);
  }

  @Get('/paginated')
  @HttpCode(HttpStatus.ACCEPTED)
  async getPaginated(
    @Request() req,
    @Query('options') options: string,
    @Query('filters') filters: string,
  ) {
    const paginationOptions = JSON.parse(options) as IPaginationOptions;
    const paginationFilters = JSON.parse(filters) as TemplatesFilters;
    return this.templatesService.paginate(
      req.user.id,
      paginationOptions,
      paginationFilters,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createTemplateDto: CreateTemplateDTO) {
    const { fields, linkedinProfileId, type } = createTemplateDto;

    switch (type) {
      case 'Inmail':
        return await this.templatesService.createInmailTemplate(
          req.user.id,
          linkedinProfileId,
          fields,
          type,
        );
      case 'Message':
        return 'message';
      default:
        return;
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(@Request() req, @Body() updateTemplateDto: UpdateTemplateDTO) {
    const { templateId, fields, type } = updateTemplateDto;

    console.log(updateTemplateDto);

    switch (type) {
      case 'Inmail':
        return await this.templatesService.updateInmailTemplate(
          req.user.id,
          templateId,
          fields,
        );
      case 'Message':
        return 'message';
      default:
        return;
    }
  }
}
