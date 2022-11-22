import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { restaurant } from './restaurant';

interface restaurantApiResult {
  meta: {
    is_end: boolean;
    pageable_count: number;
    total_count: number;
  };
  documents: restaurant[];
}

const restaurantCategory = Object.freeze([
  '한식',
  '일식',
  '중식',
  '양식',
  '패스트푸드',
  '치킨',
  '분식',
]);

const restaurantApiUrl = (
  latitude: string,
  longitude: string,
  radius: string,
  category: string,
  page = 1
) =>
  `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURI(
    category
  )}&y=${latitude}&x=${longitude}&category\_group\_code=FD6&radius=${radius}&page=${page}`;

@Injectable()
export class RestaurantService {
  private async getRestaurantUsingCategory(
    latitude: string,
    longitude: string,
    radius: string,
    category: string,
    apiKey: string
  ) {
    let restaurantList: restaurant[] = [];
    const apiResult: restaurantApiResult = (
      await axios.get(restaurantApiUrl(latitude, longitude, radius, category), {
        headers: { Authorization: `KakaoAK ${apiKey}` },
      })
    ).data;
    restaurantList = [...restaurantList, ...apiResult.documents];
    let isEnd = apiResult.meta.is_end;
    let page = 1;

    while (!isEnd) {
      page += 1;
      const apiResult: restaurantApiResult = (
        await axios.get(restaurantApiUrl(latitude, longitude, radius, category, page), {
          headers: { Authorization: `KakaoAK ${apiKey}` },
        })
      ).data;
      restaurantList = [...restaurantList, ...apiResult.documents];

      isEnd = apiResult.meta.is_end;
    }
    return restaurantList;
  }
  private restaurantPreprocessing(originRestaurantList: restaurant[]) {
    const preprocessingRestaurantList = originRestaurantList.map((restaurant) => {
      const preprocessedRestaurant = {
        id: restaurant.id,
        name: restaurant.place_name,
        category: restaurant.category_name.split('>')[1].trim() || '',
        phone: restaurant.phone || '',
        latitude: restaurant.y,
        longitude: restaurant.x,
        address: restaurant.road_address_name,
      };
      return preprocessedRestaurant;
    });
    return preprocessingRestaurantList;
  }

  async getRestaurantList(latitude: string, longitude: string, radius: string, apiKey: string) {
    try {
      const restaurantSet = new Set();
      /**
       * 순서를 보장을 위한 await 사용을 위해 for of 를 사용했는데, 해당 구문을 Promise.all 로 수정하면 속도 차이가 많이 날까요??
       * 현재 저희 학교 앞 2km 반경 음식점 300여개 불러오는데 3초 소요
       * Promise.all 로 수정 결과 동일 데이터 불러오는데 1초 소요
       */
      const restaurantApiResult = await Promise.all(
        restaurantCategory.map((category) =>
          this.getRestaurantUsingCategory(latitude, longitude, radius, category, apiKey)
        )
      );
      restaurantApiResult.forEach((restaurantList) => {
        this.restaurantPreprocessing(restaurantList).forEach((restaurant) => {
          restaurantSet.add(restaurant);
        });
      });

      return Array.from(restaurantSet) as restaurant[];
    } catch (e) {
      return [];
    }
  }
}
