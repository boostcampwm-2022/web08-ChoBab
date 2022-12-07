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
