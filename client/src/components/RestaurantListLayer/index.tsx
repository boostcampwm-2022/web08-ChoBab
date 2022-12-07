import { useRestaurantListLayerStatusStore } from '@store/index';
import RestaurantFiltered from '@components/RestaurantFiltered';
import { RESTAURANT_LIST_TYPES } from '@constants/modal';
import * as palette from '@styles/Variables';
import { LayerBox } from './styles';

interface PropsType {
  restaurantData: RestaurantType[];
  candidateData: RestaurantType[];
}

function RestaurantListLayer({ restaurantData, candidateData }: PropsType) {
  const { restaurantListLayerStatus } = useRestaurantListLayerStatusStore((state) => state);

  if (restaurantListLayerStatus === RESTAURANT_LIST_TYPES.filtered) {
    return (
      <LayerBox headerHeight={palette.HEADER_HEIGHT_RATIO + palette.CATEGORY_HEIGHT_RATIO}>
        <RestaurantFiltered restaurantData={restaurantData} />
      </LayerBox>
    );
  }

  if (restaurantListLayerStatus === RESTAURANT_LIST_TYPES.candidate) {
    return (
      <LayerBox headerHeight={palette.HEADER_HEIGHT_RATIO}>
        restaurant candidate list page(여기 내부에 구현)
      </LayerBox>
    );
  }

  return <div />;
}

export default RestaurantListLayer;
