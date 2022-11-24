import { useEffect, useRef, useState } from 'react';
import { InitRoomPageLayout } from '@pages/InitRoomPage/styles';
import useCurrentLocation from '@hooks/useCurrentLocation';
import { NAVER_LAT, NAVER_LNG } from '@constants/map';

function InitRoomPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const location = useCurrentLocation();
  const [userLat, setUserLat] = useState<number>(NAVER_LAT);
  const [userLng, setUserLng] = useState<number>(NAVER_LNG);

  // 현재 위치 setting
  useEffect(() => {
    if (!location) return;

    setUserLat(location.lat);
    setUserLng(location.lng);
  }, [location]);

  // 현재 위치에 맞춰 지도 생성
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;

      const map = new naver.maps.Map(mapRef.current, {
        center: new naver.maps.LatLng(userLat, userLng),
        zoom: 14,
      });

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(userLat, userLng),
        map,
      });
    };

    initMap();
  }, [userLat, userLng]);

  return <InitRoomPageLayout ref={mapRef} />;
}

export default InitRoomPage;
