import { useRestaurantDetailLayerStatusStore } from '@store/index';
import { RESTAURANT_DETAIL_TYPES } from '@constants/modal';
import { AnimatePresence } from 'framer-motion';
import { RestaurantDetailModal } from '@components/RestaurantDetail';
import { LayerBox } from './styles';

function RestaurantDetailLayer() {
  const { restaurantDetailLayerStatus, updateRestaurantDetailLayerStatus } =
    useRestaurantDetailLayerStatusStore((state) => state);
  return (
    <AnimatePresence>
      {restaurantDetailLayerStatus === RESTAURANT_DETAIL_TYPES.show && (
        <LayerBox
          initial={{ opacity: 0, x: 999 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 999 }}
          transition={{ duration: 1 }}
          /**
           * 식당 요약정보 -> 식당 상세정보 경로로 레이어가 열렸을 때
           * 다시 돌아갔을 경우에도 식당 요약정보가 닫히지 않도록 하기 위함.
           * window에 등록한 이벤트 리스너를 실행시키지 않는다.
           */
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <RestaurantDetailModal
            updateRestaurantDetailLayerStatus={updateRestaurantDetailLayerStatus}
          />
        </LayerBox>
      )}
    </AnimatePresence>
  );
}
export default RestaurantDetailLayer;
