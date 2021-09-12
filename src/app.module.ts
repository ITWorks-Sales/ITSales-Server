import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkedinProfile } from './linkedin-profile/linkedinProfile.entity';
import { Proxy } from './proxy/proxy.entity';

import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LinkedinProfileModule } from './linkedin-profile/linkedin-profile.module';

import { ProxyModule } from './proxy/proxy.module';
import { LinkedinUserModule } from './linkedin-user/linkedin-user.module';
import { MessageHistoryModule } from './message-history/message-history.module';
import { LinkedinUser } from './linkedin-user/linkedinUser.entity';
import { MessageHistory } from './message-history/messageHistory.entity';
import { Message } from './message-history/message.entity';
import { TagsModule } from './tags/tags.module';
import { Tag } from './tags/tags.entity';
import { LiuserContactModule } from './liuser-contact/liuser-contact.module';
import { LIUserContact } from './liuser-contact/liuser-contact.entity';
import { TemplatesModule } from './templates/templates.module';
import { Template } from './templates/template.entity';
import { Field } from './templates/field.entity';
import { FlowsModule } from './flows/flows.module';
import Edge from './flows/edge.entity';
import InmailNode from './flows/inmailNode.entity';
import QueueNode from './flows/queueNode.entity';
import Flow from './flows/flow.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456789',
      database: 'test',
      entities: [
        User,
        LinkedinProfile,
        Proxy,
        LinkedinUser,
        MessageHistory,
        Message,
        Tag,
        LIUserContact,
        Template,
        Field,
        Flow,
        Edge,
        InmailNode,
        QueueNode,
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    LinkedinProfileModule,
    ProxyModule,
    LinkedinUserModule,
    MessageHistoryModule,
    TagsModule,
    LiuserContactModule,
    TemplatesModule,
    FlowsModule,
  ],
})
export class AppModule {}
