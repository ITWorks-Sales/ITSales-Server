import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkedinProfile } from './linkedin-profile/linkedinProfile.entity';
import { Proxy } from './proxy/proxy.entity';

import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LinkedinProfileModule } from './linkedin-profile/linkedin-profile.module';

import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5000,
      username: 'postgres',
      password: '123456789',
      database: 'test',
      entities: [User, LinkedinProfile, Proxy],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    LinkedinProfileModule,
    ProxyModule,
  ],
})
export class AppModule {}
