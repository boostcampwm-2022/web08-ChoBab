import styled from 'styled-components';
import * as palette from '@styles/Variables';
import {motion} from 'framer-motion';

export const LayerBox = styled(motion.div)`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: calc(100% - ${palette.HEADER_HEIGHT_RATIO});
  z-index: ${palette.RESTAURANT_LAYER_Z_INDEX};

  overflow-y: overlay;
  &::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${palette.SCROLL_THUMB_COLOR};
    border-radius: 4px;
  }
`;
