import { useEffect, useRef } from 'react';
import RestaurantRow from '@components/RestaurantRow';
import { AnimatePresence } from 'framer-motion';
import {
  useRestaurantDetailLayerStatusStore,
  useSelectedRestaurantPreviewDataStore,
} from '@store/index';
import { RESTAURANT_LIST_TYPES, RESTAURANT_DETAIL_TYPES } from '@constants/modal';
import { RestaurantPreviewBox, RestaurantPreviewLayout } from './styles';

function RestaurantPreview() {
  const modalRef = useRef<HTMLDivElement>(null);

  const { updateRestaurantDetailLayerStatus } = useRestaurantDetailLayerStatusStore(
    (state) => state
  );
  const { selectedRestaurantPreviewData, updateSelectedRestaurantPreviewData } =
    useSelectedRestaurantPreviewDataStore((state) => state);

  useEffect(() => {
    const modalCloseWindowEvent = (e: Event) => {
      const { target } = e;

      if (modalRef.current && target instanceof HTMLElement && modalRef.current.contains(target)) {
        return;
      }

      updateSelectedRestaurantPreviewData(null);
    };

    window.addEventListener('click', modalCloseWindowEvent);

    return () => {
      window.removeEventListener('click', modalCloseWindowEvent);
    };
  }, []);

  return (
    <RestaurantPreviewLayout ref={modalRef}>
      {selectedRestaurantPreviewData && (
        <AnimatePresence>
          <RestaurantPreviewBox
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: '0%' }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{
              duration: 0.5,
            }}
            onClick={() => {
              updateRestaurantDetailLayerStatus(RESTAURANT_DETAIL_TYPES.show);
            }}
          >
            <RestaurantRow
              restaurant={selectedRestaurantPreviewData}
              restaurantListType={RESTAURANT_LIST_TYPES.filtered}
            />
          </RestaurantPreviewBox>
        </AnimatePresence>
      )}
    </RestaurantPreviewLayout>
  );
}

export default RestaurantPreview;
