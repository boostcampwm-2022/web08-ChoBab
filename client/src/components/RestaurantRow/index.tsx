import { ReactComponent as StarIcon } from '@assets/images/star-icon.svg';
import * as palette from '@styles/Variables';
import { useMeetLocationStore } from '@store/index';
import { getDistance } from 'geolib';
import { RESTAURANT_LIST_TYPES } from '@constants/modal';
import RestaurantVoteButton from '@components/RestaurantVoteButton';

import { distanceToDisplay } from '@utils/distance';
import {
  RestaurantRowBox,
  DistanceBox,
  ImageBox,
  InfoBox,
  NameBox,
  RatingBox,
  ThumbnailImage,
  CategoryBox,
} from './styles';

interface PropsType {
  restaurant: RestaurantType;
  restaurantListType: RESTAURANT_LIST_TYPES;
  // eslint-disable-next-line react/require-default-props
  likeCnt?: number;
}

function RestaurantRow({ restaurant, restaurantListType, likeCnt }: PropsType) {
  const { id, name, category, lat, lng, rating, photoUrlList } = restaurant;

  const {
    meetLocation: { lat: roomLat, lng: roomLng },
  } = useMeetLocationStore();

  const straightDistance = getDistance({ lat, lng }, { lat: roomLat, lng: roomLng });

  const thumbnailSrc = photoUrlList && photoUrlList[0] ? photoUrlList[0] : '';

  return (
    <RestaurantRowBox layout>
      <ImageBox>
        <ThumbnailImage src={thumbnailSrc} />
      </ImageBox>
      <InfoBox>
        <NameBox>{name}</NameBox>
        <CategoryBox>{category}</CategoryBox>
        <RatingBox>
          <StarIcon width="15px" fill={rating ? palette.PRIMARY : 'gray'} />
          {rating || '-'}
        </RatingBox>
        <DistanceBox>모임 위치에서 {distanceToDisplay(straightDistance)}</DistanceBox>
      </InfoBox>
      <RestaurantVoteButton id={id} restaurantListType={restaurantListType} likeCnt={likeCnt} />
    </RestaurantRowBox>
  );
}

export default RestaurantRow;
