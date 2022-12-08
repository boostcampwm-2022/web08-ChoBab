import { useRestaurantListLayerStatusStore } from '@store/index';
import RestaurantFiltered from '@components/RestaurantFilteredList';
import { RESTAURANT_LIST_TYPES } from '@constants/modal';
import * as palette from '@styles/Variables';
import { AnimatePresence } from 'framer-motion';
import { CandidateListModal } from '@components/RestaurantCandidateList';
import { LayerBox } from './styles';

interface PropsType {
  restaurantData: RestaurantType[];
}

function RestaurantListLayer({ restaurantData }: PropsType) {
  const { restaurantListLayerStatus } = useRestaurantListLayerStatusStore((state) => state);

  return (
    <AnimatePresence>
      {restaurantListLayerStatus !== RESTAURANT_LIST_TYPES.hidden && (
        <LayerBox
          headerHeight={
            restaurantListLayerStatus === RESTAURANT_LIST_TYPES.filtered
              ? palette.HEADER_HEIGHT_RATIO + palette.CATEGORY_HEIGHT_RATIO
              : palette.HEADER_HEIGHT_RATIO
          }
          zIndex={
            restaurantListLayerStatus === RESTAURANT_LIST_TYPES.filtered
              ? palette.RESTAURANT_FILTERED_LIST_LAYER_Z_INDEX
              : palette.RESTAURANT_CANDIDATE_LIST_LAYER_Z_INDEX
          }
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: '0%' }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{
            duration: 0.5,
          }}
        >
          {restaurantListLayerStatus === RESTAURANT_LIST_TYPES.filtered ? (
            <RestaurantFiltered restaurantData={restaurantData} />
          ) : (
            <CandidateListModal restaurantData={restaurantData} />
          )}
        </LayerBox>
      )}
    </AnimatePresence>
  );
}

export default RestaurantListLayer;
