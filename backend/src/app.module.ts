import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ArticleModule } from './article/article.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config.js';
import { CategoryModule } from './category/category.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ProfileModule } from './profile/profile.module.js';
import { CloudinaryModule } from './cloudinary/cloudinary.module.js';
import { TagModule } from './tag/tag.module.js';
import { CommentModule } from './comment/comment.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        typeOrmConfig(configService),
    }),
    ArticleModule,
    CategoryModule,
    AuthModule,
    UsersModule,
    ProfileModule,
    CloudinaryModule,
    TagModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
