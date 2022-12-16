import { useState, useEffect, useRef, useCallback } from 'react';
import * as palette from '@styles/Variables';
import { ReactComponent as FlagIcon } from '@assets/images/flag.svg';
import { ReactComponent as PhoneIcon } from '@assets/images/phone-icon.svg';
import { ReactComponent as ShortcutIcon } from '@assets/images/shortcut.svg';
import RestaurantDetailDrivingInfo from '@components/RestaurantDetail/RestaurantDetailDrivingInfo';

import {
  MapBox,
  MapLayout,
  ModalBody,
  ModalBodyContent,
  ModalBodyNav,
  RestaurantDetailTable,
} from './styles';

interface PropsType {
  address: string;
  lat: number;
  lng: number;
  phone: string;
  url: string;
}

export function RestaurantDetailBody({ address, lat, lng, phone, url }: PropsType) {
  const restaurantPos = { lat, lng };
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

    const restaurantLocation = new naver.maps.LatLng(lat, lng);

    const map = new naver.maps.Map(mapRef.current, {
      center: restaurantLocation,
      scrollWheel: false,
    });

    const marker = new naver.maps.Marker({
      map,
      position: restaurantLocation,
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
    <ModalBody>
      <ModalBodyNav
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
      </ModalBodyNav>
      {isSelectLeft ? (
        <ModalBodyContent>
          <RestaurantDetailTable>
            <colgroup>
              <col style={{ width: '10%' }} />
              <col style={{ width: '90%' }} />
            </colgroup>
            <tbody>
              <tr>
                <td>
                  <FlagIcon />
                </td>
                <td>
                  <p>{address}</p>
                </td>
              </tr>

              <tr>
                <td>
                  <PhoneIcon />
                </td>
                <td>
                  <p>{phone}</p>
                </td>
              </tr>

              <tr>
                <td>
                  <ShortcutIcon />
                </td>
                <td>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                  </a>
                </td>
              </tr>
            </tbody>
          </RestaurantDetailTable>

          <MapLayout>
            <MapBox ref={mapRef} />
          </MapLayout>
        </ModalBodyContent>
      ) : (
        <ModalBodyContent>
          <RestaurantDetailDrivingInfo restaurantPos={restaurantPos} />
        </ModalBodyContent>
      )}
    </ModalBody>
  );
}
