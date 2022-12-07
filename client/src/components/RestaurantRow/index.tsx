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
}

function RestaurantRow({ restaurant, restaurantListType }: PropsType) {
  const { id, name, category, lat, lng, rating, photoKeyList } = restaurant;

  const {
    meetLocation: { lat: roomLat, lng: roomLng },
  } = useMeetLocationStore();

  const straightDistance = getDistance({ lat, lng }, { lat: roomLat, lng: roomLng });

  // 커밋에 기록이 남는게 찝찝해서 하드코딩하여 테스트했던 api key 일단 삭제.
  const googleApiKey = '';

  const photoReference = photoKeyList && photoKeyList.length > 0 ? photoKeyList[0] : '';

  const imageSrc = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${googleApiKey}`;

  return (
    <RestaurantRowBox>
      <ImageBox>
        <ThumbnailImage src={imageSrc} />
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
      {/* TODO: 이벤트 버블링 막기, 버튼 클릭시 상세 모달 열리면 안됨 */}
      <RestaurantVoteButton id={id} restaurantListType={restaurantListType} />
    </RestaurantRowBox>
  );
}

export default RestaurantRow;
