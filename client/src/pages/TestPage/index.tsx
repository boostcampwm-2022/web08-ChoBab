import { useEffect } from 'react';
import DrivingInfoMap from '@components/DrivingInfoMap';

function TestPage() {
  const userPos = { lat: 37.57002838826, lng: 126.97962084516 };
  const restaurantPos = { lat: 37.508861, lng: 127.063149 };
  // const restaurantPos = { lat: 37.57002838826, lng: 126.97962084516 };
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  }, []);

  return <DrivingInfoMap userPos={userPos} restaurantPos={restaurantPos} />;
}

export default TestPage;
