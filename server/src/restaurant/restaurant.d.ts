export interface originRestaurantType {
  id: string;
  road_address_name: string;
  category_name: string;
  phone: string;
  place_name: string;
  x: string;
  y: string;
}

export interface preprocessedRestaurantType {
  id: string;
  name: string;
  category: string;
  phone: string;
  lat: number;
  lng: number;
  address: string;
}
