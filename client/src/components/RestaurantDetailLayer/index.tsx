import { useRestaurantDetailLayerStatusStore } from '@store/index';
import { RESTAURANT_DETAIL_TYPES } from '@constants/modal';
import { LayerBox } from './styles';

function RestaurantDetailLayer() {
  const { restaurantDetailLayerStatus, updateRestaurantDetailLayerStatus } =
    useRestaurantDetailLayerStatusStore((state) => state);

  if (restaurantDetailLayerStatus === RESTAURANT_DETAIL_TYPES.show) {
    return (
      <LayerBox>
        restaurant detail page
        <button
          type="button"
          onClick={() => {
            updateRestaurantDetailLayerStatus(RESTAURANT_DETAIL_TYPES.hidden);
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
