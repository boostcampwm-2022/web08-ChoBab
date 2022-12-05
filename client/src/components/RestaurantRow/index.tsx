import { ReactComponent as StarIcon } from '@assets/images/star-icon.svg';
import * as palette from '@styles/Variables';
import { useMeetLocationStore } from '@store/index';
import { getDistance } from 'geolib';
import dummyImage from '@assets/images/dummy-image.jpg';

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

  // 커밋에 기록이 남는게 찝찝해서 하드코딩하여 테스트했던 api key 일단 삭제.
  const googleApiKey = '';

  const imageSrc =
    photoKeyList && photoKeyList.length > 0
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoKeyList[0]}&key=${googleApiKey}`
      : dummyImage;

  return (
    <RestaurantRowBox>
      <ImageBox>
        <ThumbnailImage src={imageSrc} />
      </ImageBox>
      <InfoBox>
        <NameBox>{name}</NameBox>
        <p>{category}</p>
        <RatingBox>
          <StarIcon width="15px" fill={rating ? palette.PRIMARY : 'gray'} />
          {rating || '-'}
        </RatingBox>
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
