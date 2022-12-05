import { FULL_SCREEN_MODAL_TYPES } from '@constants/modal';
import { useFullScreenModalStateStore } from '@store/index';
import { LayerBox } from './styles';

function RestaurantListLayer() {
  const { fullScreenModalState } = useFullScreenModalStateStore((state) => state);

  let pages: JSX.Element = <div />;

  if (fullScreenModalState === FULL_SCREEN_MODAL_TYPES.restaurantList) {
    pages = <LayerBox>restaurant list page(여기 내부에 구현)</LayerBox>;
  }

  if (fullScreenModalState === FULL_SCREEN_MODAL_TYPES.restaurantCandidateList) {
    pages = <LayerBox>restaurant candidate list page(여기 내부에 구현)</LayerBox>;
  }

  return pages;
}

export default RestaurantListLayer;
