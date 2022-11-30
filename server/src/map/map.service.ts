import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomException } from '@common/exceptions/custom.exception';
import { COMMON_EXCEPTION } from '@response/common';
import { isInKorea } from '@utils/location';
import { LOCATION_EXCEPTION } from '@response/location';

@Injectable()
export class MapService {
  private readonly API_CLIENT_ID: string;
  private readonly API_CLIENT_SECRET: string;

  constructor(private readonly configService: ConfigService) {
    this.API_CLIENT_ID = configService.get('NAVER_MAP_API_CLIENT_ID');
    this.API_CLIENT_SECRET = configService.get('NAVER_MAP_API_CLIENT_SECRET');
  }

  private validPosData(pos: number[]) {
    if (pos.length !== 2) {
      throw new CustomException(COMMON_EXCEPTION.INVALID_QUERY_PARAMS);
    }

    const [lng, lat] = pos;
    if (!isInKorea(lat, lng)) {
      throw new CustomException(LOCATION_EXCEPTION.OUT_OF_KOREA);
    }
  }

  drivingInfo(start: number[], goal: number[]) {
    this.validPosData(start), this.validPosData(goal);
    console.log(start, goal);
    return;
  }
}
