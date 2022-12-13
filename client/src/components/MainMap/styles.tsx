import styled from 'styled-components';
import * as palette from '@styles/Variables';

export const MapLayout = styled.div`
  width: 100%;
  height: 100%;
`;

export const MapLoadingBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
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

export const MapControlBox = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  margin: 0 0 18px 8px;
  z-index: ${palette.MAP_CONTROLLER_Z_INDEX};
  gap: 10px;
  display: flex;
  flex-direction: column;

  button {
    width: 40px;
    height: 40px;
    background-color: white;
    border: none;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 4px rgb(0 0 0 / 50%);
  }
`;
