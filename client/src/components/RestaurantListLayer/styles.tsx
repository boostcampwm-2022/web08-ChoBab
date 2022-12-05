import styled from 'styled-components';
import * as palette from '@styles/Variables';

export const LayerBox = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: calc(100% - ${palette.HEADER_HEIGHT_RATIO});
  background: yellow;
  z-index: ${palette.RESTAURANT_LAYER_Z_INDEX};

  overflow-y: scroll;
  &::-webkit-scrollbar {
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    color: ${palette.SCROLL_THUMB_COLOR};
  }
`;
