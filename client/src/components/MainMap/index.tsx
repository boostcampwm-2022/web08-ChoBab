import { useEffect, useRef, useState } from 'react';

// src 를 가져오고 있으니 PascalCase 에서 camelCase 로 변경하고 뒤에 Src 붙였으면 함.
import RiceImage from '@assets/images/rice.svg';
import SushiImage from '@assets/images/sushi.svg';
import DumplingImage from '@assets/images/dumpling.svg';
import SpaghettiImage from '@assets/images/spaghetti.svg';
import ChickenImage from '@assets/images/chicken.svg';
import HamburgerImage from '@assets/images/hamburger.svg';
import HotdogImage from '@assets/images/hotdog.svg';
import { ReactComponent as LoadingSpinner } from '@assets/images/loading-spinner.svg';
import UserImage from '@assets/images/user.svg';

import stc from 'string-to-color';

import { useNaverMaps } from '@hooks/useNaverMaps';

import classes from '@styles/marker.module.css';

import '@utils/MarkerClustering.js';

import { MapLayout, MapLoadingBox, MapBox } from './styles';

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
  joinList: Map<string, UserType>;
}

const getIconUrlByCategory = (category: string) => {
  switch (category) {
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
    case '한식':
    default:
      return RiceImage;
  }
};

type userIdType = string;

