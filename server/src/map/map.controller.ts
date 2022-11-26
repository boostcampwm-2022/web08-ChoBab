import { Controller, Get, Query } from '@nestjs/common';
import { MapService } from '@map/map.service';
import { GetReverseGeocodeDto } from '@map/dto/get-reverse-geocode';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('/reversegeocode')
  async getReverseGeocode(@Query('lat') lat: number, @Query('lng') lng: number) {
    const roadAddr = await this.mapService.reverseGeocode(lat, lng);
    return { message: '성공적으로 주소를 변환했습니다.', data: { roadAddr } };
  }
}
