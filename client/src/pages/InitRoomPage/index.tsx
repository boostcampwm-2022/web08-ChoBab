import React, { useEffect, useRef, useState } from 'react';
import {
  FooterBox,
  InitRoomPageLayout,
  MapBox,
  MarkerBox,
  StartButton,
} from '@pages/InitRoomPage/styles';
import useCurrentLocation from '@hooks/useCurrentLocation';
import { ReactComponent as MarkerImage } from '@assets/images/marker.svg';
import { NAVER_ADDRESS } from '@constants/map';

function InitRoomPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const userLocation = useCurrentLocation();
  const [address, setAddress] = useState<string>(NAVER_ADDRESS);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    // 좌표 -> 주소 변환 & setAddress
    const reverseGeocode = (lat: number, lng: number) => {
      naver.maps.Service.reverseGeocode(
        {
          coords: new naver.maps.LatLng(lat, lng),
          orders: [naver.maps.Service.OrderType.ROAD_ADDR, naver.maps.Service.OrderType.ADDR].join(
            ','
          ),
        },
        // eslint-disable-next-line consistent-return
        (status, response) => {
          if (status !== naver.maps.Service.Status.OK) {
            alert('주소 변환 실패');
          }
          setAddress(response.v2.address.roadAddress || response.v2.address.jibunAddress);
        }
      );
    };

    // 현재 위치에 맞춰 지도 생성
    const createMap = (targetDiv: HTMLDivElement) => {
      const map = new naver.maps.Map(targetDiv, {
        center: new naver.maps.LatLng(userLocation.lat, userLocation.lng),
        zoom: 14,
      });

      return map;
    };

    // dragEnd 이벤트 핸들러 생성
    const onDragEnd = (map: naver.maps.Map): naver.maps.MapEventListener => {
      const dragEndListener = naver.maps.Event.addListener(map, 'dragend', async () => {
        const lng = map?.getCenter().x; // lng
        const lat = map?.getCenter().y; // lat
        console.log(lat, lng);
        naver.maps.Service.reverseGeocode(
          {
            coords: new naver.maps.LatLng(lat, lng),
            orders: [
              naver.maps.Service.OrderType.ROAD_ADDR,
              naver.maps.Service.OrderType.ADDR,
            ].join(','),
          },
          // eslint-disable-next-line consistent-return
          (status, response) => {
            console.log(response);
            if (status !== naver.maps.Service.Status.OK) {
              return alert('주소 변환 실패');
            }
            setAddress(response.v2.address.roadAddress || response.v2.address.jibunAddress);
          }
        );
      });

      return dragEndListener;
    };

    const map = createMap(mapRef.current);
    const dragEndListener = onDragEnd(map);

    // eslint-disable-next-line consistent-return
    return () => {
      naver.maps.Event.removeListener(dragEndListener);
    };
  }, [userLocation]);

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
