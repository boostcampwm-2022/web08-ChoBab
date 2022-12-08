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
  position: absolute;

  top: 1px; // category shell border 1px
  left: 0;
  right: 0;

  padding: 3%;

  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
`;

export const RestaurantCategoryList = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

interface SelectedCategoryType {
  isSelect: boolean;
}

export const RestaurantCategoryItem = styled.li<SelectedCategoryType>`
  list-style: none;
  width: 20%;
  border: 1px solid ${palette.BORDER};
  border-radius: 5px;
  margin: 2%;
  text-align: center;
  padding: 2% 1%;
  background-color: ${({ isSelect }) => (isSelect ? palette.PRIMARY : 'transparent')};
  color: ${({ isSelect }) => (isSelect ? 'white' : 'black')};
`;
