import { FULL_SCREEN_MODAL_TYPES } from '@constants/modal';
import { useFullScreenModalStateStore } from '@store/index';
import { LayerBox } from './styles';

function RestaurantDetailLayer() {
  const { fullScreenModalState } = useFullScreenModalStateStore((state) => state);

  let pages: JSX.Element = <div />;

  if (fullScreenModalState === FULL_SCREEN_MODAL_TYPES.restaurantDetail) {
    pages = <LayerBox>restaurant detail page</LayerBox>;
  }

  return pages;
}

export default RestaurantDetailLayer;
