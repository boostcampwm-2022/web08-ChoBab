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
  display: flex;
  justify-content: space-between;
  background-color: ${palette.PRIMARY};
  width: 100%;
  height: 60%;
`;

export const CategoryToggle = styled.div`
  background-color: white;
  width: 100%;
  height: 40%;
  padding: 1% 3%;
  border: 1px solid ${palette.PRIMARY};
`;

export const CandidateListButton = styled.button`
  background-color: ${palette.PRIMARY};
  position: absolute;
  z-index: 3;
  margin-bottom: 10px;
  bottom: 0px;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: none;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const MapOrListButton = styled.button`
  background-color: white;
  position: absolute;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110px;
  height: 36px;
  margin-bottom: 18px;
  margin-right: 8px;
  bottom: 0px;
  right: 0px;
  border: none;
  border-radius: 20px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
  gap: 5px;
  cursor: pointer;
  &img {
    height: 20px;
  }
`;

export const ButtonInnerTextBox = styled.div`
  font-size: 14px;
  font-weight: 500;
`;
