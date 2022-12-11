import { useEffect, useState } from 'react';

import { InitRoomPageLayout } from '@pages/InitRoomPage/styles';
import MeetLocationSettingMap from '@components/MeetLocationSettingMap';
import MeetLocationSettingFooter from '@components/MeetLocationSettingFooter';
import LoadingScreen from '@components/LoadingScreen';

import useCurrentLocation from '@hooks/useCurrentLocation';
import { useMeetLocationStore } from '@store/index';

function InitRoomPage() {
  const [isGPSReady, setGPSReady] = useState<boolean>(false);
  const userLocation = useCurrentLocation();
  const { updateMeetLocation } = useMeetLocationStore((state) => state);
  useEffect(() => {
    if (isGPSReady) {
      return;
    }
    if (!userLocation.lat || !userLocation.lng) {
      return;
    }
    setGPSReady(true);
  }, [userLocation]);
  useEffect(() => {
    if (!isGPSReady) {
      return;
    }
    if (!userLocation.lat || !userLocation.lng) {
      return;
    }
    updateMeetLocation(userLocation.lat, userLocation.lng);
  }, [isGPSReady]);

  return !isGPSReady ? (
    <LoadingScreen type="normal" message="위치 받아오는 중..." />
  ) : (
    <InitRoomPageLayout>
      <MeetLocationSettingMap userLocation={userLocation} />
      <MeetLocationSettingFooter />
    </InitRoomPageLayout>
  );
}

export default InitRoomPage;
