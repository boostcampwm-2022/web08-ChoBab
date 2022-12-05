import create from 'zustand';
import { RESTAURANT_LIST_TYPES, RESTAURANT_DETAIL_TYPES } from '@constants/modal';
import { NAVER_LAT, NAVER_LNG } from '@constants/map';

interface MeetLocationStoreType {
  meetLocation: { lat: number; lng: number };
  updateMeetLocation: (lat: number, lng: number) => void;
}

export const useMeetLocationStore = create<MeetLocationStoreType>((set) => ({
  meetLocation: { lat: NAVER_LAT, lng: NAVER_LNG },
  updateMeetLocation: (lat, lng) => set(() => ({ meetLocation: { lat, lng } })),
}));

interface RestaurantListStateStore {
  restaurantListState: RESTAURANT_LIST_TYPES;
  updateRestaurantListState: (fullScreenModalType: RESTAURANT_LIST_TYPES) => void;
}

export const useRestaurantListStateStore = create<RestaurantListStateStore>((set) => ({
  restaurantListState: RESTAURANT_LIST_TYPES.hidden,
  updateRestaurantListState: (restaurantListType: RESTAURANT_LIST_TYPES) =>
    set(() => ({ restaurantListState: restaurantListType })),
}));

interface RestaurantDetailStateStore {
  restaurantDetailState: RESTAURANT_DETAIL_TYPES;
  updateRestaurantDetailState: (fullScreenModalType: RESTAURANT_DETAIL_TYPES) => void;
}

export const useRestaurantDetailStateStore = create<RestaurantDetailStateStore>((set) => ({
  restaurantDetailState: RESTAURANT_DETAIL_TYPES.hidden,
  updateRestaurantDetailState: (restaurantDetailType: RESTAURANT_DETAIL_TYPES) =>
    set(() => ({ restaurantDetailState: restaurantDetailType })),
}));
