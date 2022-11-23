export interface originRestaurant {
  id: string;
  road_address_name: string;
  category_name: string;
  phone: string;
  place_name: string;
  x: string;
  y: string;
}

export interface preprocessedRestaurant {
  id: string;
  name: string;
  category: string;
  phone: string;
  lat: string;
  lng: string;
  address: string;
}
