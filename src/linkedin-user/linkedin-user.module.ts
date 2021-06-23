import { Module } from '@nestjs/common';
import { LinkedinUserService } from './linkedin-user.service';
import { LinkedinUserController } from './linkedin-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkedinUser } from 'src/linkedin-user/linkedinUser.entity';
import { LinkedinProfileModule } from 'src/linkedin-profile/linkedin-profile.module';
import { MessageHistoryModule } from 'src/message-history/message-history.module';
import { UsersModule } from 'src/users/users.module';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinkedinUser]),
    LinkedinProfileModule,
    MessageHistoryModule,
    UsersModule,
    TagsModule,
  ],
  providers: [LinkedinUserService],
  controllers: [LinkedinUserController],
})
export class LinekdinUserModule {}
