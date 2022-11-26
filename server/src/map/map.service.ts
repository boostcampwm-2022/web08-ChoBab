import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { REVERSE_GEOCODE_API_URL } from '@constants/api';
import { CustomException } from '@common/exceptions/custom.exception';
import { isInKorea } from '@utils/location';

@Injectable()
export class MapService {
  private readonly NAVER_MAP_CLIENT_ID: string;
  private readonly NAVER_MAP_CLIENT_SECRET: string;

  constructor(private readonly configService: ConfigService) {
    this.NAVER_MAP_CLIENT_ID = this.configService.get('NAVER_MAP_CLIENT_ID');
    this.NAVER_MAP_CLIENT_SECRET = this.configService.get('NAVER_MAP_CLIENT_SECRET');
  }

  /**
   * 입력된 위도, 경도 데이터를 도로명 주소로 반환
   */
  async reverseGeocode(lat: number, lng: number) {
    if (!isInKorea(lat, lng)) {
      throw new CustomException('대한민국을 벗어난 입력입니다.');
    }

    const { region, land } = await this.getRegionAndLandData(lat, lng);
    const roadAddr = this.combineRegionAndLandData(region, land); // 도로명 주소

    return roadAddr;
  }

  /**
   * Naver Maps의 Reverse geocoding API에 요청을 보내고, 응답 데이터를 반환
   */
  private async getRegionAndLandData(lat: number, lng: number) {
    const position = `${lng},${lat}`;
    try {
      const { data } = await axios.get(REVERSE_GEOCODE_API_URL, {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': this.NAVER_MAP_CLIENT_ID,
          'X-NCP-APIGW-API-KEY': this.NAVER_MAP_CLIENT_SECRET,
        },
        params: { coords: position, output: 'json', orders: 'roadaddr' },
      });

      if (data?.status?.code !== 0) {
        throw new Error(); // 성공적 응답이 아닌 경우
      }
      return data.results[0];
    } catch (error) {
      throw new CustomException('위치 좌표의 주소 변환 요청이 실패했습니다.');
    }
  }

  /**
   * region과 land 데이터를 조합하여 도로명 주소를 반환
   */
  private combineRegionAndLandData = (regionData: any, landData: any) => {
    const { area1, area2 } = regionData;
    const { name, number1 } = landData;

    return [area1?.name, area2?.name, name, number1].filter((v) => v).join(' ');
  };
}
