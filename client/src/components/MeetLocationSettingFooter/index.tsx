import React, { useEffect, useState } from 'react';
import { ReactComponent as SearchImage } from '@assets/images/search.svg';
import { NAVER_ADDRESS } from '@constants/map';
import { useMeetLocationStore } from '@store/index';

import { FooterBox, StartButton } from './styles';

function MeetLocationSettingFooter() {
  const [address, setAddress] = useState<string>(NAVER_ADDRESS);
  const { meetLocation, updateMeetLocation } = useMeetLocationStore((state) => state);

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

  const onClickSearch = () => {
    console.log('검색 버튼 클릭');

    naver.maps.Service.geocode(
      {
        query: '강남',
      },
      // eslint-disable-next-line func-names, consistent-return
      function (status, response) {
        if (status !== naver.maps.Service.Status.OK) {
          return alert('Something wrong!');
        }

        const result = response.v2; // 검색 결과의 컨테이너
        const items = result.addresses; // 검색 결과의 배열
        console.log(items);

        // do Something
      }
    );
  };

  const onInputSearch = () => {
    console.log('검색창 입력');
  };

  return (
    <FooterBox>
      <span>
        <p>모임 위치를 정해주세요!</p>
        <p>(추후 수정 가능합니다.)</p>
      </span>
      <div>
        <input type="search" placeholder="위치 검색" onChange={onInputSearch} />
        <button type="button" onClick={onClickSearch}>
          <SearchImage />
        </button>
      </div>
      <div>{address}</div>
      <StartButton title="시작하기">시작하기</StartButton>
    </FooterBox>
  );
}

export default MeetLocationSettingFooter;
