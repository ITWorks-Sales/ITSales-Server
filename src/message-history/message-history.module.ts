import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageHistoryService } from './message-history.service';
import { Message } from './message.entity';
import { MessageHistory } from './messageHistory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageHistory, Message])],
  providers: [MessageHistoryService],
  exports: [MessageHistoryService],
})
export class MessageHistoryModule {}
