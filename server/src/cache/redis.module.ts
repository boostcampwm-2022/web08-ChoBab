import { REDIS_TTL } from '@constants/time';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { RedisController } from './redis.controller';

@Module({
  imports: [
    CacheModule.registerAsync<any>({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const redisHost = await configService.get('REDIS_HOST');
        const redisPort = await configService.get('REDIS_PORT');
        console.log(redisHost, redisPort);
        const store = await redisStore({
          socket: { host: redisHost, port: redisPort },
          ttl: REDIS_TTL,
        });
        return {
          store: () => store,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [RedisController],
})
export class RedisModule {}
