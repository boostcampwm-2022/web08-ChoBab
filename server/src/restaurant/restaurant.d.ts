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
  photos?: { photo_reference: string }[];
  opening_hours?: {
    open_now?: boolean;
  };
  price_level?: number;
}

export interface RestaurantDetailResponseType {
  candidates: RestaurantDetail[];
  status: string;
}
