import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkedinProfileService } from 'src/linkedin-profile/linkedin-profile.service';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import { CreateEdgeDTO } from './dto/create-edge.dto';
import { CreateNodeDTO } from './dto/create-node.dto';
import Flow from './flow.entity';
import InmailNode from './inmailNode.entity';
import Edge from './edge.entity';
import QueueNode from './queueNode.entity';
import { UpdateFlowDTO } from './dto/update-flow.dto';
import { UpdateNodesDTO } from './dto/update-nodes.dto';
import { UpdateEdgeDTO } from './dto/update-edge.dto';
import { DeleteEdgesDTO } from './dto/delete-edges.dto';
import { DeleteNodesDTO } from './dto/delete-nodes.dto';
import { LinkedinUserService } from 'src/linkedin-user/linkedin-user.service';
import { updateNodesFieldsDTO } from './dto/update-nodes-fields.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { CRMFilters } from 'src/linkedin-user/types';
import { nodeDetails } from './types';
import { UpdateNodesUsersDTO } from './dto/update-nodes-users.dto';

@Injectable()
export class FlowsService {
  constructor(
    @InjectRepository(Flow)
    private flowRepository: Repository<Flow>,
    @InjectRepository(Edge)
    private edgeRepository: Repository<Edge>,
    @InjectRepository(InmailNode)
    private inmailNodeRepository: Repository<InmailNode>,
    @InjectRepository(QueueNode)
    private queueNodeRepository: Repository<QueueNode>,
    private linkedinProfileService: LinkedinProfileService,
    private linkedinUserService: LinkedinUserService,
  ) {}

  async findAll() {
    return await this.flowRepository.find();
  }

  async test() {
    const count1 = await this.inmailNodeRepository
      .createQueryBuilder('node')
      .loadRelationCountAndMap('node.success_users_count', 'node.success_users')
      .loadRelationCountAndMap('node.failed_users_count', 'node.failed_users')
      .where('node.id = :id', { id: 11 })
      .getOne();
    return count1;
    // .getManyAndCount();
  }

  async usersPagination(
    options: IPaginationOptions,
    filters: CRMFilters,
    nodeDetails: nodeDetails,
  ) {
    return this.linkedinUserService.paginate(options, filters, nodeDetails);
  }

  async add() {
    const node = await this.inmailNodeRepository.findOne({
      relations: ['success_users', 'failed_users'],
      where: { id: 11 },
    });
    console.log(node);
    const profile1 = await this.linkedinUserService.findOneById(123);
    const profile2 = await this.linkedinUserService.findOneById(5);
    console.log(profile1);
    console.log(profile1, profile2);
    node.success_users.push(profile1);
    node.success_users.push(profile2);
    return this.inmailNodeRepository.save(node);
  }

  async findOne(id: number) {
    // return this.flowRepository
    //   .createQueryBuilder('flow')
    //   .leftJoinAndSelect('flow.successuful_profiles', 'failed_profiles')
    //   .getCount();
    return await this.flowRepository
      .createQueryBuilder('flow')
      .leftJoinAndSelect('flow.edges', 'edges')
      .leftJoinAndSelect('flow.inmail_nodes', 'inmail_nodes')
      .leftJoinAndSelect('flow.queue_nodes', 'queue_nodes')
      .loadRelationCountAndMap(
        'queue_nodes.collected_users_count',
        'queue_nodes.collected_users',
      )
      .loadRelationCountAndMap(
        'inmail_nodes.success_users_count',
        'inmail_nodes.success_users',
      )
      .loadRelationCountAndMap(
        'inmail_nodes.failed_users_count',
        'inmail_nodes.failed_users',
      )
      .where('flow.id = :id', { id })
      .getOne();
  }

  async createOneFlow(profileId: number, title: string) {
    const profile = await this.linkedinProfileService.findOneById(profileId);

    return await this.flowRepository.save({
      title: title,
      linkedin_profile: profile,
      view_x: 0,
      view_y: 0,
      zoom: 1,
    });
  }

