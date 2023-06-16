import { forwardRef, Module } from '@nestjs/common';
import { FlowsService } from './flows.service';
import { FlowsController } from './flows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Edge from './edge.entity';
import InmailNode from './inmailNode.entity';
import QueueNode from './queueNode.entity';
import Flow from './flow.entity';
import { LinkedinProfileModule } from 'src/linkedin-profile/linkedin-profile.module';
import { LinkedinUserModule } from 'src/linkedin-user/linkedin-user.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Edge, InmailNode, QueueNode, Flow]),
    LinkedinProfileModule,
    forwardRef(() => LinkedinUserModule),
  ],
  providers: [FlowsService],
  controllers: [FlowsController],
  exports: [FlowsService],
})
export class FlowsModule {}
