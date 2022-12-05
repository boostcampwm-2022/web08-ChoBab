import { useEffect } from 'react';
import DrivingInfoMap from '@components/DrivingInfoMap';

function TestPage() {
  const userPos = { lat: 37.566826, lng: 126.9786567 };
  const restaurantPos = { lat: 37.566826, lng: 126.9786567 };
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  }, []);

  return <DrivingInfoMap userPos={userPos} restaurantPos={restaurantPos} />;
}

export default TestPage;
