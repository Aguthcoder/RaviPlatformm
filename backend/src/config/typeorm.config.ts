import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres' as const,
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'ravi_user'),
    password: configService.get<string>('DB_PASSWORD', 'ravi_password_123'),
    database: configService.get<string>('DB_DATABASE', 'ravi_db'),
    autoLoadEntities: true,
    synchronize: false,
    logging: configService.get<string>('NODE_ENV') !== 'production',
  }),
};
