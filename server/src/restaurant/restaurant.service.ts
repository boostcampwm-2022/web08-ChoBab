import { CustomException } from '@common/exceptions/custom.exception';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { originRestaurant, preprocessedRestaurant } from './restaurant';
import { restaurantCategory, locationBoundary, maxRadius } from './retaurant.constants';

interface restaurantApiResult {
  meta: {
    is_end: boolean;
    pageable_count: number;
    total_count: number;
  };
  documents: originRestaurant[];
}

const restaurantApiUrl = (lat: number, lng: number, radius: number, category: string, page = 1) =>
  `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURI(
    category
  )}&y=${lat}&x=${lng}&category\_group\_code=FD6&radius=${radius}&page=${page}`;

const isInKorea = (lat: number, lng: number) => {
  return (
    locationBoundary.lat.min < lat &&
    lat < locationBoundary.lat.max &&
    locationBoundary.lng.min < lng &&
    lng < locationBoundary.lng.max
  );
};

@Injectable()
export class RestaurantService {
  private async getRestaurantUsingCategory(
    lat: number,
    lng: number,
    radius: number,
    category: string,
    apiKey: string
  ) {
    let restaurantList: originRestaurant[] = [];
    const apiResult: restaurantApiResult = (
      await axios.get(restaurantApiUrl(lat, lng, radius, category), {
        headers: { Authorization: `KakaoAK ${apiKey}` },
      })
    ).data;
    restaurantList = [...restaurantList, ...apiResult.documents];
    let isEnd = apiResult.meta.is_end;
    let page = 1;

    while (!isEnd) {
      page += 1;
      const apiResult: restaurantApiResult = (
        await axios.get(restaurantApiUrl(lat, lng, radius, category, page), {
          headers: { Authorization: `KakaoAK ${apiKey}` },
        })
      ).data;
      restaurantList = [...restaurantList, ...apiResult.documents];

      isEnd = apiResult.meta.is_end;
    }
    return restaurantList;
  }
  private restaurantPreprocessing(originRestaurantList: originRestaurant[]) {
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
      const preprocessedRestaurant: preprocessedRestaurant = {
        id: id,
        name: name,
        category: category.split('>')[1].trim() || '',
        phone: phone || '',
        lat: lat,
        lng: lng,
        address: address,
      };
      return preprocessedRestaurant;
    });
    return preprocessingRestaurantList;
  }

  async getRestaurantList(lat: number, lng: number, radius: number, apiKey: string) {
    if (!isInKorea(lat, lng)) {
      throw new CustomException('대한민국을 벗어난 입력입니다.');
    }

    if (radius > maxRadius) {
      throw new CustomException('최대 탐색 반경을 벗어난 입력입니다.');
    }

    const restaurantSet = new Set();
    /**
     * 순서를 보장을 위한 await 사용을 위해 for of 를 사용했는데, 해당 구문을 Promise.all 로 수정하면 속도 차이가 많이 날까요??
     * 현재 저희 학교 앞 2km 반경 음식점 300여개 불러오는데 3초 소요
     * Promise.all 로 수정 결과 동일 데이터 불러오는데 1초 소요
     */
    const restaurantApiResult = await Promise.all(
      restaurantCategory.map((category) =>
        this.getRestaurantUsingCategory(lat, lng, radius, category, apiKey)
      )
    );
    restaurantApiResult.forEach((restaurantList) => {
      this.restaurantPreprocessing(restaurantList).forEach((restaurant) => {
        restaurantSet.add(restaurant);
      });
    });

    return {
      message: '음식점을 성공적으로 불러왔습니다.',
      data: Array.from(restaurantSet) as preprocessedRestaurant[],
    };
  }
}
