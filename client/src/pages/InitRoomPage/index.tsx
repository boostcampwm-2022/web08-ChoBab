import React, { useEffect, useRef, useState } from 'react';
import {
  InitRoomPageLayout,
  MarkerBox,
  MapBox,
  FooterBox,
  StartButton,
} from '@pages/InitRoomPage/styles';
import useCurrentLocation from '@hooks/useCurrentLocation';
import { ReactComponent as MarkerImage } from '@assets/images/marker.svg';

function InitRoomPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const location = useCurrentLocation();
  const [address, setAddress] = useState<string>('주소 초기값');

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
        // TODO: 수정 필요한 부분
        setAddress('주소 설정');
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
    <InitRoomPageLayout>
      <MapBox ref={mapRef}>
        <MarkerBox>
          <MarkerImage />
        </MarkerBox>
      </MapBox>
      <FooterBox>
        <span>
          <p>모임 위치를 정해주세요!</p>
          <p>(추후 수정 가능합니다.)</p>
        </span>
        <div>검색창 영역</div>
        <div>{address}</div>
        <StartButton title="시작하기">시작하기</StartButton>
      </FooterBox>
    </InitRoomPageLayout>
  );
}

export default InitRoomPage;
