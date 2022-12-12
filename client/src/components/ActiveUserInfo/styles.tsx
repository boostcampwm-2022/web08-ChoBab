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
  box-shadow: 0px 4px 4px rgba(104, 94, 94, 0.25), inset 0px 4px 4px rgba(0, 0, 0, 0.25);

  overflow-y: overlay;
  &::-webkit-scrollbar {
    width: 8px;
    background-color: ${palette.SCROLL_BAR_COLOR};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${palette.SCROLL_THUMB_COLOR};
    border-radius: 4px;
  }
`;

export const ActiveUserInfoList = styled.ul`
  li {
    list-style: none;
  }
`;

export const ActiveUserInfoItem = styled.li`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

export const ActiveUserIconBox = styled.div`
  width: 10px;
  height: 10px;
  margin: 5px;
  border-radius: 100px;
  background-color: gray;
  margin-right: 5px;
`;
