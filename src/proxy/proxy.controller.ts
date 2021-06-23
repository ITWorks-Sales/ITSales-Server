import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { CreateProxyDTO } from './dto/create-proxy.dto';
import { DeleteProxyDTO } from './dto/delete-proxy.dto';
import { UpdateProxyDTO } from './dto/update-proxy.dto';
import { ProxyService } from './proxy.service';

@Controller('proxy')
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  profiles(@Request() req) {
    return this.proxyService.findAll(req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createProxyDto: CreateProxyDTO) {
    return await this.proxyService.create(createProxyDto, req);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(@Request() req, @Body() updateProxyDto: UpdateProxyDTO) {
    const { id } = updateProxyDto;
    const proxy = await this.proxyService.findOneByIdWithUser(id);

    if (!proxy || proxy.user.id !== req.user.id) {
      throw new NotFoundException();
    }

    return this.proxyService.update(updateProxyDto, proxy);
  }

  @Delete()
  @HttpCode(HttpStatus.ACCEPTED)
  async delete(@Request() req, @Body() deleteProxyDto: DeleteProxyDTO) {
    return await this.proxyService.delete(req, deleteProxyDto);
  }
}
