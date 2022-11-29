import React, { useEffect, useState, useRef } from 'react';
import { ReactComponent as SearchImage } from '@assets/images/search.svg';
import { NAVER_ADDRESS } from '@constants/map';
import { useMeetLocationStore } from '@store/index';

import { FooterBox, SearchBarBox, StartButton } from './styles';

function MeetLocationSettingFooter() {
  const [address, setAddress] = useState<string>(NAVER_ADDRESS);
  const { meetLocation, updateMeetLocation } = useMeetLocationStore((state) => state);
  const textRef = useRef('');

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
    if (!textRef.current) {
      return;
    }
    naver.maps.Service.geocode(
      {
        query: textRef.current,
      },
      // eslint-disable-next-line func-names, consistent-return
      function (status, response) {
        if (status !== naver.maps.Service.Status.OK) {
          return alert('검색 실패');
        }

        const result = response.v2; // 검색 결과의 컨테이너
        const items = result.addresses; // 검색 결과의 배열

        if (items.length === 0) {
          // TODO: 어떻게 처리할지 합의 필요
          return alert('검색결과가 없습니다.');
        }

        // 첫번째 검색 결과로 처리
        const firstSearchResult = items[0];
        updateMeetLocation(+firstSearchResult.y, +firstSearchResult.x);
      }
    );
  };

  const handleInput: React.KeyboardEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    textRef.current = target.value;
  };

  return (
    <FooterBox>
      <span>
        <p>모임 위치를 정해주세요!</p>
        <p>(추후 수정 가능합니다.)</p>
      </span>
      <SearchBarBox>
        <input type="text" placeholder="주소 검색" onKeyUp={handleInput} />
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
