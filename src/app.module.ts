import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ArticleModule } from './article/article.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config.js';



@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), 
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (ConfigService: ConfigService) => ({
      ...ConfigService.get("database")
    })
  }),
  ArticleModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
