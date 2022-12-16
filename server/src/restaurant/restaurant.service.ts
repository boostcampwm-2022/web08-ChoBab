import { CustomException } from '@common/exceptions/custom.exception';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { isInKorea } from '@utils/location';
import {
  OriginRestaurantType,
  PreprocessedRestaurantType,
  RestaurantApiResultType,
} from '@restaurant/restaurant';
import { RESTAURANT_CATEGORY } from '@constants/restaurant';
import { MAX_RADIUS } from '@constants/location';
import { LOCATION_EXCEPTION } from '@response/location';
import { RESTAURANT_LIST_API_URL } from '@constants/api';
import { InjectModel } from '@nestjs/mongoose';
import { RestaurantCategory, RestaurantCategoryDocument } from '@restaurant/restaurant.schema';
import { Model } from 'mongoose';
import { getRandomNum, getRandomRating } from '@utils/random';

const restaurantListApiConfig = (
  lat: number,
  lng: number,
  radius: number,
  category: string,
  apiKey: string,
  page = 1
) => {
  return {
    headers: { Authorization: `KakaoAK ${apiKey}` },
    params: {
      query: category,
      y: lat,
      x: lng,
      category_group_code: 'FD6',
      radius: radius,
      page: page,
    },
  };
};

@Injectable()
export class RestaurantService {
  private readonly KAKAO_API_KEY: string;

  constructor(
    private configService: ConfigService,
    @InjectModel(RestaurantCategory.name)
    private restaurantCategoryModel: Model<RestaurantCategoryDocument>
  ) {
    this.KAKAO_API_KEY = this.configService.get('KAKAO_API_KEY');
  }

  private async getRestaurantUsingCategory(
    lat: number,
    lng: number,
    radius: number,
    category: string,
    apiKey: string
  ) {
    let restaurantList: OriginRestaurantType[] = [];
    const { data: apiResult } = await axios.get<RestaurantApiResultType>(
      RESTAURANT_LIST_API_URL,
      restaurantListApiConfig(lat, lng, radius, category, apiKey)
    );
    restaurantList = [...restaurantList, ...apiResult.documents];
    let isEnd = apiResult.meta.is_end;
    let page = 1;

    while (!isEnd) {
      page += 1;
      const { data: apiResult } = await axios.get<RestaurantApiResultType>(
        RESTAURANT_LIST_API_URL,
        restaurantListApiConfig(lat, lng, radius, category, apiKey, page)
      );
      restaurantList = [...restaurantList, ...apiResult.documents];

      isEnd = apiResult.meta.is_end;
    }
    return restaurantList;
  }

  private restaurantPreprocessing(originRestaurantList: OriginRestaurantType[]) {
    const preprocessingRestaurantList = originRestaurantList.map((restaurant) => {
      const {
        id,
        place_name: name,
        category_name: category,
        phone,
        y: lat,
        x: lng,
        road_address_name: address,
      } = restaurant;

      const categorySplitArr = category.split('>');

      const preprocessedRestaurant: PreprocessedRestaurantType = {
        id: id,
        name: name,
        category: categorySplitArr.length > 1 ? categorySplitArr[1].trim() : '',
        phone: phone || '',
        lat: Number.parseFloat(lat),
        lng: Number.parseFloat(lng),
        address: address,
      };
      return preprocessedRestaurant;
    });
    return preprocessingRestaurantList;
  }

  async getRestaurantList(lat: number, lng: number, radius: number) {
    if (!isInKorea(lat, lng)) {
      throw new CustomException(LOCATION_EXCEPTION.OUT_OF_KOREA);
    }

    if (radius > MAX_RADIUS) {
      throw new CustomException(LOCATION_EXCEPTION.OUT_OF_MAX_RADIUS);
    }

    const restaurantMap: { [index: string]: PreprocessedRestaurantType } = {};

    const restaurantApiResult = await Promise.all(
      RESTAURANT_CATEGORY.map((category) =>
        this.getRestaurantUsingCategory(lat, lng, radius, category, this.KAKAO_API_KEY)
      )
    );
    restaurantApiResult.forEach((restaurantList) => {
      this.restaurantPreprocessing(restaurantList).forEach((restaurant) => {
        restaurantMap[restaurant.id] = restaurant;
      });
    });

    return restaurantMap;
  }

  async getRestaurantDetail(id: string, category: string) {
    const randomRating = getRandomRating();
    try {
      const { photoUrl: photoUrlList } = (await this.restaurantCategoryModel.findOne({
        category,
      })) ?? { photoUrl: [] };

      const photoCnt = photoUrlList.length;
      const selectedPhotoUrlList: string[] = [];

      for (let idx = 0; idx < 3; idx++) {
        const randomIdx = getRandomNum(photoCnt - idx);
        selectedPhotoUrlList.push(photoUrlList.splice(randomIdx, 1)[0]);
        if (!photoUrlList.length) {
          break;
        }
      }

      return { id, rating: randomRating, photoUrlList: selectedPhotoUrlList };
    } catch (error) {
      console.log(error);
      // 단일 요청에 대한 에러 처리가 아닌, 모든 음식점에 대해 일괄적으로 상세정보를 불러오고
      // 만약 상세정보가 없을 시에도 에러를 반환하는 것이 아닌 값을 반환해주어야 함
      // 상세정보가 없는 것은 서비스 적으로 전혀 문제되는 상황이 아님.
      return { id, rating: randomRating, photoUrlList: [] as string[] };
    }
  }
}
