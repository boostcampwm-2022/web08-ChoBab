import styled from 'styled-components';

export const RestaurantFilteredBox = styled.div`
  width: 100%;
  height: 100%;
  padding: 10% 5%;
  background-color: white;
`;

export const RestaurantFilteredList = styled.ul`
  width: 100%;
`;

export const RestaurantFilteredItem = styled.li`
  list-style: none;
  padding-bottom: 5%;
  &:last-child {
    padding-bottom: 0;
  }
`;

export const RestaurantFilteredGuideBox = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const RestaurantFilteredParagraph = styled.p`
  font-size: 10rem;
  font-weight: bold;
`;
