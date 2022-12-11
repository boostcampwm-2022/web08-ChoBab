import styled from 'styled-components';
import * as palette from '@styles/Variables';
import { motion } from 'framer-motion';

interface LayerStylePropsType {
  headerHeight: number;
  zIndex: number;
}

export const LayerBox = styled(motion.div)<LayerStylePropsType>`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: calc(100% - ${({ headerHeight }) => `${headerHeight}%`});
  z-index: ${({ zIndex }) => zIndex};
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
