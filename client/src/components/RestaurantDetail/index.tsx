import { useEffect } from 'react';
import { ReactComponent as BackwardIcon } from '@assets/images/backward-arrow-icon.svg';
import { RestaurantDetailModalTitle } from '@components/RestaurantDetail/RestaurantDetailModalTitle';
import { RestaurantDetailCarousel } from '@components/RestaurantDetail/RestaurantDetailModalCarousel';
import { RESTAURANT_DETAIL_TYPES } from '@constants/modal';
import { useSelectedRestaurantDataStore } from '@store/index';
import { ModalBox, ModalLayout, BackwardButton, AddCandidatesButton } from './styles';
import { RestaurantDetailModalBody } from './RestaurantDetailModalBody';

interface PropsType {
  updateRestaurantDetailLayerStatus: (restaurantDetailType: RESTAURANT_DETAIL_TYPES) => void;
}

export function RestaurantDetailModal({ updateRestaurantDetailLayerStatus }: PropsType) {
  const { selectedRestaurantData, updateSelectedRestaurantData } = useSelectedRestaurantDataStore(
    (state) => state
  );
  useEffect(() => {
    return () => {
      // 굳이 useEffect에서 이를 수행해주는 이유는
      // 클릭 이벤트 시 이를 수행해주면 클릭 즉시 전역 상태가 변하면서 애니메이션 와중에 데이터들이 null 값으로 바뀌기 때문
      // 보기 안좋음
      updateSelectedRestaurantData(null);
    };
  }, []);

  return (
    <ModalLayout
      initial={{ opacity: 0, x: 999 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 999 }}
      transition={{ duration: 1 }}
    >
      <BackwardButton
        onClick={() => {
          updateRestaurantDetailLayerStatus(RESTAURANT_DETAIL_TYPES.hidden);
        }}
      >
        <BackwardIcon fill="white" />
      </BackwardButton>
      <AddCandidatesButton>후보 추가</AddCandidatesButton>
      <ModalBox>
        <RestaurantDetailCarousel imageUrlList={selectedRestaurantData?.photoKeyList || []} />
        <RestaurantDetailModalTitle
          name={selectedRestaurantData?.name || ''}
          category={selectedRestaurantData?.category || ''}
          rating={selectedRestaurantData?.rating || 0}
        />
        <RestaurantDetailModalBody
          id={selectedRestaurantData?.id || ''}
          address={selectedRestaurantData?.address || ''}
          lat={selectedRestaurantData?.lat || NaN}
          lng={selectedRestaurantData?.lng || NaN}
          phone={selectedRestaurantData?.phone || ''}
        />
      </ModalBox>
    </ModalLayout>
  );
}
