import styled from 'styled-components';
import * as palette from '@styles/Variables';

export const LayerBox = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: ${palette.RESTAURANT_DETAIL_LAYER_Z_INDEX};
`;
