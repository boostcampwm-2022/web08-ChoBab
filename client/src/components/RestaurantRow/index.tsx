import { ReactComponent as StarIcon } from '@assets/images/star-icon.svg';
import * as palette from '@styles/Variables';
import { useMeetLocationStore } from '@store/index';
import { getDistance } from 'geolib';
import { RESTAURANT_LIST_TYPES } from '@constants/modal';

import { distanceToDisplay } from '@utils/distance';
import {
  RestaurantRowBox,
  DistanceBox,
  ImageBox,
  InfoBox,
  LikeButton,
  NameBox,
  RatingBox,
  ThumbnailImage,
  CategoryBox,
} from './styles';

interface PropsType {
  restaurant: RestaurantType;
  restaurantListType: RESTAURANT_LIST_TYPES;
}

function RestaurantRow({ restaurant, restaurantListType }: PropsType) {
  const { name, category, lat, lng, rating, photoUrlList } = restaurant;

  const {
    meetLocation: { lat: roomLat, lng: roomLng },
  } = useMeetLocationStore();

  const straightDistance = getDistance({ lat, lng }, { lat: roomLat, lng: roomLng });

  // 커밋에 기록이 남는게 찝찝해서 하드코딩하여 테스트했던 api key 일단 삭제.
  const thumbnailSrc = photoUrlList && photoUrlList[0] ? photoUrlList[0] : '';

  return (
    <RestaurantRowBox>
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

      {/* LikeButton 의 동작은 별도의 컴포넌트로 만들어 변경해주세요. */}
      <LikeButton>
        {restaurantListType === RESTAURANT_LIST_TYPES.filtered ? '투표하기' : '좋아요'}
      </LikeButton>
    </RestaurantRowBox>
  );
}

export default RestaurantRow;
