import { Controller, Get, Query } from '@nestjs/common';
import { GetDrivingQueryDto } from '@map/dto/get-driving-query-dto';
import { MapService } from '@map/map.service';
import { MAP_RES } from '@response/map';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('driving')
  async getDrivingInfo(@Query() getDrivingQuery: GetDrivingQueryDto) {
    const drivingInfo = await this.mapService.drivingInfo(
      getDrivingQuery.start,
      getDrivingQuery.goal
    );

    return MAP_RES.SUCCESS_GET_DRIVING_INFO(drivingInfo);
  }
}
