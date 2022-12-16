import styled from 'styled-components';

export const MapBox = styled.div`
  width: 100%;
  height: 70%;
  z-index: 1;

  position: absolute;

  &:focus-visible {
    outline: none;
  }
`;

export const MarkerBox = styled.div`
  z-index: 2;
  position: relative;
  pointer-events: none;
  // 마커 이미지 크기를 고려했을 때, 마커의 끝을 43% 지점에 찍어야 지도 중앙을 가리킴
  top: 43%;
  left: 50%;
`;
