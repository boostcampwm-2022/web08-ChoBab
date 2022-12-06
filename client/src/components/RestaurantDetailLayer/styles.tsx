import styled from 'styled-components';
import * as palette from '@styles/Variables';

export const LayerBox = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: yellow;
  z-index: ${palette.RESTAURANT_DETAIL_LAYER_Z_INDEX};

  overflow-y: scroll;
  &::-webkit-scrollbar {
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    color: ${palette.SCROLL_THUMB_COLOR};
  }
`;
