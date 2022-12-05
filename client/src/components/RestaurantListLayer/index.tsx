import { PAGES_TYPES } from '@constants/page';
import { usePageStateStore } from '@store/index';
import { LayerBox } from './styles';

function RestaurantListLayer() {
  const { pageState } = usePageStateStore((state) => state);

  let pages: JSX.Element = <div />;

  if (pageState === PAGES_TYPES.restaurantList) {
    pages = <LayerBox>restaurant list page(여기 내부에 구현)</LayerBox>;
  }

  if (pageState === PAGES_TYPES.restaurantCandidateList) {
    pages = <LayerBox>restaurant candidate list page(여기 내부에 구현)</LayerBox>;
  }

  return pages;
}

export default RestaurantListLayer;
