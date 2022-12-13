import styled from 'styled-components';
import * as palette from '@styles/Variables';

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
