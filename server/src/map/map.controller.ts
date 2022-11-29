import { Controller, Get, Query } from '@nestjs/common';
import { GetDrivingQueryDto } from '@map/dto/get-driving-query-dto';
import { MapService } from '@map/map.service';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('driving')
  getDrivingInfo(@Query() getDrivingQuery: GetDrivingQueryDto) {
    this.mapService.validStartAndGoalData(getDrivingQuery.start, getDrivingQuery.goal);

    return {};
  }
}
