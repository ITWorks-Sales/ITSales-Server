import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './template.entity';
import { Field } from './field.entity';
import { UsersModule } from 'src/users/users.module';
import { LinkedinProfileModule } from 'src/linkedin-profile/linkedin-profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Template, Field]),
    UsersModule,
    LinkedinProfileModule,
  ],
  providers: [TemplatesService],
  controllers: [TemplatesController],
})
export class TemplatesModule {}
