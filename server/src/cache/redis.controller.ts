import {
  CacheInterceptor,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  UseInterceptors,
} from '@nestjs/common';

import { Cache } from 'cache-manager';

@Controller('cache')
export class RedisController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  @Get()
  async test() {
    const test = await this.cacheManager.set('test', 'holy', 300);
    return { message: '성공', data: 'ss' };
  }
}
