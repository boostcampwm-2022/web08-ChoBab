import React, { useEffect, useRef, useState } from 'react';
import * as palette from '@styles/Variables';
import { ReactComponent as BackwardIcon } from '@assets/images/backward-arrow-icon.svg';
import {
  ImageCarousel,
  ModalBody,
  ModalBox,
  ModalFooter,
  ModalLayout,
  ScrollTest,
  NameBox,
  CategoryBox,
  RatingBox,
  ModalFooterNav,
  AddressBox,
  BackwardButton,
} from './styles';

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
}

function RestaurantDetailModalFooter({ address }: { address: string }) {
  const [isSelectLeft, setSelectLeft] = useState<boolean>(true);
  const operationInfoButtonRef = useRef<HTMLDivElement>(null);
  const getDirectionButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const operationInfoButton = operationInfoButtonRef.current;
    const getDirectionButton = getDirectionButtonRef.current;
    if (!operationInfoButton || !getDirectionButton) {
      return;
    }
    if (!isSelectLeft) {
      getDirectionButton.style.color = palette.PRIMARY;
      operationInfoButton.style.color = 'black';
      return;
    }
    getDirectionButton.style.color = 'black';
    operationInfoButton.style.color = palette.PRIMARY;
  }, [isSelectLeft]);

  return (
    <ModalFooter>
      <ModalFooterNav
        onClick={(e) => {
          if (!(e.target instanceof HTMLDivElement)) {
            return;
          }
          const eventTarget = e.target as HTMLDivElement;
          if (
            eventTarget !== operationInfoButtonRef.current &&
            eventTarget !== getDirectionButtonRef.current
          ) {
            return;
          }
          setSelectLeft(eventTarget === operationInfoButtonRef.current);
        }}
      >
        <div ref={operationInfoButtonRef}>영업 정보</div>
        <div ref={getDirectionButtonRef}>길찾기</div>
      </ModalFooterNav>
      {isSelectLeft ? (
        <ScrollTest>
          <AddressBox>{address}</AddressBox>
        </ScrollTest>
      ) : (
        <ScrollTest>길찾기</ScrollTest>
      )}
    </ModalFooter>
  );
}

export function RestaurantDetailModal() {
  const [restaurantData, setRestaurantData] = useState<RestaurantDataType | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const mockRestaurantData = {
        id: '123456',
        name: '진우동',
        category: '일식',
        address: '경기 성남시 분당구 황새울로335번길 8 덕산빌딩',
        lat: 0,
        lng: 0,
        rating: 4.2,
      };
      setRestaurantData({ ...restaurantData, ...mockRestaurantData });
    }, 3000);
  }, []);

  return (
    <ModalLayout>
      {!restaurantData ? (
        <div>loading...</div>
      ) : (
        <>
          <BackwardButton>
            <BackwardIcon />
          </BackwardButton>
          <ModalBox>
            <ImageCarousel>사진</ImageCarousel>
            <ModalBody>
              <NameBox>{restaurantData.name}</NameBox>
              <CategoryBox>{restaurantData.category}</CategoryBox>
              <RatingBox>
                {!restaurantData.rating ? '평점 정보 없음' : `평점: ${restaurantData.rating}`}
              </RatingBox>
            </ModalBody>
            <RestaurantDetailModalFooter address={restaurantData.address} />
          </ModalBox>
        </>
      )}
    </ModalLayout>
  );
}
