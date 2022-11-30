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
      zoom: 14,
    });
  }, []);

  return [mapRef, mapDivRef];
};
