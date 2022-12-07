import styled from 'styled-components';
import * as palette from '@styles/Variables';
import { motion } from 'framer-motion';

interface VoteButtonPropsType {
  isVoted?: boolean;
  onClick: React.MouseEventHandler;
}

export const VoteLayout = styled(motion.div)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 15px;
  right: 15px;
  width: 3.2rem;
  height: 1.5rem;
`;

export const VoteButton = styled.button<VoteButtonPropsType>`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;

  background-color: ${({ isVoted }) => (isVoted ? palette.BUTTON_COLOR_GREEN : palette.PRIMARY)};
  font-size: 10px;
  border-radius: 10px;
  color: white;

  box-shadow: 0 0 1px 1px ${palette.BORDER};

  z-index: 1000;
`;

export const LikeButton = styled.button``;
