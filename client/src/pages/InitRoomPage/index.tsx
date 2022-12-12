import { useEffect, useState } from 'react';

import { InitRoomPageLayout } from '@pages/InitRoomPage/styles';
import MeetLocationSettingMap from '@components/MeetLocationSettingMap';
import MeetLocationSettingFooter from '@components/MeetLocationSettingFooter';
import LoadingScreen from '@components/LoadingScreen';

import useCurrentLocation from '@hooks/useCurrentLocation';
import { useMeetLocationStore } from '@store/index';

function InitRoomPage() {
  const [isGPSReady, setGPSReady] = useState<boolean>(false);
  const { userLocation, updateCurrentPosition } = useCurrentLocation();
  const { meetLocation, updateMeetLocation } = useMeetLocationStore((state) => state);

  useEffect(() => {
    if (!isGPSReady) {
      return;
    }

    if (!userLocation) {
      return;
    }

    updateMeetLocation(userLocation.lat, userLocation.lng);
  }, [isGPSReady]);

  useEffect(() => {
    if (isGPSReady) {
      return;
    }

    if (!userLocation) {
      return;
    }

    setGPSReady(true);
  }, [userLocation]);

  useEffect(() => {
    updateCurrentPosition();
  }, []);

  return !meetLocation ? (
    <LoadingScreen size="large" message="위치 받아오는 중..." />
  ) : (
    <InitRoomPageLayout>
      <MeetLocationSettingMap userLocation={userLocation} />
      <MeetLocationSettingFooter />
    </InitRoomPageLayout>
  );
}

export default InitRoomPage;
