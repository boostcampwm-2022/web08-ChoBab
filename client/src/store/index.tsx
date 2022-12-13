import create from 'zustand';
import { RESTAURANT_LIST_TYPES, RESTAURANT_DETAIL_TYPES } from '@constants/modal';
import { CATEGORY_TYPE } from '@constants/category';

/**
 * <유저의 현재 위치정보를 관리하는 저장소>
 */
interface UserLocationStoreType {
  userLocation: LocationType | null;
  updateUserLocation: (location: LocationType | null) => void;
}

export const useUserLocationStore = create<UserLocationStoreType>((set) => ({
  userLocation: null,
  updateUserLocation: (location: LocationType | null) =>
    set((state) => ({ ...state, userLocation: location })),
}));

/**
 * <방의 모임 장소 위치를 관리하는 저장소>
 */
interface MeetLocationStoreType {
  meetLocation: LocationType | null;
  updateMeetLocation: (location: LocationType | null) => void;
}

export const useMeetLocationStore = create<MeetLocationStoreType>((set) => ({
  meetLocation: null,
  updateMeetLocation: (location: LocationType | null) => set(() => ({ meetLocation: location })),
}));

/**
 * <식당 목록 레이어(RestaurantListLayer)의 화면 상태를 관리하는 저장소>
 */
interface RestaurantListLayerStatusStore {
  restaurantListLayerStatus: RESTAURANT_LIST_TYPES;
  updateRestaurantListLayerStatus: (restaurantListType: RESTAURANT_LIST_TYPES) => void;
}

export const useRestaurantListLayerStatusStore = create<RestaurantListLayerStatusStore>((set) => ({
  restaurantListLayerStatus: RESTAURANT_LIST_TYPES.hidden,
  updateRestaurantListLayerStatus: (restaurantListType: RESTAURANT_LIST_TYPES) =>
    set(() => ({ restaurantListLayerStatus: restaurantListType })),
}));

/**
 * <식당 상세정보 레이어(RestaurantDetailLayer)의 화면 상태를 관리하는 저장소>
 */
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

/**
 * <선택된 식당 정보를 저장하는 저장소>
 */
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
 * <선택된 식당 요약정보를 저장하는 저장소>
 * 상세정보 페이지에서 사용되는 SelectedRestaurantDataStore
 * 를 마커 클릭 시 나오는 미리보기 화면에서도
 * 함께 사용할 경우 생기는 문제를 해결하기 위해 만든 저장소입니다.
 */
interface SelectedRestaurantPreviewDataStore {
  selectedRestaurantPreviewData: RestaurantType | null;
  updateSelectedRestaurantPreviewData: (restaurantType: RestaurantType | null) => void;
}

export const useSelectedRestaurantPreviewDataStore = create<SelectedRestaurantPreviewDataStore>(
  (set) => ({
    selectedRestaurantPreviewData: null,
    updateSelectedRestaurantPreviewData: (restaurantType: RestaurantType | null) =>
      set(() => ({ selectedRestaurantPreviewData: restaurantType })),
  })
);

/**
 * <카테고리 선택정보를 저장하는 전역 저장소>
 * Set이 비어있으면 전체선택을 의미하고,
 * 비어있지 않으면 들어있는 값은 필터링 할 카테고리들을 의미한다.
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

/**
 * <Toast 알림 모달의 상태를 관리하는 저장소>
 * bottom: 아래에서 몇 px 띄울건지 지정
 */
interface ToastStoreType {
  isOpen: boolean;
  content: string;
  bottom: number;
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

/**
 * <지도 Ref의 값을 공유하는 저장소>
 */
interface MapStoreType {
  map: naver.maps.Map | null;
  updateMap: (map: naver.maps.Map | null) => void;
}

export const useMapStore = create<MapStoreType>((set) => ({
  map: null,
  updateMap: (map: naver.maps.Map | null) => set(() => ({ map })),
}));
