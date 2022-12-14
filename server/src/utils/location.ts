import { LOCATION_BOUNDARY } from '@constants/location';

export const isInKorea = (lat: number, lng: number) => {
  return (
    LOCATION_BOUNDARY.LAT.min < lat &&
    lat < LOCATION_BOUNDARY.LAT.max &&
    LOCATION_BOUNDARY.LNG.min < lng &&
    lng < LOCATION_BOUNDARY.LNG.max
  );
};
