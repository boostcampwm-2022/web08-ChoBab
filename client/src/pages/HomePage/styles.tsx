import styled from 'styled-components';
import * as palette from '@styles/Variables';

export const HomePageLayout = styled.div`
  background-color: ${palette.PRIMARY};
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const HomePageBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 100px;
`;

export const Button = styled.button`
  background: black;
  border: none;
  border-radius: 5px;
  padding: 16px 30px;
  font-size: 14px;
  font-weight: bolder;
  color: white;
  cursor: pointer;
`;

export const FooterBox = styled.button`
  position: absolute;
  bottom: 0;
  background: transparent;
  border: 0;
  p {
    text-align: center;
    margin: 15px 0;
    color: rgba(255, 255, 255, 50%);
  }
`;

export const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ModalLayout = styled.div`
  display: flex;
  visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 60%);
`;

export const ModalBox = styled.div`
  margin: auto;
  display: flex;
  width: 50%;
  height: 20%;
  background-color: ${palette.PRIMARY};
  border: 1px solid ${palette.BORDER};
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;

export const InputButton = styled.button``;
