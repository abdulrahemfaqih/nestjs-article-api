import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isSsl =
    configService.get<string>('DB_SSL') === 'true' ||
    Boolean(configService.get<string>('DATABASE_URL'));

  const databaseUrl = configService.get<string>('DATABASE_URL');

  return {
    type: 'postgres',
    ...(databaseUrl
      ? { url: databaseUrl }
      : {
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
        }),
    autoLoadEntities: true,
    ssl: isSsl ? { rejectUnauthorized: false } : false,
  };
};
