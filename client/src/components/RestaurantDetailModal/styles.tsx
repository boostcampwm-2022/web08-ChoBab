import styled from 'styled-components';
import * as palette from '@styles/Variables';
import { motion } from 'framer-motion';

export const ModalLayout = styled(motion.div)`
  width: 100%;
  height: 100%;
  max-height: 100%;
  position: absolute;
  visibility: visible;
  z-index: 998; // 음식점 상세정보보다 더 상위에 겹쳐질 요소가 없다고 판단
`;

export const BackwardButton = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
`;

export const AddCandidatesButton = styled.div`
  position: absolute;
  top:10px;
  right: 10px;
  display: flex;
  height: 20px;
  width: 60px;
  background-color: ${palette.PRIMARY};
  border-radius: 10px;
  font-size: 12px;
  justify-content: center;
  align-items: center;
  color:white;
  z-index: 999;
`;

export const ModalBox = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;
