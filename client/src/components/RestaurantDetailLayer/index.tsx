import { PAGES_TYPES } from '@constants/page';
import { usePageStateStore } from '@store/index';
import { LayerBox } from './styles';

function RestaurantDetailLayer() {
  const { pageState } = usePageStateStore((state) => state);

  let pages: JSX.Element = <div />;

  if (pageState === PAGES_TYPES.restaurantDetail) {
    pages = <LayerBox>restaurant detail page</LayerBox>;
  }

  return pages;
}

export default RestaurantDetailLayer;
