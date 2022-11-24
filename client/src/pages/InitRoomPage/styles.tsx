import styled from 'styled-components';

export const InitRoomPageLayout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:focus-visible {
    outline: none;
  }
  z-index: 1;
`;

export const MarkerBox = styled.div`
  z-index: 2;
  /* margin 들어간 이유: 현재 깃발 마커 이미지 크기에 따라 중심 위치를 네이버 마커와 맞추기 위해 */
  margin-left: 26px;
  margin-bottom: 34px;
`;
