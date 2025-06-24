import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { OauthModule } from './oauth/oauth.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), I18nModule.forRootAsync({
    useFactory:() => ({
      fallbackLanguage: 'en', // Default language
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true, // Watch for changes in translation files
      },
      resolvers: [
         //HeaderResolver, // Resolver to get language from request headers
         AcceptLanguageResolver,
         // QueryResolver, // Resolver to get language from query parameters
          { use: QueryResolver, options: ['lang'] },
        // CookieResolver, // Resolver to get language from cookies
        
      ], // بجيب اللغة الي المستخدم بدو اياها    // An array of resolvers used to resolve the requested translation.
    })
  }) ,DatabaseModule, UsersModule, AuthModule,
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    global: true,
    signOptions: process.env.JWT_EXPIRES_IN ? { expiresIn: process.env.JWT_EXPIRATION } : undefined,
  }),
  MailerModule.forRoot({
    transport: {
      service : process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }, 
    },
  }),
  OauthModule,
  TasksModule,
  CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
