import React from 'react';
import { InitRoomPageLayout } from '@pages/InitRoomPage/styles';

import MeetLocationSettingMap from '@components/MeetLocationSettingMap';
import MeetLocationSettingFooter from '@components/MeetLocationSettingFooter';

function InitRoomPage() {
  return (
    <InitRoomPageLayout>
      <MeetLocationSettingMap />
      <MeetLocationSettingFooter />
    </InitRoomPageLayout>
  );
}

export default InitRoomPage;