function MainMap({ restaurantData, roomLocation, joinList }: PropsType) {
  const [mapRef, mapDivRef] = useNaverMaps();

  const joinListMarkerRef = useRef<Map<userIdType, naver.maps.Marker>>(new Map());
  const joinListInfoWindowRef = useRef<Map<userIdType, naver.maps.InfoWindow>>(new Map());

  const [loading, setLoading] = useState<boolean>(false);

  const infoWindowsRef = useRef<naver.maps.InfoWindow[]>([]);

  const closeAllMarkerInfoWindow = () => {
    infoWindowsRef.current.forEach((infoWindow) => {
      infoWindow.close();
    });
  };

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    // 퇴장한 사용자 마커 갱신
    joinListMarkerRef.current.forEach((marker, userId, thisMap) => {
      if (joinList.has(userId)) {
        return;
      }

      marker.setMap(null);

      thisMap.delete(userId);
    });

    joinListInfoWindowRef.current.forEach((infoWindow, userId, thisMap) => {
      if (joinList.has(userId)) {
        return;
      }

      infoWindow.setMap(null);

      thisMap.delete(userId);
    });

    // 입장한 사용자 마커 갱신
    joinList.forEach((user, userId) => {
      const { userLat, userLng, userName } = user;

      if (joinListMarkerRef.current.has(userId)) {
        return;
      }

      const marker = new naver.maps.Marker({
        map,
        position: new naver.maps.LatLng(userLat, userLng),
        title: userName,
        icon: {
          content: `
            <div class="${classes.userMarker}" style="background:${stc(userId)}">
              <img src="${UserImage}">
            </div>
          `,
        },
      });

      joinListMarkerRef.current.set(userId, marker);

      const infoWindow = new naver.maps.InfoWindow({
        content: userName,
      });

      joinListInfoWindowRef.current.set(userId, infoWindow);

      naver.maps.Event.addListener(marker, 'click', () => {
        infoWindow.open(map, marker);
      });
    });
  }, [joinList]);

  const initMarkers = (map: naver.maps.Map) => {
    if (!map) {
      return;
    }

    const restaurantListByCategory: Map<string, RestaurantType[]> = new Map();

    // 카테고리로 분류
    restaurantData.forEach((restaurant) => {
      const { category } = restaurant;

      if (!restaurantListByCategory.has(category)) {
        restaurantListByCategory.set(category, []);
      }

      restaurantListByCategory.get(category)?.push(restaurant);
    });

    // 카테고리별 클러스터 생성
    restaurantListByCategory.forEach((restaurants, category) => {
      const markers: naver.maps.Marker[] = [];

      const iconUrl = getIconUrlByCategory(category);

      restaurants.forEach((restaurant) => {
        const { name, lat, lng } = restaurant;

        // (map 에 반영시키지 않는)마커 객체 생성
        const marker = new naver.maps.Marker({
          title: name,
          position: new naver.maps.LatLng(lat, lng),
          icon: {
            content: `<img src=${iconUrl} width="30" height="30" alt=${name}/>`,
          },
        });

        markers.push(marker);

        // 인포윈도우 객체 생성
        const infoWindow = new naver.maps.InfoWindow({
          content: name,
        });

        infoWindowsRef.current.push(infoWindow);

        // 마커 클릭 이벤트 등록
        naver.maps.Event.addListener(marker, 'click', () => {
          infoWindow.open(map, marker);
        });
      });

      // eslint 의 no-new, no-undef 에러를 피하기 위해 즉시실행함수로 작성
      (() => {
        return new MarkerClustering({
          map,
          markers,
          maxZoom: 19,
          gridSize: 300,
          disableClickZoom: false,
          icons: [
            {
              content: `
                <div class="${classes.clusterMarkerLayout}">
                  <div name="counter" class="${classes.clusterMarkerCountBox}">0</div>
                  <img src=${iconUrl} width="30" height="30" />
                </div>
              `,
            },
          ],
          indexGenerator: [0],
          // @types/navermaps 에 Marker 클래스 타입에 getElement 메서드가 정의되어 있질 않다.
          stylingFunction: (clusterMarker: any, count) => {
            const markerDom = clusterMarker.getElement() as HTMLElement;

            const counterDOM = markerDom.querySelector('div[name="counter"]');

            if (!(counterDOM instanceof HTMLElement)) {
              return;
            }

            counterDOM.innerText = `${count}`;
          },
        });
      })();
    });
  };

  const onInit = (map: naver.maps.Map): naver.maps.MapEventListener => {
    const onInitListener = naver.maps.Event.addListener(map, 'init', () => {
      if (!map) {
        return;
      }

      initMarkers(map);
    });
    return onInitListener;
  };

  const onDragend = (map: naver.maps.Map): naver.maps.MapEventListener => {
    const onDragendListener = naver.maps.Event.addListener(map, 'dragend', () => {
      if (!map) {
        return;
      }

      closeAllMarkerInfoWindow();
    });
    return onDragendListener;
  };

  const onClick = (map: naver.maps.Map): naver.maps.MapEventListener => {
    const onClickListener = naver.maps.Event.addListener(map, 'click', () => {
      if (!map) {
        return;
      }

      closeAllMarkerInfoWindow();
    });

    return onClickListener;
  };

  const onZooming = (map: naver.maps.Map): naver.maps.MapEventListener => {
    const onZoomingListener = naver.maps.Event.addListener(mapRef.current, 'zooming', () => {
      if (!map) {
        return;
      }

      setLoading(true);
    });

    return onZoomingListener;
  };

  const onZoomChanged = (map: naver.maps.Map): naver.maps.MapEventListener => {
    const onZoomChangedListener = naver.maps.Event.addListener(
      mapRef.current,
      'zoom_changed',
      () => {
        if (!map) {
          return;
        }

        setLoading(false);
      }
    );

    return onZoomChangedListener;
  };

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const initListener = onInit(mapRef.current);
    const clickListener = onClick(mapRef.current);
    const dragendListener = onDragend(mapRef.current);
    const zoomingListener = onZooming(mapRef.current);
    const zoomChangedListener = onZoomChanged(mapRef.current);

    // eslint-disable-next-line consistent-return
    return () => {
      naver.maps.Event.removeListener(initListener);
      naver.maps.Event.removeListener(clickListener);
      naver.maps.Event.removeListener(dragendListener);
      naver.maps.Event.removeListener(zoomingListener);
      naver.maps.Event.removeListener(zoomChangedListener);
    };
  }, []);

  // 모임 위치(props) 변경 시 지도 화면 이동
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    mapRef.current.setCenter({ x: roomLocation.lng, y: roomLocation.lat });
  }, [roomLocation]);

  return (
    <MapLayout>
      {loading && (
        <MapLoadingBox>
          <LoadingSpinner />
        </MapLoadingBox>
      )}
      <MapBox ref={mapDivRef} />
    </MapLayout>
  );
}

export default MainMap;
