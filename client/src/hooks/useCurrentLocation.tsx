import { useState, useEffect } from 'react';
import { NAVER_LAT, NAVER_LNG } from '@constants/map';

interface locationType {
  lat: number;
  lng: number;
}

const useCurrentLocation = () => {
  const [location, setLocation] = useState<locationType>({ lat: NAVER_LAT, lng: NAVER_LNG });

  const handleSuccess = (position: GeolocationPosition) => {
    setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
  };

  const handleError = () => {
    setLocation({ lat: NAVER_LAT, lng: NAVER_LNG });
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
