import { useRestaurantDetailStateStore } from '@store/index';
import { RESTAURANT_DETAIL_TYPES } from '@constants/modal';
import { LayerBox } from './styles';

function RestaurantDetailLayer() {
  const { restaurantDetailState } = useRestaurantDetailStateStore((state) => state);

  if (restaurantDetailState === RESTAURANT_DETAIL_TYPES.show) {
    return <LayerBox>restaurant detail page</LayerBox>;
  }

  return <div />;
}

export default RestaurantDetailLayer;
