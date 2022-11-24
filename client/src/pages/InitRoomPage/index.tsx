import React, { useEffect, useRef } from 'react';
import { InitRoomPageLayout, MarkerBox } from '@pages/InitRoomPage/styles';
import useCurrentLocation from '@hooks/useCurrentLocation';
import { ReactComponent as MarkerImage } from '@assets/images/marker.svg';

function InitRoomPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const location = useCurrentLocation();

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    // 현재 위치에 맞춰 지도 생성
    const createMap = (targetDiv: HTMLDivElement) => {
      const map = new naver.maps.Map(targetDiv, {
        center: new naver.maps.LatLng(location.lat, location.lng),
        zoom: 14,
      });

      return map;
    };

    // dragEnd 이벤트 핸들러 생성
    const onDragEnd = (map: naver.maps.Map): naver.maps.MapEventListener => {
      const dragEndListener = naver.maps.Event.addListener(map, 'dragend', () => {
        console.log(map?.getCenter().x); // lng
        console.log(map?.getCenter().y); // lat
      });

      return dragEndListener;
    };

    const map = createMap(mapRef.current);
    const dragEndListener = onDragEnd(map);

    // eslint-disable-next-line consistent-return
    return () => {
      naver.maps.Event.removeListener(dragEndListener);
    };
  }, [location]);

  return (
    <InitRoomPageLayout ref={mapRef}>
      <MarkerBox>
        <MarkerImage />
      </MarkerBox>
    </InitRoomPageLayout>
  );
}

export default InitRoomPage;
