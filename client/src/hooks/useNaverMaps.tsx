import { MutableRefObject, RefObject, useEffect, useRef } from 'react';
import { NAVER_LAT, NAVER_LNG } from '@constants/map';

export const useNaverMaps = (): [
  MutableRefObject<naver.maps.Map | null>,
  RefObject<HTMLDivElement>
] => {
  const mapRef = useRef<naver.maps.Map | null>(null);
  const mapDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapDivRef.current) {
      return;
    }

    mapRef.current = new naver.maps.Map(mapDivRef.current, {
      center: new naver.maps.LatLng(NAVER_LAT, NAVER_LNG),
      zoom: 16,
      // 7로 잡아도 대한민국 전역을 커버 가능
      minZoom:7,
    });
  }, []);

  return [mapRef, mapDivRef];
};
