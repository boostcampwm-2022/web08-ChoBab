import styled from 'styled-components';
import * as palette from '@styles/Variables';

export const InitRoomPageLayout = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

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

export const FooterBox = styled.div`
  width: 100%;
  height: 35%;
  background-color: white;
  position: absolute;
  bottom: 0px;
  z-index: 3;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  border-top-left-radius: 30px 30px;
  border-top-right-radius: 30px 30px;
  border-top: 2px solid ${palette.BORDER};
`;

export const StartButton = styled.button`
  width: 8rem;
  height: 2.5rem;
  text-align: center;
  text-decoration: none;
  background-color: black;
  color: white;
  cursor: pointer;
  border: none;
  border-radius: 4px;
`;