  async updateFlow(updateFlowDto: UpdateFlowDTO) {
    const { zoom, id, x: view_x, y: view_y } = updateFlowDto;
    let flow = await this.findOne(id);
    flow = { ...flow, zoom, view_x, view_y };
    return await this.flowRepository.save(flow);
  }

  async createNode(createNodeDto: CreateNodeDTO) {
    const { flowId, type, ...nodePosition } = createNodeDto;
    const flow = await this.flowRepository.findOne(flowId);
    const node = { flow, ...nodePosition };

    if (type === 'Inmail') {
      return await this.inmailNodeRepository.save(node);
    }
    if (type === 'Queue') {
      return await this.queueNodeRepository.save(node);
    }
  }

  async updateNodesPosition(updateNodesDto: UpdateNodesDTO) {
    const { nodes } = updateNodesDto;
    const unresolved: Promise<any>[] = [];
    nodes.forEach(({ type, id, position }) => {
      const { x, y } = position;
      const nodeId = parseInt(id.split('_')[0]);
      const updateNode = { id: nodeId, position_x: x, position_y: y };
      if (type === 'Inmail') {
        unresolved.push(this.inmailNodeRepository.save(updateNode));
      } else if (type === 'Queue') {
        unresolved.push(this.queueNodeRepository.save(updateNode));
      }
    });
    await Promise.all(unresolved);
    return;
  }

  async updateNodesFields(updateNodesFieldsDto: updateNodesFieldsDTO) {
    const { id, type } = updateNodesFieldsDto;
    switch (type) {
      case 'Inmail':
        const node = await this.inmailNodeRepository.findOne(id);
        _.merge(node, updateNodesFieldsDto.inmailFields);
        return this.inmailNodeRepository.save(node);
    }
  }

  async updateNodeUsers(updateNodesUsersDto: UpdateNodesUsersDTO) {
    const { filters, nodeDetails } = updateNodesUsersDto;
    const { id, type, nodeType } = nodeDetails;
    if (nodeType === 'Inmail') {
      const node = await this.inmailNodeRepository.findOne(id);
      const users = await this.linkedinUserService
        .queryBuilderFilters(filters, nodeDetails)
        .getMany();
      if (type === 'failed_users') {
        node.failed_users = users;
      }
      if (type === 'success_users') {
        node.success_users = users;
      }
      this.inmailNodeRepository.save(node);
    }
    return;
  }

  async deleteNodes(deleteNodesDto: DeleteNodesDTO) {
    const { nodes } = deleteNodesDto;
    const inmailNodeIds: number[] = [];
    const queueNodeIds: number[] = [];
    nodes.forEach(({ id, type }) => {
      if (type === 'Inmail') inmailNodeIds.push(id);
      else if (type === 'Queue') queueNodeIds.push(id);
    });
    if (inmailNodeIds.length > 0)
      await this.inmailNodeRepository.delete(inmailNodeIds);
    if (queueNodeIds.length > 0)
      await this.queueNodeRepository.delete(queueNodeIds);
    return;
  }

  async createEdge(createEdgeDto: CreateEdgeDTO) {
    const { flowId, ...sourceAndTarget } = createEdgeDto;
    const flow = await this.findOne(flowId);

    return await this.edgeRepository.save({
      ...sourceAndTarget,
      flow,
    });
  }

  async updateEdge(updateEdgeDto: UpdateEdgeDTO) {
    const { id } = updateEdgeDto;
    const edge = await this.edgeRepository.findOne(id);

    _.merge(edge, updateEdgeDto);

    return await this.edgeRepository.save(edge);
  }

  async deleteEdges(deleteEdgesDto: DeleteEdgesDTO) {
    if (deleteEdgesDto.edgeIds.length > 0)
      await this.edgeRepository.delete(deleteEdgesDto.edgeIds);
    return;
  }
}
