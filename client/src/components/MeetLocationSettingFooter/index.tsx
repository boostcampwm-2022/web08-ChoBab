import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as SearchImage } from '@assets/images/search.svg';
import { NAVER_ADDRESS } from '@constants/map';
import {
  FAIL_SEARCH_MESSAGE,
  FAIL_UPDATE_ADDR_MESSAGE,
  NO_RESULTS_MESSAGE,
  TOAST_DURATION_TIME,
} from '@constants/toast';
import { useMeetLocationStore } from '@store/index';
import { useToast } from '@hooks/useToast';

import { apiService } from '@apis/index';
import { URL_PATH } from '@constants/url';
import { AddressBox, FooterBox, GuideTextBox, SearchBarBox, StartButton } from './styles';

function MeetLocationSettingFooter() {
  const [address, setAddress] = useState<string>(NAVER_ADDRESS);
  const [isCreateRoomLoading, setCreateRoomLoading] = useState<boolean>(false);
  const { meetLocation, updateMeetLocation } = useMeetLocationStore((state) => state);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { fireToast } = useToast();

  // 좌표 -> 주소 변환 & setAddress
  const updateAddress = (lat: number, lng: number) => {
    naver.maps.Service.reverseGeocode(
      {
        coords: new naver.maps.LatLng(lat, lng),
        orders: [naver.maps.Service.OrderType.ROAD_ADDR, naver.maps.Service.OrderType.ADDR].join(
          ','
        ),
      },
      // eslint-disable-next-line consistent-return
      (status, response) => {
        if (status !== naver.maps.Service.Status.OK) {
          fireToast({
            content: FAIL_UPDATE_ADDR_MESSAGE,
            duration: TOAST_DURATION_TIME,
            bottom: 280,
          });
          return;
        }

        setAddress(response.v2.address.roadAddress || response.v2.address.jibunAddress);
      }
    );
  };

  // 모임 위치(전역 상태) 변경 시 주소 업데이트
  useEffect(() => {
    if (!meetLocation) {
      return;
    }
    updateAddress(meetLocation.lat, meetLocation.lng);
  }, [meetLocation]);

  const handleClick = () => {
    if (!inputRef.current) {
      return;
    }

    const searchWord = inputRef.current.value;

    naver.maps.Service.geocode(
      {
        query: searchWord,
      },
      // eslint-disable-next-line func-names, consistent-return
      function (status, response) {
        if (status !== naver.maps.Service.Status.OK) {
          fireToast({
            content: FAIL_SEARCH_MESSAGE,
            duration: TOAST_DURATION_TIME,
            bottom: 280,
          });
          return;
        }

        const result = response.v2; // 검색 결과의 컨테이너
        const items = result.addresses; // 검색 결과의 배열

        if (items.length === 0) {
          fireToast({ content: NO_RESULTS_MESSAGE, duration: TOAST_DURATION_TIME, bottom: 280 });
          return;
        }

        // 첫번째 검색 결과로 처리
        const firstSearchResult = items[0];
        updateMeetLocation(+firstSearchResult.y, +firstSearchResult.x);
      }
    );
  };

  const initRoom = async () => {
    if (!meetLocation) {
      return;
    }
    const { lat, lng } = meetLocation;
    setCreateRoomLoading(true);
    try {
      const roomCode = await apiService.postRoom(lat, lng);

      navigate(`${URL_PATH.JOIN_ROOM}/${roomCode}`);
    } catch (error: any) {
      if (error.response.status === 500) {
        navigate(URL_PATH.INTERNAL_SERVER_ERROR);
        return;
      }
      navigate(URL_PATH.FAIL_CREATE_ROOM);
    }
  };

  return (
    <FooterBox>
      <GuideTextBox>
        <p>
          <strong>모임 위치를 정해주세요!</strong>
        </p>
      </GuideTextBox>

      <SearchBarBox>
        <input ref={inputRef} type="text" placeholder="주소 검색" />
        <button type="button" onClick={handleClick}>
          <SearchImage />
        </button>
      </SearchBarBox>

      <AddressBox>{address}</AddressBox>

      <StartButton
        title="시작하기"
        disabled={isCreateRoomLoading}
        onClick={(e) => {
          if (isCreateRoomLoading) {
            return;
          }
          e.preventDefault();
          initRoom();
        }}
      >
        {isCreateRoomLoading ? '모임 생성 중...' : '시작하기'}
      </StartButton>
    </FooterBox>
  );
}

export default MeetLocationSettingFooter;
