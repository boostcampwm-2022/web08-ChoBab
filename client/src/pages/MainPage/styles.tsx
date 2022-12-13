import styled from 'styled-components';
import * as palette from '@styles/Variables';

export const MainPageLayout = styled.div`
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
  &:focus-visible {
    outline: none;
  }
`;

export const HeaderBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: ${palette.HEADER_HEIGHT_RATIO}%;
  background-color: ${palette.BORDER};
  position: absolute;
  top: 0px;
  z-index: ${palette.HEADER_Z_INDEX};
  display: flex;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  background-color: ${palette.PRIMARY};
  width: 100%;
  height: 100%;
`;

export const CategoryBox = styled.div`
  position: absolute;
  top: ${palette.HEADER_HEIGHT_RATIO}%;
  width: 100%;
  height: ${palette.CATEGORY_HEIGHT_RATIO}%;
  background-color: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  z-index: ${palette.CATEGORY_Z_INDEX};
`;

export const CandidateListButton = styled.button`
  background-color: ${palette.PRIMARY};
  position: absolute;
  z-index: ${palette.CONTROLLER_Z_INDEX};
  margin-bottom: 10px;
  left: calc(50% - 55px / 2);
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
  z-index: ${palette.CONTROLLER_Z_INDEX};
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

export const FooterBox = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
`;

export const ControllerBox = styled.div`
  position: relative;
`;
