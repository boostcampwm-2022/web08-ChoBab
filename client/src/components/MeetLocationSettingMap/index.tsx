import { useEffect } from 'react';
import { ReactComponent as FlagIcon } from '@assets/images/flag.svg';
import { useMeetLocationStore } from '@store/index';
import { useNaverMaps } from '@hooks/useNaverMaps';
import { MapBox, MarkerBox } from './styles';

function MeetLocationSettingMap() {
  const [mapRef, mapDivRef] = useNaverMaps();
  const { meetLocation, updateMeetLocation } = useMeetLocationStore((state) => state);

  // dragEnd 이벤트 핸들러 생성
  const onDragEnd = (map: naver.maps.Map): naver.maps.MapEventListener => {
    const dragEndListener = naver.maps.Event.addListener(map, 'dragend', () => {
      const lng = map.getCenter().x;
      const lat = map.getCenter().y;

      updateMeetLocation(lat, lng);
    });

    return dragEndListener;
  };

  // zoom_changed 이벤트 핸들러 생성
  const onZoomChanged = (map: naver.maps.Map): naver.maps.MapEventListener => {
    const zoomChangedListener = naver.maps.Event.addListener(map, 'zoom_changed', () => {
      const lng = map.getCenter().x;
      const lat = map.getCenter().y;

      updateMeetLocation(lat, lng);
    });

    return zoomChangedListener;
  };

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const dragEndListener = onDragEnd(mapRef.current);
    const zoomChangedListener = onZoomChanged(mapRef.current);

    // eslint-disable-next-line consistent-return
    return () => {
      naver.maps.Event.removeListener(dragEndListener);
      naver.maps.Event.removeListener(zoomChangedListener);
    };
  }, []);

  // 모임 위치(전역 상태) 변경 시 지도 화면 이동
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    if (!meetLocation) {
      return;
    }

    mapRef.current.setCenter({ x: meetLocation.lng, y: meetLocation.lat });
  }, [meetLocation]);

  return (
    <MapBox ref={mapDivRef}>
      <MarkerBox>
        <FlagIcon />
      </MarkerBox>
    </MapBox>
  );
}

export default MeetLocationSettingMap;
