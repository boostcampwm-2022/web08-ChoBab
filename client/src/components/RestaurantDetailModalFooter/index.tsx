import { useState, useEffect, useRef, useCallback } from 'react';
import * as palette from '@styles/Variables';
import { ReactComponent as MarkerIcon } from '@assets/images/marker.svg';
import { ReactComponent as PhoneIcon } from '@assets/images/phone-icon.svg';
import {
  AddressBox,
  IconBox,
  MapBox,
  MapLayout,
  ModalFooter,
  ModalFooterBody,
  ModalFooterNav,
  PhoneBox,
} from './styles';

interface PropsType {
  id: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
}

export function RestaurantDetailModalFooter({ id, address, lat, lng, phone }: PropsType) {
  const [isSelectLeft, setSelectLeft] = useState<boolean>(true);
  const operationInfoButtonRef = useRef<HTMLDivElement>(null);
  const getDirectionButtonRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapSetting = useCallback(() => {
    if (!isSelectLeft) {
      return;
    }
    if (!mapRef.current) {
      return;
    }
    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(lat, lng),
      scrollWheel: false,
    });
    const marker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(lat, lng),
    });
  }, [isSelectLeft]);

  useEffect(() => {
    const operationInfoButton = operationInfoButtonRef.current;
    const getDirectionButton = getDirectionButtonRef.current;
    if (!operationInfoButton || !getDirectionButton) {
      return;
    }
    mapSetting();
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
        <ModalFooterBody>
          <AddressBox>
            <IconBox>
              <MarkerIcon />
            </IconBox>
            <p>{address}</p>
          </AddressBox>
          <PhoneBox>
            <IconBox>
              <PhoneIcon />
            </IconBox>
            <p>{phone}</p>
          </PhoneBox>
          <MapLayout>
            <MapBox ref={mapRef} />
          </MapLayout>
        </ModalFooterBody>
      ) : (
        <ModalFooterBody>길찾기</ModalFooterBody>
      )}
    </ModalFooter>
  );
}
