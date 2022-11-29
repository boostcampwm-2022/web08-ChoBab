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

  validStartAndGoalData(start: number[], goal: number[]) {
    if (start.length !== 2 || goal.length !== 2) {
      throw new CustomException(COMMON_EXCEPTION.INVALID_QUERY_PARAMS);
    }

    const [startLng, startLat] = start;
    const [goalLng, goalLat] = goal;

    if (!isInKorea(startLat, startLng) || !isInKorea(goalLat, goalLng)) {
      throw new CustomException(LOCATION_EXCEPTION.OUT_OF_KOREA);
    }
  }
}
