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
import { CRMFilters } from 'src/linkedin-user/types';
import { CreateEdgeDTO } from './dto/create-edge.dto';
import { CreateFlowDTO } from './dto/create-flow.dto';
import { CreateNodeDTO } from './dto/create-node.dto';
import { DeleteEdgesDTO } from './dto/delete-edges.dto';
import { DeleteNodesDTO } from './dto/delete-nodes.dto';
import { UpdateEdgeDTO } from './dto/update-edge.dto';
import { UpdateFlowDTO } from './dto/update-flow.dto';
import { updateNodesFieldsDTO } from './dto/update-nodes-fields.dto';
import { UpdateNodesDTO } from './dto/update-nodes.dto';
import { UpdateNodesUsersDTO } from './dto/update-nodes-users.dto';
import { FlowsService } from './flows.service';
import { nodeDetails } from './types';

@Controller('flows')
export class FlowsController {
  constructor(private flowService: FlowsService) {}

  @Get('test')
  @HttpCode(HttpStatus.OK)
  async test() {
    return this.flowService.test();
  }

  @Put('test')
  @HttpCode(HttpStatus.OK)
  async putTest() {
    return this.flowService.add();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getOne(@Query('id') flowId: string) {
    const id = parseInt(flowId);
    if (!id) return await this.flowService.findAll();
    return this.flowService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createFlowDto: CreateFlowDTO) {
    const { profileId, title } = createFlowDto;
    return this.flowService.createOneFlow(profileId, title);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(@Body() updateFlowDto: UpdateFlowDTO) {
    return this.flowService.updateFlow(updateFlowDto);
  }

  @Post('/node')
  @HttpCode(HttpStatus.CREATED)
  async createNode(@Request() req, @Body() createNodeDto: CreateNodeDTO) {
    return await this.flowService.createNode(createNodeDto);
  }

  @Put('/node/position')
  @HttpCode(HttpStatus.OK)
  async updateNodesPosition(@Body() updateNodesDto: UpdateNodesDTO) {
    return await this.flowService.updateNodesPosition(updateNodesDto);
  }

  @Put('/node/fields')
  @HttpCode(HttpStatus.OK)
  async updateNodesFields(@Body() updateNodesFieldsDto: updateNodesFieldsDTO) {
    return await this.flowService.updateNodesFields(updateNodesFieldsDto);
  }

  @Put('/node/users')
  @HttpCode(HttpStatus.OK)
  async updateNodesUsers(@Body() updateNodesUsersDto: UpdateNodesUsersDTO) {
    return await this.flowService.updateNodeUsers(updateNodesUsersDto);
  }

  @Delete('/node')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteNodes(@Body() deleteNodesDto: DeleteNodesDTO) {
    return await this.flowService.deleteNodes(deleteNodesDto);
  }

  @Post('/edge')
  @HttpCode(HttpStatus.CREATED)
  async createEdge(@Request() req, @Body() createEdgeDto: CreateEdgeDTO) {
    return await this.flowService.createEdge(createEdgeDto);
  }

  @Put('/edge')
  @HttpCode(HttpStatus.OK)
  async updateEdge(@Body() updateEdgeDto: UpdateEdgeDTO) {
    return await this.flowService.updateEdge(updateEdgeDto);
  }

  @Delete('/edge')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteEdges(@Body() deleteEdgesDto: DeleteEdgesDTO) {
    return await this.flowService.deleteEdges(deleteEdgesDto);
  }
}
