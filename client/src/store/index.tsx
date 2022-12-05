import create from 'zustand';
import { NAVER_LAT, NAVER_LNG } from '@constants/map';

interface MeetLocationStoreType {
  meetLocation: { lat: number; lng: number };
  updateMeetLocation: (lat: number, lng: number) => void;
}

export const useMeetLocationStore = create<MeetLocationStoreType>((set) => ({
  meetLocation: { lat: NAVER_LAT, lng: NAVER_LNG },
  updateMeetLocation: (lat, lng) => set(() => ({ meetLocation: { lat, lng } })),
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
