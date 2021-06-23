import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkedinProfile } from 'src/linkedin-profile/linkedinProfile.entity';
import { LinkedinUser } from 'src/linkedin-user/linkedinUser.entity';
import { Repository } from 'typeorm';
import { MessageHistory } from './messageHistory.entity';

@Injectable()
export class MessageHistoryService {
  constructor(
    @InjectRepository(MessageHistory)
    private messageHistoryRepository: Repository<MessageHistory>,
  ) {}

  async create(linkedinProfile: LinkedinProfile, linkedinUser?: LinkedinUser) {
    return await this.messageHistoryRepository.save({
      ...(linkedinUser && { linkedin_user: linkedinUser }),
      messages: [],
      linkedin_profile: linkedinProfile,
    });
  }
}
