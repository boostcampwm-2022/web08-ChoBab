import styled from 'styled-components';
import * as palette from '@styles/Variables';

export const RestaurantCategoryLayout = styled.div`
  width: 100%;
  height: 100%;
`;

export const RestaurantCategoryControlBarBox = styled.div`
  display: flex;
  align-items: center;

  width: 100%;
  height: 100%;
`;

export const RestaurantCategoryGuideParagraph = styled.p`
  width: 85%;
  padding-left: 3%;
`;

interface CategoryToggleButtonStateType {
  isOpen: boolean;
}

export const RestaurantCategoryToggleButton = styled.div<CategoryToggleButtonStateType>`
  width: 15%;
  height: 100%;
  background: none;

  border: 0;
  border-left: 1px solid ${palette.PRIMARY};

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    transform: rotate(${({ isOpen }) => (isOpen ? '-180deg' : '0')});
  }
`;

export const RestaurantCategoryBox = styled.div`
  height: 50px; // 임시값

  position: absolute;

  top: 1px; // category shell border 1px
  left: 0;
  right: 0;

  background: yellow;
`;
