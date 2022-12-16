import styled from 'styled-components';

// Modal 네이밍 변경 필요
export const ModalBody = styled.div`
  width: 100%;
  height: 35%;
  padding: 30px;
`;

// Modal 네이밍 변경 필요
export const ModalBodyNav = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-content: center;
  border-bottom: 0.1px solid gray;
`;

// Modal 네이밍 변경 필요
export const ModalBodyContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 10px;
  gap: 10px;
`;

export const RestaurantDetailTable = styled.table`
  width: 100%;
  table-layout: fixed;
  tr {
    td:nth-child(1) {
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        height: 26px;
        aspect-ratio: 1/1;
      }
    }
    td:nth-child(2) {
      padding-left: 5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      a {
        color: black;
      }
    }
  }
`;

export const MapLayout = styled.div`
  width: 100%;
  padding: 5px;
`;

export const MapBox = styled.div`
  width: 100%;
  height: 200px;
  border: 0.1px solid gray;
  border-radius: 5px;
`;
