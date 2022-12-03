import React, { useEffect, useState } from 'react';
import { ReactComponent as BackwardIcon } from '@assets/images/backward-arrow-icon.svg';
import { RestaurantDetailModalFooter } from '@components/RestaurantDetailModalFooter';
import { RestaurantDetailModalBody } from '@components/RestaurantDetailModalBody';
import { LoadingComponent } from '@components/LoadingComponent';
import { RestaurantDetailCarousel } from '@components/RestaurantDetailModalCarousel';
import { ModalBox, ModalLayout, BackwardButton, AddCandidatesButton } from './styles';

interface RestaurantDataType {
  id: string;
  name: string;
  category: string;
  address: string;
  openNow?: boolean;
  phone?: string;
  lat: number;
  lng: number;
  rating?: number;
  imageUrlList: string[];
}

interface PropsType {
  setRestaurantDetailModalOn: React.Dispatch<React.SetStateAction<boolean>>;
}

export function RestaurantDetailModal({ setRestaurantDetailModalOn }: PropsType) {
  const [restaurantData, setRestaurantData] = useState<RestaurantDataType | null>(null);

  useEffect(() => {
    // 데이터를 비동기로 가져오는 요청을 표현하기 위해 임시로 mock 데이터를 setTimeout을 통해 가져오게 했습니다.
    setTimeout(() => {
      const mockRestaurantData = {
        id: '123456',
        name: '진우동',
        category: '일식',
        address: '경기 성남시 분당구 황새울로335번길 8 덕산빌딩',
        lat: 37.2432821,
        lng: 127.0727357,
        rating: 4.2,
        phone: '010-123-1234',
        imageUrlList: [
          'https://cdn.dribbble.com/users/808903/screenshots/3831862/dribbble_szablon__1_1.png',
          'https://github.com/pmndrs/zustand/blob/main/bear.jpg?raw=true',
          'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
        ],
      };
      setRestaurantData({ ...restaurantData, ...mockRestaurantData });
    }, 3000);
  }, []);

  return (
    <ModalLayout
      initial={{ opacity: 0, x: 999 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 999 }}
      transition={{ duration: 1.5 }}
    >
      {!restaurantData ? (
        <LoadingComponent />
      ) : (
        <>
          <BackwardButton
            onClick={() => {
              setRestaurantDetailModalOn(false);
            }}
          >
            <BackwardIcon fill="white"/>
          </BackwardButton>
          <AddCandidatesButton>후보 추가</AddCandidatesButton>
          <ModalBox>
            <RestaurantDetailCarousel
              imageUrlList={restaurantData.imageUrlList}
            />
            <RestaurantDetailModalBody
              name={restaurantData.name}
              category={restaurantData.category}
              rating={restaurantData.rating || 0}
            />
            <RestaurantDetailModalFooter
              id={restaurantData.id}
              address={restaurantData.address}
              lat={restaurantData.lat}
              lng={restaurantData.lng}
              phone={restaurantData?.phone || ''}
            />
          </ModalBox>
        </>
      )}
    </ModalLayout>
  );
}
