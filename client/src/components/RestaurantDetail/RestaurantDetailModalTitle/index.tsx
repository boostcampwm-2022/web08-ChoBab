import { ReactComponent as StarIcon } from '@assets/images/star-icon.svg';
import * as palette from '@styles/Variables';
import { CategoryBox, ModalTitleBox, ModalTitleLayout, NameBox, RatingBox } from './styles';

interface PropsType {
  name: string;
  category: string;
  rating: number;
}

export function RestaurantDetailModalTitle({ name, category, rating = 0 }: PropsType) {
  return (
    <ModalTitleLayout>
      <ModalTitleBox>
        <NameBox>
          <p>{name}</p>
        </NameBox>
        <CategoryBox>{category}</CategoryBox>
        <RatingBox>
          <StarIcon width="15px" fill={!rating ? 'gray' : `${palette.PRIMARY}`} />
          {!rating ? '-' : `${rating}`}
        </RatingBox>
      </ModalTitleBox>
    </ModalTitleLayout>
  );
}
