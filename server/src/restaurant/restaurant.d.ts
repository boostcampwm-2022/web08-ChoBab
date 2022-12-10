export interface OriginRestaurantType {
  id: string;
  road_address_name: string;
  category_name: string;
  phone: string;
  place_name: string;
  x: string;
  y: string;
}

export interface PreprocessedRestaurantType {
  id: string;
  name: string;
  category: string;
  phone: string;
  lat: number;
  lng: number;
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

export interface RestaurantDetailType {
  rating?: number;
  photos?: { photo_reference?: string }[];
  price_level?: number;
}

export interface RestaurantDetailResponseType {
  candidates: RestaurantDetailType[];
  status: string;
}

export interface CandidateType {
  restaurantId: string;
  usersSessionId: string[];
}
