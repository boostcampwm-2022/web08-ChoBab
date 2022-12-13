import { NAVER_LAT, NAVER_LNG } from '@constants/map';
import { useUserLocationStore } from '@store/index';

const useCurrentLocation = () => {
  const { userLocation, updateUserLocation } = useUserLocationStore();

  const handleSuccess = (position: GeolocationPosition) => {
    updateUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
  };

  const handleError = () => {
    updateUserLocation({ lat: NAVER_LAT, lng: NAVER_LNG });
  };

  const updateCurrentPosition = () => {
    // 위치 사용 불가 장치인 경우
    if (!('geolocation' in navigator)) {
      handleError();
      return;
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  };

  const getCurrentLocation = () => {
    return new Promise<LocationType>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => {
          reject();
        }
      );
    });
  };

  return { userLocation, updateCurrentPosition, updateUserLocation, getCurrentLocation };
};

export default useCurrentLocation;
