import { useCallback, useEffect, useRef } from 'react';
import { MapBox } from '@components/MainMap/styles';
import { DrivingInfoMapLayout } from './styles';

interface PositionType {
  lat: number;
  lng: number;
}

interface PropsType {
  userPos: PositionType;
  restaurantPos: PositionType;
}

function DrivingInfoMap({ userPos, restaurantPos }: PropsType) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapSetting = useCallback(() => {
    if (!mapRef.current) {
      return;
    }

    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(37.3674001, 127.1181196),
      zoom: 14,
    });

    const polyline = new naver.maps.Polyline({
      map,
      path: [
        new naver.maps.LatLng(37.359924641705476, 127.1148204803467),
        new naver.maps.LatLng(37.36343797188166, 127.11486339569092),
        new naver.maps.LatLng(37.368520071054576, 127.11473464965819),
        new naver.maps.LatLng(37.3685882848096, 127.1088123321533),
        new naver.maps.LatLng(37.37295383612657, 127.10876941680907),
        new naver.maps.LatLng(37.38001321351567, 127.11851119995116),
        new naver.maps.LatLng(37.378546827477855, 127.11984157562254),
        new naver.maps.LatLng(37.376637072444105, 127.12052822113036),
        new naver.maps.LatLng(37.37530703574853, 127.12190151214598),
        new naver.maps.LatLng(37.371657839593894, 127.11645126342773),
        new naver.maps.LatLng(37.36855417793982, 127.1207857131958),
      ],
    });
  }, []);

  useEffect(() => {
    mapSetting();
  }, []);

  return (
    <DrivingInfoMapLayout>
      <MapBox ref={mapRef} />
    </DrivingInfoMapLayout>
  );
}

export default DrivingInfoMap;
