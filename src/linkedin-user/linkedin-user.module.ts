import { Module } from '@nestjs/common';
import { LinkedinUserService } from './linkedin-user.service';
import { LinkedinUserController } from './linkedin-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkedinUser } from 'src/linkedin-user/linkedinUser.entity';
import { LinkedinProfileModule } from 'src/linkedin-profile/linkedin-profile.module';
import { MessageHistoryModule } from 'src/message-history/message-history.module';
import { UsersModule } from 'src/users/users.module';
import { TagsModule } from 'src/tags/tags.module';
import InmailNode from 'src/flows/inmailNode.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinkedinUser, InmailNode]),
    LinkedinProfileModule,
    MessageHistoryModule,
    UsersModule,
    TagsModule,
  ],
  providers: [LinkedinUserService],
  controllers: [LinkedinUserController],
  exports: [LinkedinUserService],
})
export class LinkedinUserModule {}
