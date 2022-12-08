import { useState, useEffect } from 'react';
import { NAVER_LAT, NAVER_LNG } from '@constants/map';
import { useUserLocationStore } from '@store/index';

interface LocationType {
  lat: number | null;
  lng: number | null;
}

const useCurrentLocation = () => {
  const [location, setLocation] = useState<LocationType>({ lat: null, lng: null });
  const { updateUserLocation } = useUserLocationStore();

  const handleSuccess = (position: GeolocationPosition) => {
    setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
    updateUserLocation(position.coords.latitude, position.coords.longitude);
  };

  const handleError = () => {
    setLocation({ lat: NAVER_LAT, lng: NAVER_LNG });
    updateUserLocation(NAVER_LAT, NAVER_LNG);
  };

  useEffect(() => {
    // 위치 사용 불가 장치인 경우
    if (!('geolocation' in navigator)) {
      handleError();
      return;
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  return location;
};

export default useCurrentLocation;
