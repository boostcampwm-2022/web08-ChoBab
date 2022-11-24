import { useEffect, useRef, useState } from 'react';
import { InitRoomPageLayout } from '@pages/InitRoomPage/styles';
import useCurrentLocation from '@hooks/useCurrentLocation';

function InitRoomPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const location = useCurrentLocation();

  // 현재 위치에 맞춰 지도 생성
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) {
        return;
      }

      const map = new naver.maps.Map(mapRef.current, {
        center: new naver.maps.LatLng(location.lat, location.lng),
        zoom: 14,
      });

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(location.lat, location.lng),
        map,
      });
    };

    initMap();
  }, [location]);

  return <InitRoomPageLayout ref={mapRef} />;
}

export default InitRoomPage;
