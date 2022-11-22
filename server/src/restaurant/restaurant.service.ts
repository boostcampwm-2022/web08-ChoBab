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
  latitude: number,
  longitude: number,
  radius: number,
  category: string,
  page = 1
) =>
  `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURI(
    category
  )}&y=${latitude}&x=${longitude}&category\_group\_code=FD6&radius=${radius}&page=${page}`;

const locationBoundary = {
  latitude: {
    min: 33,
    max: 43,
  },
  longitude: {
    min: 124,
    max: 132,
  },
};

const isInKorea = (latitude: number, longitude: number) => {
  return (
    locationBoundary.latitude.min < latitude &&
    latitude < locationBoundary.latitude.max &&
    locationBoundary.longitude.min < longitude &&
    longitude < locationBoundary.longitude.max
  );
};

const maxRadius = 5000;

@Injectable()
export class RestaurantService {
  private async getRestaurantUsingCategory(
    latitude: number,
    longitude: number,
    radius: number,
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

  async getRestaurantList(latitude: number, longitude: number, radius: number, apiKey: string) {
    try {
      if (!isInKorea(latitude, longitude)) {
        throw new Error('대한민국을 벗어난 입력입니다.');
      }

      if (radius > maxRadius) {
        throw new Error('최대 탐색 반경을 벗어난 입력입니다.');
      }

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

      return {
        message: '음식점을 성공적으로 불러왔습니다.',
        data: Array.from(restaurantSet) as restaurant[],
      };
    } catch (e) {
      return {
        message: e.message,
        data: [] as restaurant[],
      };
    }
  }
}
