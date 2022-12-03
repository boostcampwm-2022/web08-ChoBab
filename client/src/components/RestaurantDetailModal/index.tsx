import React, { useEffect, useState } from 'react';
import { ReactComponent as BackwardIcon } from '@assets/images/backward-arrow-icon.svg';
import { RestaurantDetailModalFooter } from '@components/RestaurantDetailModal/RestaurantDetailModalFooter';
import { RestaurantDetailModalBody } from '@components/RestaurantDetailModal/RestaurantDetailModalBody';
import { LoadingComponent } from '@components/LoadingComponent';
import { RestaurantDetailCarousel } from '@components/RestaurantDetailModal/RestaurantDetailModalCarousel';
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
          'https://w.namu.la/s/229b93bd8eaaae25da6f41784895671d784988f598388c1419f7b3247f3a225138951c9b4c6c79d50ed3262505766c3212ab00c074f8d51c5281beef7f7b8cb6426c2876a3971743578d50832d0b0cbb938b83d193f896cfe59405fb389046da',
          'https://w.namu.la/s/fe2a2f4481797e81ce0a283cb8de363d4f3fcfc746b1317e0febde46634aea496a91350b279b06ae1def613872eafd36d9d780e3c70f2c2fd0f63cbca992ec3ded4e16acdc4d1e3baeb60b57d50177f2010f8669d0e8d04482718b5c866bb2dd2ddcb2c19080355f7f5945250337f4d6',
          'https://w.namu.la/s/e46ab8199b07958a7c8ee51aa3d7484e64cd32fe75c3af4ceaad1687afd10a2f421f3451d0e1501d07f8d046276a36f91bc2a320cb1d2a2435423581ba802c13261c7c543c8d4f64d82c7f7f38848a0b4d9d970e2c9a7c796b030b9db855d6d9',
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
            <BackwardIcon fill="white" />
          </BackwardButton>
          <AddCandidatesButton>후보 추가</AddCandidatesButton>
          <ModalBox>
            <RestaurantDetailCarousel imageUrlList={restaurantData.imageUrlList} />
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
