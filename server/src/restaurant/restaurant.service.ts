import { CustomException } from '@common/exceptions/custom.exception';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { isInKorea } from '@utils/location';
import { originRestaurantType, preprocessedRestaurantType } from './restaurant';
import { RESTAURANT_CATEGORY } from '@constants/restaurant';
import { MAX_RADIUS } from '@constants/location';

interface restaurantApiResultType {
  meta: {
    is_end: boolean;
    pageable_count: number;
    total_count: number;
  };
  documents: originRestaurantType[];
}

const restaurantApiUrl = (lat: number, lng: number, radius: number, category: string, page = 1) =>
  `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURI(
    category
  )}&y=${lat}&x=${lng}&category\_group\_code=FD6&radius=${radius}&page=${page}`;

@Injectable()
export class RestaurantService {
  apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('KAKAO_API_KEY');
  }

  private async getRestaurantUsingCategory(
    lat: number,
    lng: number,
    radius: number,
    category: string,
    apiKey: string
  ) {
    let restaurantList: originRestaurantType[] = [];
    const apiResult: restaurantApiResultType = (
      await axios.get(restaurantApiUrl(lat, lng, radius, category), {
        headers: { Authorization: `KakaoAK ${apiKey}` },
      })
    ).data;
    restaurantList = [...restaurantList, ...apiResult.documents];
    let isEnd = apiResult.meta.is_end;
    let page = 1;

    while (!isEnd) {
      page += 1;
      const apiResult: restaurantApiResultType = (
        await axios.get(restaurantApiUrl(lat, lng, radius, category, page), {
          headers: { Authorization: `KakaoAK ${apiKey}` },
        })
      ).data;
      restaurantList = [...restaurantList, ...apiResult.documents];

      isEnd = apiResult.meta.is_end;
    }
    return restaurantList;
  }

  private restaurantPreprocessing(originRestaurantList: originRestaurantType[]) {
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
      const preprocessedRestaurant: preprocessedRestaurantType = {
        id: id,
        name: name,
        category: category.split('>')[1].trim() || '',
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
      throw new CustomException('대한민국을 벗어난 입력입니다.');
    }

    if (radius > MAX_RADIUS) {
      throw new CustomException('최대 탐색 반경을 벗어난 입력입니다.');
    }

    const restaurantSet = new Set();

    const restaurantApiResult = await Promise.all(
      RESTAURANT_CATEGORY.map((category) =>
        this.getRestaurantUsingCategory(lat, lng, radius, category, this.apiKey)
      )
    );
    restaurantApiResult.forEach((restaurantList) => {
      this.restaurantPreprocessing(restaurantList).forEach((restaurant) => {
        restaurantSet.add(restaurant);
      });
    });

    return Array.from(restaurantSet) as preprocessedRestaurantType[];
  }
}
