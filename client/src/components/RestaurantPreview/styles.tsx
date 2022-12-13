import styled from 'styled-components';
import * as palette from '@styles/Variables';
import { motion } from 'framer-motion';

export const RestaurantPreviewLayout = styled.div`
  z-index: ${palette.MAP_CONTROLLER_Z_INDEX};
`;

export const RestaurantPreviewBox = styled(motion.div)`
  width: 100%;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  padding: 1% 3% 2% 3%;
`;
