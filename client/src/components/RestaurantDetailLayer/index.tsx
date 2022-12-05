import { useRestaurantDetailStateStore } from '@store/index';
import { LayerBox } from './styles';

function RestaurantDetailLayer() {
  const { restaurantDetailState, updateRestaurantDetailState } = useRestaurantDetailStateStore(
    (state) => state
  );

  if (restaurantDetailState) {
    return (
      <LayerBox>
        restaurant detail page
        <button
          type="button"
          onClick={() => {
            updateRestaurantDetailState(null);
          }}
        >
          닫기
        </button>
      </LayerBox>
    );
  }

  return <div />;
}

export default RestaurantDetailLayer;
