import { CustomException } from '@common/exceptions/custom.exception';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { isInKorea } from '@utils/location';
import {
  OriginRestaurantType,
  PreprocessedRestaurantType,
  RestaurantApiResultType,
  RestaurantDetailResponseType,
} from './restaurant';
import { RESTAURANT_CATEGORY, RESTAURANT_DETAIL_FIELD } from '@constants/restaurant';
import { MAX_RADIUS, MAX_DETAIL_SEARCH_RADIUS } from '@constants/location';
import { LOCATION_EXCEPTION } from '@response/location';
import { RESTAURANT_EXCEPTION } from '@common/response/restaurant';
import { RESTAURANT_DETAIL_API_URL, RESTAURANT_LIST_API_URL } from '@constants/api';

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

const restaurantDetailApiConfig = (
  name: string,
  address: string,
  lat: number,
  lng: number,
  apiKey: string
) => {
  return {
    params: {
      input: address + ' ' + name,
      inputtype: 'textquery',
      locationrestriction: `circle:${MAX_DETAIL_SEARCH_RADIUS}@${lat},${lng}`,
      fields: RESTAURANT_DETAIL_FIELD.join(','),
      key: apiKey,
    },
  };
};

@Injectable()
export class RestaurantService {
  private readonly kakaoApiKey: string;
  private readonly googleApiKey: string;

  constructor(private configService: ConfigService) {
    this.kakaoApiKey = this.configService.get('KAKAO_API_KEY');
    this.googleApiKey = this.configService.get('GOOGLE_API_KEY');
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
      const preprocessedRestaurant: PreprocessedRestaurantType = {
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
      throw new CustomException(LOCATION_EXCEPTION.OUT_OF_KOREA);
    }

    if (radius > MAX_RADIUS) {
      throw new CustomException(LOCATION_EXCEPTION.OUT_OF_MAX_RADIUS);
    }

    const restaurantSet = new Set();

    const restaurantApiResult = await Promise.all(
      RESTAURANT_CATEGORY.map((category) =>
        this.getRestaurantUsingCategory(lat, lng, radius, category, this.kakaoApiKey)
      )
    );
    restaurantApiResult.forEach((restaurantList) => {
      this.restaurantPreprocessing(restaurantList).forEach((restaurant) => {
        restaurantSet.add(restaurant);
      });
    });

    return Array.from(restaurantSet) as PreprocessedRestaurantType[];
  }

  async getRestaurantDetail(
    restaurantId: string,
    address: string,
    name: string,
    lat: number,
    lng: number
  ) {
    try {
      const {
        request,
        data: { candidates },
      } = await axios.get<RestaurantDetailResponseType>(
        RESTAURANT_DETAIL_API_URL,
        restaurantDetailApiConfig(name, address, lat, lng, this.googleApiKey)
      );
      const result = candidates[0];
      if (!result) {
        throw new Error();
      }
      const {
        rating,
        photos, // 이 후 이미지 API 를 위해 일단 놔둠
        opening_hours: { open_now: openNow },
        price_level: priceLevel,
      } = result;

      return { rating, openNow, priceLevel };
    } catch (error) {
      throw new CustomException(RESTAURANT_EXCEPTION.FAIL_SEARCH_RESTAURANT_DETAIL);
    }
  }
}
