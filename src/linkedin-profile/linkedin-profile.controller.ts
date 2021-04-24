import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Delete,
  Request,
  Body,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { CreateLinkedinProfileDTO } from './dto/create-linkedin-profile.dto';
import { UpdateLinkedinProfileDTO } from './dto/update-linkedin-profile.dto';
import { DeleteLinkedinProfileDTO } from './dto/delete-linkedin-profile.dto';
import { LinkedinProfileService } from './linkedin-profile.service';

@Controller('linkedin-profile')
export class LinkedinProfileController {
  constructor(private linkedinProfileService: LinkedinProfileService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  profiles(@Request() req) {
    console.log(req.user);
    return this.linkedinProfileService.findAll(req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req,
    @Body() createLinkedinProfileDto: CreateLinkedinProfileDTO,
  ) {
    return await this.linkedinProfileService.create(
      createLinkedinProfileDto,
      req,
    );
  }

  @Put('')
  @HttpCode(HttpStatus.OK)
  async updateProxy(
    @Request() req,
    @Body() updateLinkedinProfileDto: UpdateLinkedinProfileDTO,
  ) {
    const linkedinProfile = await this.linkedinProfileService.findOneByIdWithUser(
      updateLinkedinProfileDto.id,
    );

    console.log(linkedinProfile);
    if (!linkedinProfile || linkedinProfile.user.id !== req.user.id) {
      throw new NotFoundException();
    }

    return await this.linkedinProfileService.update(
      req,
      updateLinkedinProfileDto,
    );
  }

  @Delete()
  @HttpCode(HttpStatus.ACCEPTED)
  async delete(
    @Request() req,
    @Body() deleteLinkedinProfileDto: DeleteLinkedinProfileDTO,
  ) {
    return await this.linkedinProfileService.delete(
      req,
      deleteLinkedinProfileDto,
    );
  }
}
