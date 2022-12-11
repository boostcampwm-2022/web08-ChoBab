import { Module } from '@nestjs/common';
import { MapController } from '@map/map.controller';
import { MapService } from '@map/map.service';

@Module({
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
