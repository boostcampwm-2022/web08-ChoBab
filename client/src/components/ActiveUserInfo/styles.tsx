import styled from 'styled-components';
import * as palette from '@styles/Variables';

export const ActiveUserInfoLayout = styled.div`
  height: 100%;
`;

export const ListToggleButton = styled.button`
  border: none;
  background: none;
  height: 100%;
  aspect-ratio: 1 / 1;
  cursor: pointer;
`;

export const ActiveUserInfoBox = styled.div`
  // TODO: 색상변수 정리 필요
  background-color: white;
  font-size: 11px;
  padding: 10px;
  width: 220px;
  max-height: 200px;
  overflow-y: scroll;
  box-shadow: 0px 4px 4px rgba(104, 94, 94, 0.25), inset 0px 4px 4px rgba(0, 0, 0, 0.25);

  &::-webkit-scrollbar {
    width: 8px;
    background-color: #dfdfdf;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #a3a3a3;
    border-radius: 4px;
  }
`;

export const ActiveUserInfoList = styled.ul``;

export const ActiveUserInfoItem = styled.li`
  display: flex;
  list-style: none;
  align-items: center;
  margin: 10px 0;
`;

export const ActiveUserIconBox = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 100px;
  background-color: gray;
  margin-right: 5px;
`;