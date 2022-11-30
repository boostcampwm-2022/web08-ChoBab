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

const restaurantListApiUrl = (
  lat: number,
  lng: number,
  radius: number,
  category: string,
  page = 1
) =>
  `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURI(
    category
  )}&y=${lat}&x=${lng}&category\_group\_code=FD6&radius=${radius}&page=${page}`;

const restaurantDetailApiUrl = (
  id: string,
  name: string,
  address: string,
  apiKey: string,
  lat: number,
  lng: number
) =>
  `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURI(
    address + ' ' + name
  )}&inputtype=textquery&locationrestriction=circle%3A${MAX_DETAIL_SEARCH_RADIUS}%40${lat}%2C${lng}&fields=${RESTAURANT_DETAIL_FIELD.join(
    '%2C'
  )}&key=${apiKey}`;

@Injectable()
export class RestaurantService {
  kakaoApiKey: string;
  googleApiKey: string;

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
    const apiResult: RestaurantApiResultType = (
      await axios.get(restaurantListApiUrl(lat, lng, radius, category), {
        headers: { Authorization: `KakaoAK ${apiKey}` },
      })
    ).data;
    restaurantList = [...restaurantList, ...apiResult.documents];
    let isEnd = apiResult.meta.is_end;
    let page = 1;

    while (!isEnd) {
      page += 1;
      const apiResult: RestaurantApiResultType = (
        await axios.get(restaurantListApiUrl(lat, lng, radius, category, page), {
          headers: { Authorization: `KakaoAK ${apiKey}` },
        })
      ).data;
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
        data: { candidates },
      } = await axios.get<RestaurantDetailResponseType>(
        restaurantDetailApiUrl(restaurantId, name, address, this.googleApiKey, lat, lng)
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
