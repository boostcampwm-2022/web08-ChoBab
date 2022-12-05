import { ReactComponent as StarIcon } from '@assets/images/star-icon.svg';
import * as palette from '@styles/Variables';
import { useMeetLocationStore } from '@store/index';
import { getDistance } from 'geolib';
import {
  CandidateRowBox,
  DistanceBox,
  ImageBox,
  InfoBox,
  LikeButton,
  NameBox,
  RatingBox,
  ThumbnailImage,
} from './styles';

interface CandidateType {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  like: number;
  rating?: number;
  thumbnailImage?: string;
}

interface PropsType {
  candidateRestaurant: CandidateType;
}

export function CandidateRow({ candidateRestaurant }: PropsType) {
  const { id, name, category, lat, lng, like, rating, thumbnailImage } = candidateRestaurant;
  const {
    meetLocation: { lat: roomLat, lng: roomLng },
  } = useMeetLocationStore();
  const distance = getDistance({ lat, lng }, { lat: roomLat, lng: roomLng });

  return (
    <CandidateRowBox>
      <ImageBox>
        <ThumbnailImage style={{ backgroundImage: `url(${thumbnailImage})` }} />
      </ImageBox>
      <InfoBox>
        <NameBox>{name}</NameBox>
        <p>{category}</p>
        <RatingBox>
          <StarIcon fill={palette.PRIMARY} /> {rating}
        </RatingBox>
        <DistanceBox>
          모임 위치에서 {distance > 1000 ? `${Math.round(distance / 100) / 10} km` : `${distance} m`}
        </DistanceBox>
      </InfoBox>
      <LikeButton>좋아요</LikeButton>
    </CandidateRowBox>
  );
}
