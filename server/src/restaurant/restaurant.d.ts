export type RestaurantIdType = string;

export interface OriginRestaurantType {
  id: RestaurantIdType;
  road_address_name: string;
  category_name: string;
  phone: string;
  place_name: string;
  place_url: string;
  x: string;
  y: string;
}

export interface PreprocessedRestaurantType {
  id: RestaurantIdType;
  name: string;
  category: string;
  phone: string;
  lat: number;
  lng: number;
  url: string;
  address: string;
}

// 기본 음식점 데이터와 상세 정보를 취합한 데이터 타입
export interface MergedRestaurantType extends PreprocessedRestaurantType {
  rating?: number;
  photoUrlList?: string[];
}

export interface RestaurantApiResultType {
  meta: {
    is_end: boolean;
    pageable_count: number;
    total_count: number;
  };
  documents: OriginRestaurantType[];
}

export interface CandidateHashType {
  [index: RestaurantIdType]: UserIdType[];
}
