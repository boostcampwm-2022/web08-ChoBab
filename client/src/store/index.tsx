import create from 'zustand';
import { NAVER_LAT, NAVER_LNG } from '@constants/map';
import { FULL_SCREEN_MODAL_TYPES } from '@constants/modal';

interface MeetLocationStoreType {
  meetLocation: { lat: number; lng: number };
  updateMeetLocation: (lat: number, lng: number) => void;
}

export const useMeetLocationStore = create<MeetLocationStoreType>((set) => ({
  meetLocation: { lat: NAVER_LAT, lng: NAVER_LNG },
  updateMeetLocation: (lat, lng) => set(() => ({ meetLocation: { lat, lng } })),
}));

interface FullScreenModalStateStore {
  fullScreenModalState: FULL_SCREEN_MODAL_TYPES;
  updatefullScreenModalState: (fullScreenModalType: FULL_SCREEN_MODAL_TYPES) => void;
}

export const useFullScreenModalStateStore = create<FullScreenModalStateStore>((set) => ({
  fullScreenModalState: FULL_SCREEN_MODAL_TYPES.hidden,
  updatefullScreenModalState: (fullScreenModalType: FULL_SCREEN_MODAL_TYPES) =>
    set(() => ({ fullScreenModalState: fullScreenModalType })),
}));
