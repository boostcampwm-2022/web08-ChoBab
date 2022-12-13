import { MutableRefObject, RefObject, useEffect, useRef } from 'react';
import { MAIN_MAPS_MIN_ZOOM_LEVEL, NAVER_LAT, NAVER_LNG, DEFAULT_ZOOM } from '@constants/map';

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
      zoom: DEFAULT_ZOOM,
      // 7로 잡아도 대한민국 전역을 커버 가능
      minZoom: MAIN_MAPS_MIN_ZOOM_LEVEL,
    });
  }, []);

  return [mapRef, mapDivRef];
};
