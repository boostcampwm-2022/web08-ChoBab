import styled from 'styled-components';
import { motion } from 'framer-motion';

export const CandidateListModalLayout = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 85%;
  background-color: white;
  z-index: 990;
  overflow: hidden;
`;

export const CandidateListModalBox = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;
