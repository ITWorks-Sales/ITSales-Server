import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { UsersModule } from 'src/users/users.module';
import { Proxy } from './proxy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proxy]), UsersModule],
  controllers: [ProxyController],
  providers: [ProxyService],
  exports: [ProxyService],
})
export class ProxyModule {}
