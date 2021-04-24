import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProxyService } from 'src/proxy/proxy.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateLinkedinProfileDTO } from './dto/create-linkedin-profile.dto';
import { DeleteLinkedinProfileDTO } from './dto/delete-linkedin-profile.dto';
import { UpdateLinkedinProfileDTO } from './dto/update-linkedin-profile.dto';
import { LinkedinProfile } from './linkedinProfile.entity';

@Injectable()
export class LinkedinProfileService {
  constructor(
    @InjectRepository(LinkedinProfile)
    private linkedinProfilesRepository: Repository<LinkedinProfile>,
    private usersService: UsersService,
    private proxyService: ProxyService,
  ) {}

  async findAll(userId: number): Promise<LinkedinProfile[]> {
    return await this.linkedinProfilesRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findOneById(id: number): Promise<LinkedinProfile | undefined> {
    return await this.linkedinProfilesRepository.findOne({
      where: { id },
    });
  }

  async findOneByIdWithUser(id: number): Promise<LinkedinProfile | undefined> {
    return await this.linkedinProfilesRepository.findOne({
      relations: ['user'],
      where: { id },
    });
  }

  async create(
    createLinkedinProfileDTO: CreateLinkedinProfileDTO,
    req,
  ): Promise<LinkedinProfile> {
    const { email, password } = createLinkedinProfileDTO;
    const user = await this.usersService.findOneById(req.user.id);
    console.log(user);
    return await this.linkedinProfilesRepository.save({
      email,
      password,
      user,
    });
  }

  async update(
    req,
    updateLinkedinprofileDTO: UpdateLinkedinProfileDTO,
  ): Promise<LinkedinProfile> {
    const linkedinProfile = await this.findOneById(updateLinkedinprofileDTO.id);
    const {
      email,
      password,
      name,
      linkedin_image,
      active,
      proxyId,
    } = updateLinkedinprofileDTO;

    console.log(proxyId);
    if (proxyId === null) {
      linkedinProfile.proxy = null;
    }

    if (proxyId) {
      const proxy = await this.proxyService.findOneByIdWithUser(proxyId);
      if (!proxy || proxy.user.id !== req.user.id) {
        throw new NotFoundException();
      }

      linkedinProfile.proxy = proxy;
    }

    linkedinProfile.email = email || linkedinProfile.email;
    linkedinProfile.password = password || linkedinProfile.password;
    linkedinProfile.name = name || linkedinProfile.name;
    linkedinProfile.linkedin_image =
      linkedin_image || linkedinProfile.linkedin_image;
    linkedinProfile.active = active ?? linkedinProfile.active;
    return await this.linkedinProfilesRepository.manager.save(linkedinProfile);
  }

  async delete(req, deleteLinkedinProfileDto: DeleteLinkedinProfileDTO) {
    const { ids } = deleteLinkedinProfileDto;
    for (const id of ids) {
      const profile = await this.findOneByIdWithUser(id);
      if (!profile || !profile.user || profile.user.id !== req.user.id) {
        ids.splice(ids.indexOf(id), 1);
      }
    }
    if (ids.length > 0) await this.linkedinProfilesRepository.delete(ids);
    return ids;
  }
}
