import { useRestaurantListLayerStatusStore } from '@store/index';
import RestaurantFiltered from '@components/RestaurantFilteredList';
import { RESTAURANT_LIST_TYPES } from '@constants/modal';
import { AnimatePresence } from 'framer-motion';
import { CandidateListModal } from '@components/RestaurantCandidateList';
import { LayerBox } from './styles';

interface PropsType {
  restaurantData: RestaurantType[];
  candidateData: RestaurantType[];
}

function RestaurantListLayer({ restaurantData, candidateData }: PropsType) {
  const { restaurantListLayerStatus } = useRestaurantListLayerStatusStore((state) => state);

  return (
    <AnimatePresence>
      {restaurantListLayerStatus !== RESTAURANT_LIST_TYPES.hidden && (
        <LayerBox
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
            <CandidateListModal candidateData={candidateData} />
          )}
        </LayerBox>
      )}
    </AnimatePresence>
  );
}

export default RestaurantListLayer;
