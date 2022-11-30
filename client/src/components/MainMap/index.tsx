import React, { useEffect, useRef } from 'react';

import RiceImage from '@assets/images/rice.svg';
import SushiImage from '@assets/images/sushi.svg';
import DumplingImage from '@assets/images/dumpling.svg';
import SpaghettiImage from '@assets/images/spaghetti.svg';
import ChickenImage from '@assets/images/chicken.svg';
import HamburgerImage from '@assets/images/hamburger.svg';
import HotdogImage from '@assets/images/hotdog.svg';

import { useNaverMaps } from '@hooks/useNaverMaps';

import { MapBox } from './styles';

interface RestaurantType {
  id: string;
  name: string;
  category: string;
  phone: string;
  lat: number;
  lng: number;
  address: string;
}

interface RoomLocationType {
  lat: number;
  lng: number;
}

interface PropsType {
  restaurantData: RestaurantType[];
  roomLocation: RoomLocationType;
}

function MainMap({ restaurantData, roomLocation }: PropsType) {
  const [mapRef, mapDivRef] = useNaverMaps(); // zoomlevel 16 props로
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const infoWindowsRef = useRef<naver.maps.InfoWindow[]>([]);

  const getIconUrlByCategory = (category: string) => {
    switch (category) {
      case '한식':
        return RiceImage;
      case '일식':
        return SushiImage;
      case '중식':
        return DumplingImage;
      case '양식':
        return SpaghettiImage;
      case '치킨':
        return ChickenImage;
      case '패스트푸드':
        return HamburgerImage;
      case '분식':
        return HotdogImage;
      default:
        return '';
    }
  };

  // 음식점 개수만큼 마커 생성
  const createMarkers = () => {
    if (!mapRef.current) {
      return;
    }

    const restaurantCnt = restaurantData.length;

    // forEach문으로 작성 시 mapRef.current쪽에서 타입 에러 발생
    for (let i = 0; i < restaurantCnt; i += 1) {
      const restaurant = restaurantData[i];

      const { name, category, lat, lng } = restaurant;
      const iconUrl = getIconUrlByCategory(category);

      const marker = new naver.maps.Marker({
        map: mapRef.current,
        title: name,
        position: new naver.maps.LatLng(lat, lng),
        icon: {
          content: `<img src=${iconUrl} width="30" height="30" alt=${name}/>`,
        },
      });
      markersRef.current.push(marker);
    }
  };

  // 음식점 개수만큼 정보창 생성
  const createInfoWindows = () => {
    restaurantData.forEach((restaurant) => {
      const { name } = restaurant;
      const infoWindow = new naver.maps.InfoWindow({
        content: name, // TODO: div로 이모티콘도 꾸며서 넣기
      });

      infoWindowsRef.current.push(infoWindow);
    });
  };

  // 마커 클릭 시 정보창 open/close 처리
  const handleMarkerClick = (idx: number) => {
    return () => {
      console.log(idx);
      const marker = markersRef.current[idx];
      const infoWindow = infoWindowsRef.current[idx];

      if (!mapRef.current) {
        return;
      }

      if (infoWindow.getMap()) {
        infoWindow.close();
      } else {
        infoWindow.open(mapRef.current, marker);
      }
    };
  };

  // 마커 최적화 로직
  function showMarker(map: naver.maps.Map, marker: naver.maps.Marker) {
    if (marker.getMap()) return;
    marker.setMap(map);
  }

  function hideMarker(map: naver.maps.Map, marker: naver.maps.Marker) {
    if (!marker.getMap()) return;
    marker.setMap(null);
  }

  // 최적화 - 현재 화면에 마커가 보이는지에 따라 show/hide
  const updateMarkers = (map: naver.maps.Map, markers: naver.maps.Marker[]) => {
    if (!map) {
      return;
    }
    // any 사용 이유: naver.maps.Bounds에 hasLatLng type이 등록되어있지 않아 TS 에러 발생
    const mapBounds: any = map.getBounds();

    markers.forEach((marker) => {
      const position = marker.getPosition();

      if (mapBounds.hasLatLng(position)) {
        showMarker(map, marker);
      } else {
        hideMarker(map, marker);
      }
    });
  };

  // idle 이벤트 핸들러 생성
  const onIdle = (map: naver.maps.Map): naver.maps.MapEventListener => {
    const onIdleListener = naver.maps.Event.addListener(map, 'idle', () => {
      if (!map) {
        return;
      }

      updateMarkers(map, markersRef.current);
    });

    return onIdleListener;
  };

  const initMap = () => {
    if (!mapRef.current || !roomLocation) {
      return;
    }
    createMarkers();
    createInfoWindows();

    // marker 클릭 이벤트 등록
    markersRef.current.forEach((marker, idx) => {
      naver.maps.Event.addListener(marker, 'click', handleMarkerClick(idx));
    });
  };

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const idleListener = onIdle(mapRef.current);
    initMap();

    // eslint-disable-next-line consistent-return
    return () => {
      naver.maps.Event.removeListener(idleListener);
    };
  }, []);

  // 모임 위치(props) 변경 시 지도 화면 이동
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    mapRef.current.setCenter({ x: roomLocation.lng, y: roomLocation.lat });
  }, [roomLocation]);

  return <MapBox ref={mapDivRef} />;
}

export default MainMap;
