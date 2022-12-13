import { useEffect, useState } from 'react';

import { InitRoomPageLayout } from '@pages/InitRoomPage/styles';
import MeetLocationSettingMap from '@components/MeetLocationSettingMap';
import MeetLocationSettingFooter from '@components/MeetLocationSettingFooter';
import LoadingScreen from '@components/LoadingScreen';

import useCurrentLocation from '@hooks/useCurrentLocation';
import { useMeetLocationStore } from '@store/index';

function InitRoomPage() {
  const { getCurrentLocation } = useCurrentLocation();
  const { updateMeetLocation } = useMeetLocationStore((state) => state);
  const [isGPSReady, setGPSReady] = useState<boolean>(false);

  const setUserLocation = async () => {
    const location = await getCurrentLocation();
    updateMeetLocation(location);
    setGPSReady(true);
  };

  useEffect(() => {
    setUserLocation();
  }, []);

  return !isGPSReady ? (
    <LoadingScreen size="large" message="위치 받아오는 중..." />
  ) : (
    <InitRoomPageLayout>
      <MeetLocationSettingMap />
      <MeetLocationSettingFooter />
    </InitRoomPageLayout>
  );
}

export default InitRoomPage;
