import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MapService {
  private readonly API_CLIENT_ID: string;
  private readonly API_CLIENT_SECRET: string;

  constructor(private readonly configService: ConfigService) {
    this.API_CLIENT_ID = configService.get('NAVER_MAP_API_CLIENT_ID');
    this.API_CLIENT_SECRET = configService.get('NAVER_MAP_API_CLIENT_SECRET');
  }
}
