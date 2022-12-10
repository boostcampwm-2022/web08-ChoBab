import styled from 'styled-components';
import * as palette from '@styles/Variables';

export const ModalLayout = styled.div`
  width: 100%;
  height: 100%;
  max-height: 100%;
  position: absolute;
  visibility: visible;
`;

export const BackwardButton = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: ${palette.DETAIL_MODAL_HEADER_BUTTON_LAYOUT_Z_INDEX};
`;

export const VoteButtonLayout = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: ${palette.DETAIL_MODAL_HEADER_BUTTON_LAYOUT_Z_INDEX};
`;

export const ModalBox = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;
