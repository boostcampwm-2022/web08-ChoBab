import { useCallback, useEffect, useRef, useState } from 'react';
import { useUserLocationStore } from '@store/index';
import { distanceToDisplay } from '@utils/distance';
import { msToTimeDisplay } from '@utils/time';
import { apiService } from '@apis/index';
import { DrivingInfoBox, MapBox } from './styles';

interface PositionType {
  lat: number;
  lng: number;
}

interface PropsType {
  restaurantPos: PositionType;
}

function RestaurantDetailDrivingInfo({ restaurantPos }: PropsType) {
  const { userLocation } = useUserLocationStore();
  const userPos: PositionType = userLocation;
  const [drivingInfo, setDrivingInfo] = useState<DrivingInfoType>();

  const mapRef = useRef<HTMLDivElement>(null);

  // 길찾기 API 호출
  const getDrivingInfo = async (
    startPos: PositionType,
    goalPos: PositionType
  ): Promise<DrivingInfoType> => {
    const { lat: startLat, lng: startLng } = startPos;
    const { lat: goalLat, lng: goalLng } = goalPos;
    try {
      const drivingInfoData = await apiService.getDrivingInfoData(
        startLat,
        startLng,
        goalLat,
        goalLng
      );
      setDrivingInfo(() => drivingInfoData);
      return drivingInfoData;
    } catch (error: any) {
      console.log(error.response.data.message ?? '길찾기 정보를 불러오는데 실패했습니다.');
      return {} as DrivingInfoType;
    }
  };

  const mapSetting = useCallback(async () => {
    if (!mapRef.current) {
      return;
    }

    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(userPos.lat, userPos.lng),
      zoom: 11,
    });

    const { lat: startLat, lng: startLng } = userPos;
    const { lat: goalLat, lng: goalLng } = restaurantPos;

    // 출발지, 도착지 마커 생성 및 지도에 표시
    const startMarker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(startLat, startLng),
    });
    const goalMarker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(goalLat, goalLng),
    });

    // 길찾기 정보를 받아오는 함수 호출
    const { path } = await getDrivingInfo(userPos, restaurantPos);

    if (!path) {
      return;
    }

    // 경로를 표시할 좌표들 배열 -> naver.maps.LatLng 객체로 변환
    const drivingInfoPaths =
      path.map((pos: number[]) => new naver.maps.LatLng(pos[1], pos[0])) || [];

    // 경로 그리기
    const polyline = new naver.maps.Polyline({
      map,
      path: drivingInfoPaths,
      strokeColor: 'blue', // 선 색
      strokeLineCap: 'round', // 라인의 끝 모양
      strokeWeight: 5, // 선 두께
    });

    // 지도 중심을 경로의 중심으로 설정
    map.setCenter(polyline.getBounds().getCenter());
  }, []);

  useEffect(() => {
    mapSetting().then();
  }, []);

  return (
    <>
      <DrivingInfoBox>
        <span>소요 시간 : {msToTimeDisplay(drivingInfo?.duration || 0)}</span>
        <span>이동 거리 : {distanceToDisplay(drivingInfo?.distance || 0)}</span>
      </DrivingInfoBox>
      <MapBox ref={mapRef} />
    </>
  );
}

export default RestaurantDetailDrivingInfo;
