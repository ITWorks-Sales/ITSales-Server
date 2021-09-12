import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { LinkedinProfileService } from 'src/linkedin-profile/linkedin-profile.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Field } from './field.entity';
import { Template } from './template.entity';
import { field, TemplatesFilters, templateType } from './types';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
    private usersService: UsersService,
    private linkedinProfileService: LinkedinProfileService,
  ) {}

  async paginate(
    userId: number,
    paginationOptions: IPaginationOptions,
    paginationFilters: TemplatesFilters,
  ): Promise<Pagination<Template>> {
    const searchOptions = { relations: [], where: {} };

    if (paginationFilters.currentUserOnly) {
      searchOptions.relations.push('user');
      searchOptions.where = { user: { id: userId } };
    }
    if (paginationFilters.templateType) {
      searchOptions.where = {
        ...searchOptions.where,
        type: paginationFilters.templateType,
      };
    }
    return paginate<Template, IPaginationMeta>(
      this.templateRepository,
      paginationOptions,
      searchOptions,
    );
  }

  async getOne(templateId: number) {
    return this.templateRepository.findOne({ id: templateId });
  }

  async createInmailTemplate(
    userId: number,
    linkedinProfileId: number,
    fields: field[],
    type: templateType,
  ) {
    console.log(33);

    const user = await this.usersService.findOneById(userId);
    const linkedinProfile = await this.linkedinProfileService.findOneById(
      linkedinProfileId,
    );

    const template = new Template();
    template.user = user;
    template.linkedin_profile = linkedinProfile;
    template.type = type;
    template.fields = [];

    for (const field of fields) {
      const dbField = new Field();
      dbField.value = field.value;
      dbField.key = field.key;
      dbField.type = field.type;
      template.fields.push(dbField);
    }

    console.log(template);

    return await this.templateRepository.save(template);
  }

  async updateInmailTemplate(
    userId: number,
    templateId: number,
    fields: field[],
  ) {
    const template = await this.templateRepository.findOne({
      where: { id: templateId },
      relations: ['user'],
    });

    if (template.user.id !== userId) throw UnauthorizedException;

    template.fields.map((templateField) => {
      const field = fields.find((field) => field.key === templateField.key);

      templateField.value = field.value;
      templateField.type = field.type;
      return templateField;
    });

    return this.templateRepository.save(template);
  }
}
