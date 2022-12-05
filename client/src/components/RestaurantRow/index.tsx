import { ReactComponent as StarIcon } from '@assets/images/star-icon.svg';
import * as palette from '@styles/Variables';
import { useMeetLocationStore } from '@store/index';
import { getDistance } from 'geolib';

import {
  RestaurantRowBox,
  DistanceBox,
  ImageBox,
  InfoBox,
  LikeButton,
  NameBox,
  RatingBox,
  ThumbnailImage,
} from './styles';

interface PropsType {
  restaurant: RestaurantType;
}

function RestaurantRow({ restaurant }: PropsType) {
  const { name, category, lat, lng, rating, photoKeyList } = restaurant;

  const {
    meetLocation: { lat: roomLat, lng: roomLng },
  } = useMeetLocationStore();

  const distance = getDistance({ lat, lng }, { lat: roomLat, lng: roomLng });

  const thumbnailImage = '';

  return (
    <RestaurantRowBox>
      <ImageBox>
        <ThumbnailImage style={{ backgroundImage: `url(${thumbnailImage})` }} />
      </ImageBox>
      <InfoBox>
        <NameBox>{name}</NameBox>
        <p>{category}</p>
        <RatingBox>{rating && <StarIcon fill={palette.PRIMARY} />}</RatingBox>
        <DistanceBox>
          모임 위치에서{' '}
          {distance > 1000 ? `${Math.round(distance / 100) / 10} km` : `${distance} m`}
        </DistanceBox>
      </InfoBox>
      <LikeButton>좋아요</LikeButton>
    </RestaurantRowBox>
  );
}

export default RestaurantRow;
