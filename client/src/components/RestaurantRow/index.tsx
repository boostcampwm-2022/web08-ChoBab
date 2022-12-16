import { ReactComponent as StarIcon } from '@assets/images/star-icon.svg';
import { ReactComponent as FakeWordIcon } from '@assets/images/fake-word.svg';
import * as palette from '@styles/Variables';
import { useMeetLocationStore } from '@store/index';
import { getDistance } from 'geolib';
import RestaurantDefaultImg from '@assets/images/restaurant-default.jpg';
import { RESTAURANT_LIST_TYPES } from '@constants/modal';
import RestaurantVoteButton from '@components/RestaurantVoteButton';
import { distanceToDisplay } from '@utils/distance';

import {
  ThumbnailFakeBox,
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
  const { meetLocation } = useMeetLocationStore();
  // 렌더링 순서 때문에 as 로 타입 지정을 직접 해주어도 괜찮겠다고 판단
  const { lat: roomLat, lng: roomLng } = meetLocation as LocationType;
  const straightDistance = getDistance({ lat, lng }, { lat: roomLat, lng: roomLng });

  const thumbnailSrc = photoUrlList && photoUrlList[0] ? photoUrlList[0] : '';

  return (
    <RestaurantRowBox layout>
      <ImageBox>
        <ThumbnailImage
          src={thumbnailSrc}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = RestaurantDefaultImg;
          }}
        />
        <ThumbnailFakeBox>
          <FakeWordIcon />
        </ThumbnailFakeBox>
      </ImageBox>
      <InfoBox>
        <NameBox>{name}</NameBox>
        <CategoryBox>{category}</CategoryBox>
        <RatingBox>
          <StarIcon width="15px" fill={rating ? palette.PRIMARY : 'gray'} />
          {rating || '-'}
        </RatingBox>
        <DistanceBox>
          모임 위치에서 {straightDistance ? distanceToDisplay(straightDistance) : ''}
        </DistanceBox>
      </InfoBox>
      <RestaurantVoteButton id={id} restaurantListType={restaurantListType} likeCnt={likeCnt} />
    </RestaurantRowBox>
  );
}

export default RestaurantRow;
