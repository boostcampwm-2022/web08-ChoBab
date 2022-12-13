import create from 'zustand';
import { RESTAURANT_LIST_TYPES, RESTAURANT_DETAIL_TYPES } from '@constants/modal';
import { CATEGORY_TYPE } from '@constants/category';

interface UserLocationStoreType {
  userLocation: LocationType | null;
  updateUserLocation: (location: LocationType | null) => void;
}

export const useUserLocationStore = create<UserLocationStoreType>((set) => ({
  userLocation: null,
  updateUserLocation: (location: LocationType | null) =>
    set((state) => ({ ...state, userLocation: location })),
}));

interface MeetLocationStoreType {
  meetLocation: LocationType | null;
  updateMeetLocation: (lat: number, lng: number) => void;
}

export const useMeetLocationStore = create<MeetLocationStoreType>((set) => ({
  meetLocation: null,
  updateMeetLocation: (lat, lng) => set(() => ({ meetLocation: { lat, lng } })),
}));

// 식당 목록 레이어(RestaurantListLayer)의 화면 상태를 관리하는 전역 저장소
interface RestaurantListLayerStatusStore {
  restaurantListLayerStatus: RESTAURANT_LIST_TYPES;
  updateRestaurantListLayerStatus: (restaurantListType: RESTAURANT_LIST_TYPES) => void;
}

export const useRestaurantListLayerStatusStore = create<RestaurantListLayerStatusStore>((set) => ({
  restaurantListLayerStatus: RESTAURANT_LIST_TYPES.hidden,
  updateRestaurantListLayerStatus: (restaurantListType: RESTAURANT_LIST_TYPES) =>
    set(() => ({ restaurantListLayerStatus: restaurantListType })),
}));

// 식당 상세정보 레이어(RestaurantDetailLayer)의 화면 상태를 관리하는 전역 저장소
interface RestaurantDetailLayerStatusStore {
  restaurantDetailLayerStatus: RESTAURANT_DETAIL_TYPES;
  updateRestaurantDetailLayerStatus: (restaurantDetailType: RESTAURANT_DETAIL_TYPES) => void;
}

export const useRestaurantDetailLayerStatusStore = create<RestaurantDetailLayerStatusStore>(
  (set) => ({
    restaurantDetailLayerStatus: RESTAURANT_DETAIL_TYPES.hidden,
    updateRestaurantDetailLayerStatus: (restaurantDetailType: RESTAURANT_DETAIL_TYPES) =>
      set(() => ({ restaurantDetailLayerStatus: restaurantDetailType })),
  })
);

// 선택된 식당 정보를 저장하는 전역 저장소
interface SelectedRestaurantDataStore {
  selectedRestaurantData: RestaurantType | null;
  updateSelectedRestaurantData: (restaurantType: RestaurantType | null) => void;
}

export const useSelectedRestaurantDataStore = create<SelectedRestaurantDataStore>((set) => ({
  selectedRestaurantData: null,
  updateSelectedRestaurantData: (restaurantType: RestaurantType | null) =>
    set(() => ({ selectedRestaurantData: restaurantType })),
}));

/**
 * 카테고리 선택정보를 저장하는 전역 저장소
 * selectedCategoryData 값이
 * 1) 비어있으면 : 전체선택을 의미
 * 2) 비어있지 않으면 : 저장된 CATEGORY_TYPE이 현재 선택된 카테고리 타입
 */
interface SelectedCategoryDataStore {
  selectedCategoryData: Set<CATEGORY_TYPE>;
  updateSelectedCategoryData: (categoryData: Set<CATEGORY_TYPE>) => void;
}

export const useSelectedCategoryStore = create<SelectedCategoryDataStore>((set) => ({
  selectedCategoryData: new Set(),
  updateSelectedCategoryData: (categoryData: Set<CATEGORY_TYPE>) =>
    set(() => ({ selectedCategoryData: categoryData })),
}));

interface ToastStoreType {
  isOpen: boolean;
  content: string;
  bottom: number; // 아래에서 몇 px 띄울건지 지정
  duration: number;
  updateIsOpen: (isOpen: boolean) => void;
  updateToast: (content: string, bottom?: number, duration?: number) => void;
}

export const useToastStore = create<ToastStoreType>((set) => ({
  isOpen: false,
  content: '',
  bottom: 100,
  duration: 2000,
  updateIsOpen: (isOpen) => set(() => ({ isOpen })),
  updateToast: (content, bottom, duration) => set(() => ({ content, bottom, duration })),
}));
