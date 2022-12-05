import { useRestaurantDetailStateStore } from '@store/index';
import { LayerBox } from './styles';

function RestaurantDetailLayer() {
  const { restaurantDetailState } = useRestaurantDetailStateStore((state) => state);

  if (restaurantDetailState) {
    return <LayerBox>restaurant detail page</LayerBox>;
  }

  return <div />;
}

export default RestaurantDetailLayer;
