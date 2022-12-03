import { CategoryBox, ModalBodyBox, ModalBodyLayout, NameBox, RatingBox } from './styles';

interface PropsType {
  name: string;
  category: string;
  rating: number;
}

export function RestaurantDetailModalBody({ name, category, rating = 0 }: PropsType) {
  return (
    <ModalBodyLayout>
      <ModalBodyBox>
        <NameBox>
          <p>{name}</p>
        </NameBox>
        <CategoryBox>{category}</CategoryBox>
        <RatingBox>{!rating ? '평점 정보 없음' : `평점: ${rating}`}</RatingBox>
      </ModalBodyBox>
    </ModalBodyLayout>
  );
}
