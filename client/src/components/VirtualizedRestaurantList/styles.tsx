import styled from 'styled-components';

export const RestaurantFilteredList = styled.ul`
  width: 100%;
`;

export const RestaurantFilteredItem = styled.li`
  /* height: 180px; // 가상화 목록 적용을 위해서는 고정 필요? */
  list-style: none;
  padding-bottom: 5%;
  &:last-child {
    padding-bottom: 0;
  }
`;
