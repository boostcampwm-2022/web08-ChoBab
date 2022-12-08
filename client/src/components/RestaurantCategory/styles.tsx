import styled from 'styled-components';

export const RestaurantCategoryLayout = styled.div`
  width: 100%;
  height: 100%;
`;

export const RestaurantCategoryControlBarBox = styled.div`
  display: flex;
  align-items: center;

  width: 100%;
  height: 100%;

  p {
    width: 80%;
  }

  button {
    width: 20%;
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
