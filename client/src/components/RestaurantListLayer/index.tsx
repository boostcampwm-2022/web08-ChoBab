import { useRestaurantListStateStore } from '@store/index';
import RestaurantFiltered from '@components/RestaurantFiltered';
import { RESTAURANT_LIST_TYPES } from '@constants/modal';
import { LayerBox } from './styles';

interface PropsType {
  restaurantData: RestaurantType[];
  candidateData: RestaurantType[];
}

function RestaurantListLayer({ restaurantData, candidateData }: PropsType) {
  const { restaurantListState } = useRestaurantListStateStore((state) => state);

  if (restaurantListState === RESTAURANT_LIST_TYPES.filtered) {
    return (
      <LayerBox>
        <RestaurantFiltered restaurantData={restaurantData} />
      </LayerBox>
    );
  }

  if (restaurantListState === RESTAURANT_LIST_TYPES.candidate) {
    return <LayerBox>restaurant candidate list page(여기 내부에 구현)</LayerBox>;
  }

  return <div />;
}

export default RestaurantListLayer;
