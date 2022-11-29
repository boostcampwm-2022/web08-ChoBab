import styled from 'styled-components';
import * as palette from '@styles/Variables';

export const MainPageLayout = styled.div`
  background-color: blue;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const MapBox = styled.div`
  width: 100%;
  height: 100%;
  z-index: 1;
  position: absolute;
  background-color: white;
  &:focus-visible {
    outline: none;
  }
`;

export const HeaderBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 15%;
  background-color: ${palette.BORDER};
  position: absolute;
  top: 0px;
  z-index: 3;
  display: flex;
`;

export const Header = styled.header`
  background-color: ${palette.PRIMARY};
  width: 100%;
  height: 60%;
  padding: 3% 5%;
`;

export const CategoryToggle = styled.div`
  background-color: white;
  width: 100%;
  height: 40%;
  padding: 1% 3%;
  border: 1px solid ${palette.PRIMARY};
`;
