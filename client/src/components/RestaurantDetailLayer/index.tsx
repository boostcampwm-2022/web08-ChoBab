import { useRestaurantDetailLayerStatusStore, useSelectedRestaurantDataStore } from '@store/index';
import { RESTAURANT_DETAIL_TYPES } from '@constants/modal';
import { LayerBox } from './styles';

function RestaurantDetailLayer() {
  const { restaurantDetailLayerStatus, updateRestaurantDetailLayerStatus } =
    useRestaurantDetailLayerStatusStore((state) => state);

  const { selectedRestaurantData } = useSelectedRestaurantDataStore((state) => state);

  if (restaurantDetailLayerStatus === RESTAURANT_DETAIL_TYPES.show) {
    return (
      <LayerBox>
        <p>restaurant detail page</p>
        <p>선택된 식당 이름 :{selectedRestaurantData?.name}</p>
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
