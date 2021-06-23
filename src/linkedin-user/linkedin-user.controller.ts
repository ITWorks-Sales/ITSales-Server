import {
  Body,
  Query,
  Request,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Put,
} from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { CreateLIHelperDto } from './dto/create-lihelper.dto';
import { UpdateLIUserDTO } from './dto/update-liuser.dto';
import { UpdateTagLIUserDTO } from './dto/update-tag-liuser.dto';
import { LinkedinUserService } from './linkedin-user.service';
import { CRMFilters } from './types';

@Controller('linkedin-user')
export class LinkedinUserController {
  constructor(private linkedinUserService: LinkedinUserService) {}

  @Post('/liHelper')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req,
    @Body() createLIHelperDto: CreateLIHelperDto,
    @Query('linkedinProfileId') linkedinProfileId: number,
  ) {
    const { liHelperData } = createLIHelperDto;

    await this.linkedinUserService.createFromLIHelper(
      liHelperData,
      linkedinProfileId,
      req.user.id,
    );
    return;
  }

  @Get('')
  @HttpCode(HttpStatus.ACCEPTED)
  async getUser(@Query('id') id: number) {
    return this.linkedinUserService.findOneById(id);
  }

  @Get('/paginated')
  @HttpCode(HttpStatus.ACCEPTED)
  async getPaginated(
    @Query('options') options: string,
    @Query('filters') filters: string,
  ) {
    const paginationOptions = JSON.parse(options) as IPaginationOptions;
    const paginationFilters = JSON.parse(filters) as CRMFilters;
    return this.linkedinUserService.paginate(
      paginationOptions,
      paginationFilters,
    );
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(@Body() updateLIUserDto: UpdateLIUserDTO) {
    return this.linkedinUserService.update(updateLIUserDto);
  }

  @Put('/tag')
  @HttpCode(HttpStatus.OK)
  async updateTag(@Body() updateTagLIUserDto: UpdateTagLIUserDTO) {
    return this.linkedinUserService.updateTag(updateTagLIUserDto);
  }
}
