import styled from 'styled-components';
import * as palette from '@styles/Variables';
import { motion } from 'framer-motion';

interface LayerStylePropsType {
  headerHeight: number;
}

export const LayerBox = styled(motion.div)<LayerStylePropsType>`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: calc(100% - ${({ headerHeight }) => `${headerHeight}%`});
  z-index: ${palette.RESTAURANT_LIST_LAYER_Z_INDEX};
  background-color: white;

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
