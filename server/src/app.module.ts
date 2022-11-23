import { Module } from '@nestjs/common';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomModule } from 'src/room/room.module';
import * as Joi from 'joi';

@Module({
  imports: [
    RestaurantModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        MONGODB_USERNAME: Joi.string().required(),
        MONGODB_PASSWORD: Joi.string().required(),
        MONGODB_DB_NAME: Joi.string().required(),
        KAKAO_API_KEY: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get('MONGODB_USERNAME')}:${configService.get(
          'MONGODB_PASSWORD'
        )}@chobab.opfwdho.mongodb.net/${configService.get(
          'MONGODB_DB_NAME'
        )}?retryWrites=true&w=majority`,
      }),
      inject: [ConfigService],
    }),
    RoomModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
