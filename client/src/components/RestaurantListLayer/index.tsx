import { useRestaurantListStateStore } from '@store/index';
import RestaurantList from '@components/RestaurantList';
import { RESTAURANT_LIST_TYPES } from '@constants/modal';
import { LayerBox } from './styles';

function RestaurantListLayer() {
  const { restaurantListState } = useRestaurantListStateStore((state) => state);

  if (restaurantListState === RESTAURANT_LIST_TYPES.category) {
    return (
      <LayerBox>
        <RestaurantList />
      </LayerBox>
    );
  }

  if (restaurantListState === RESTAURANT_LIST_TYPES.candidate) {
    return <LayerBox>restaurant candidate list page(여기 내부에 구현)</LayerBox>;
  }

  return <div />;
}

export default RestaurantListLayer;
