import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkedinProfile } from './linkedinProfile.entity';
import { UsersModule } from 'src/users/users.module';
import { ProxyModule } from 'src/proxy/proxy.module';
import { LinkedinProfileController } from './linkedin-profile.controller';
import { LinkedinProfileService } from './linkedin-profile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinkedinProfile]),
    UsersModule,
    ProxyModule,
  ],

  controllers: [LinkedinProfileController],

  providers: [LinkedinProfileService],

  exports: [LinkedinProfileService],
})
export class LinkedinProfileModule {}
