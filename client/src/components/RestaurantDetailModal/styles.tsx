import styled from 'styled-components';
import * as palette from '@styles/Variables';

export const ModalLayout = styled.div`
  width: 100%;
  height: 100%;
  max-height: 100%;
  position: absolute;
  visibility: visible;
  z-index: 999; // 음식점 상세정보보다 더 상위에 겹쳐질 요소가 없다고 판단
`;

export const BackwardButton = styled.div`
  position: absolute;
  top:10px;
  left:10px;
`;

export const ModalBox = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  overflow: auto;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const ImageCarousel = styled.div`
  width: 100%;
  height: 45%;
  flex: 2;
`;

export const ModalBody = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: column;
  padding: 10px 10px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0px 4px 10px rgba(51, 51, 51, 0.1), 0px 0px 4px rgba(51, 51, 51, 0.05);
`;

export const NameBox = styled.div`
  font-size: 20px;
  font-weight: 700;
`;

export const CategoryBox = styled.div`
  font-size: 16px;
`;

export const RatingBox = styled.div``;

export const ModalFooter = styled.div`
  width: 100%;
  height: 35%;
  padding: 30px;
`;

export const ModalFooterNav = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-content: center;
  border-bottom: 1px solid;
`;

export const OperationInfoBody = styled.div``;

export const ScrollTest = styled.div`
  width: 100%;
  padding: 20px 10px;
  height: 500px;
`;

export const AddressBox = styled.div``;
