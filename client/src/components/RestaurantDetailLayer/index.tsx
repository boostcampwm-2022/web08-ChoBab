import { useRestaurantDetailLayerStatusStore } from '@store/index';
import { RESTAURANT_DETAIL_TYPES } from '@constants/modal';
import { AnimatePresence } from 'framer-motion';
import { RestaurantDetailModal } from '@components/RestaurantDetailModal';
import { LayerBox } from './styles';

function RestaurantDetailLayer() {
  const { restaurantDetailLayerStatus, updateRestaurantDetailLayerStatus } =
    useRestaurantDetailLayerStatusStore((state) => state);
  return (
    <AnimatePresence>
      {restaurantDetailLayerStatus === RESTAURANT_DETAIL_TYPES.show && (
        <LayerBox>
          <RestaurantDetailModal
            updateRestaurantDetailLayerStatus={updateRestaurantDetailLayerStatus}
          />
        </LayerBox>
      )}
    </AnimatePresence>
  );
}
export default RestaurantDetailLayer;
