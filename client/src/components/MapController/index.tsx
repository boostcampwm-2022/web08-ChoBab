import { Socket } from 'socket.io-client';

import { ReactComponent as GpsIcon } from '@assets/images/gps.svg';
import { ReactComponent as PointCircleIcon } from '@assets/images/point-circle.svg';

import useCurrentLocation from '@hooks/useCurrentLocation';

import { useSocketStore } from '@store/socket';
import { useMeetLocationStore, useMapStore } from '@store/index';

import { DEFAULT_ZOOM } from '@constants/map';

import { MapControlBox } from './styles';

function MapController() {
  const { getCurrentLocation, updateUserLocation } = useCurrentLocation();
  const { socket } = useSocketStore((state) => state);
  const { map } = useMapStore((state) => state);
  const { meetLocation } = useMeetLocationStore();

  return (
    <MapControlBox>
      <button
        type="button"
        onClick={() => {
          if (!map || !meetLocation) {
            return;
          }

          map.setCenter(meetLocation);
          map.setZoom(DEFAULT_ZOOM);
        }}
      >
        <PointCircleIcon />
      </button>
      <button
        type="button"
        onClick={async () => {
          if (!(socket instanceof Socket) || !map) {
            return;
          }

          const location = await getCurrentLocation();
          socket.emit('changeMyLocation', { userLat: location.lat, userLng: location.lng });
          updateUserLocation(location);

          map.setCenter(location);
        }}
      >
        <GpsIcon />
      </button>
    </MapControlBox>
  );
}

export default MapController;
