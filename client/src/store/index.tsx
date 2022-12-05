import create from 'zustand';
import { NAVER_LAT, NAVER_LNG } from '@constants/map';
import { PAGES_TYPES } from '@constants/page';

interface MeetLocationStoreType {
  meetLocation: { lat: number; lng: number };
  updateMeetLocation: (lat: number, lng: number) => void;
}

export const useMeetLocationStore = create<MeetLocationStoreType>((set) => ({
  meetLocation: { lat: NAVER_LAT, lng: NAVER_LNG },
  updateMeetLocation: (lat, lng) => set(() => ({ meetLocation: { lat, lng } })),
}));

interface PageStateStoreType {
  pageState: PAGES_TYPES;
  updatePageState: (pageType: PAGES_TYPES) => void;
}

export const usePageStateStore = create<PageStateStoreType>((set) => ({
  pageState: PAGES_TYPES.hidden,
  updatePageState: (pageType: PAGES_TYPES) => set(() => ({ pageState: pageType })),
}));
