import { Module } from '@nestjs/common';
import { LiuserContactService } from './liuser-contact.service';
import { LiuserContactController } from './liuser-contact.controller';

@Module({
  providers: [LiuserContactService],
  controllers: [LiuserContactController]
})
export class LiuserContactModule {}
