import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateProxyDTO } from './dto/create-proxy.dto';
import { DeleteProxyDTO } from './dto/delete-proxy.dto';
import { UpdateProxyDTO } from './dto/update-proxy.dto';
import { Proxy } from './proxy.entity';

@Injectable()
export class ProxyService {
  constructor(
    @InjectRepository(Proxy)
    private proxyRepository: Repository<Proxy>,
    private usersService: UsersService,
  ) {}

  async findAll(userId: number): Promise<Proxy[]> {
    return await this.proxyRepository.find({
      where: { user: { id: userId } },
    });
  }
  async findOneById(id: number): Promise<Proxy | undefined> {
    return await this.proxyRepository.findOne({ id });
  }

  async findOneByIdWithUser(id: number): Promise<Proxy | undefined> {
    return await this.proxyRepository.findOne({
      relations: ['user'],
      where: { id },
    });
  }

  async create(createProxyDto: CreateProxyDTO, req): Promise<Proxy> {
    const { ip, login, password } = createProxyDto;
    return await this.proxyRepository.save({
      ip,
      login,
      password,
      user: await this.usersService.findOneById(req.user.id),
    });
  }

  async update(updateProxyDto: UpdateProxyDTO, proxy: Proxy) {
    const { ip, login, password } = updateProxyDto;

    proxy.ip = ip || proxy.ip;
    proxy.login = login || proxy.login;
    proxy.password = password || proxy.password;

    return await this.proxyRepository.manager.save(proxy);
  }

  async updateFromOutside(proxy: Proxy) {
    return await this.proxyRepository.manager.save(proxy);
  }

  async delete(req, deleteProxyDto: DeleteProxyDTO) {
    const { ids } = deleteProxyDto;
    for (const id of ids) {
      const proxy = await this.findOneByIdWithUser(id);
      if (!proxy || !proxy.user || proxy.user.id !== req.user.id) {
        ids.splice(ids.indexOf(id), 1);
      }
    }

    if (ids.length > 0) await this.proxyRepository.delete(ids);
    return ids;
  }
}
