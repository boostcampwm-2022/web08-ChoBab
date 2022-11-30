import React, { useEffect, useState, useRef } from 'react';
import { ReactComponent as SearchImage } from '@assets/images/search.svg';
import { NAVER_ADDRESS } from '@constants/map';
import { useMeetLocationStore } from '@store/index';

import { FooterBox, SearchBarBox, StartButton } from './styles';

function MeetLocationSettingFooter() {
  const [address, setAddress] = useState<string>(NAVER_ADDRESS);
  const { meetLocation, updateMeetLocation } = useMeetLocationStore((state) => state);
  const inputRef = useRef<HTMLInputElement>(null);

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
          alert('주소 변환 실패');
        }

        setAddress(response.v2.address.roadAddress || response.v2.address.jibunAddress);
      }
    );
  };

  // 모임 위치(전역 상태) 변경 시 주소 업데이트
  useEffect(() => {
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
          return alert('검색 실패');
        }

        const result = response.v2; // 검색 결과의 컨테이너
        const items = result.addresses; // 검색 결과의 배열

        if (items.length === 0) {
          // TODO: 추후 토스트 알림으로 변경
          return alert('검색결과가 없습니다.');
        }

        // 첫번째 검색 결과로 처리
        const firstSearchResult = items[0];
        updateMeetLocation(+firstSearchResult.y, +firstSearchResult.x);
      }
    );
  };

  return (
    <FooterBox>
      <span>
        <p>모임 위치를 정해주세요!</p>
        <p>(추후 수정 가능합니다.)</p>
      </span>
      <SearchBarBox>
        <input ref={inputRef} type="text" placeholder="주소 검색" />
        <button type="button" onClick={handleClick}>
          <SearchImage />
        </button>
      </SearchBarBox>
      <div>{address}</div>
      <StartButton title="시작하기">시작하기</StartButton>
    </FooterBox>
  );
}

export default MeetLocationSettingFooter;
