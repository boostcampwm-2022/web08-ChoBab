import { useEffect, useRef } from 'react';
import { InitRoomPageLayout } from '@pages/InitRoomPage/styles';

function InitRoomPage() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;

      const map = new naver.maps.Map(mapRef.current, {
        // TODO: 지도 시작 좌표를 추후 사용자 위치로 변경
        center: new naver.maps.LatLng(37.5, 127.039573),
        zoom: 14,
      });

      const marker = new naver.maps.Marker({
        // TODO: 마커 좌표를 추후 사용자 위치로 변경
        position: new naver.maps.LatLng(37.5, 127.039573),
        map,
      });
    };

    initMap();
  }, []);

  return <InitRoomPageLayout id="map" ref={mapRef} />;
}

export default InitRoomPage;
