import { useEffect, useState } from 'react';
import { InitRoomPageLayout } from '@pages/InitRoomPage/styles';
import MeetLocationSettingMap from '@components/MeetLocationSettingMap';
import MeetLocationSettingFooter from '@components/MeetLocationSettingFooter';
import useCurrentLocation from '@hooks/useCurrentLocation';
import { useMeetLocationStore } from '@store/index';

function InitRoomPage() {
  const [isGPSReady, setGPSReady] = useState<boolean>(false);
  const userLocation = useCurrentLocation();
  const { updateMeetLocation } = useMeetLocationStore((state) => state);

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

  return !isGPSReady ? (
    <div>loading...</div>
  ) : (
    <InitRoomPageLayout>
      <MeetLocationSettingMap userLocation={userLocation} />
      <MeetLocationSettingFooter />
    </InitRoomPageLayout>
  );
}

export default InitRoomPage;
