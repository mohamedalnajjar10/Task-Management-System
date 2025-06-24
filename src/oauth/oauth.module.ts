import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { GoogleStrategy } from './strategy/strategy-google';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';


@Module({
  imports: [SequelizeModule.forFeature([User]) , UsersModule],
  controllers: [OauthController],
  providers: [OauthService , GoogleStrategy],
})
export class OauthModule {}

