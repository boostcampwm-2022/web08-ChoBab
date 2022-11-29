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
  /* TODO: (수정 필요) margin: 현재 깃발 마커 이미지 크기에 따라 중심 위치를 네이버 마커와 맞추기 위해 */
  /* margin-left: 26px; */
  /* margin-bottom: 34px; */
  position: absolute;
  top: 50%;
  left: 50%;
`;
