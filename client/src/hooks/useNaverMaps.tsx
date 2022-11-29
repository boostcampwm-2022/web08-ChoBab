import { MutableRefObject, RefObject, useEffect, useRef } from 'react';
import { NAVER_LAT, NAVER_LNG } from '@constants/map';

// mutable ref object 와 ref object 의 차이는 뭐지?
export const useNaverMaps = (): [
  MutableRefObject<naver.maps.Map | null>,
  RefObject<HTMLDivElement>
] => {
  const mapRef = useRef<naver.maps.Map | null>(null);
  const mapDivRef = useRef<HTMLDivElement>(null); // type 에 null 포함시키면 사용이 불가,,

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
