import styled from 'styled-components';
import * as palette from '@styles/Variables';

export const FooterBox = styled.div`
  width: 100%;
  height: 35%;
  background-color: white;
  position: absolute;
  bottom: 0px;
  z-index: 3;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  border-top-left-radius: 30px 30px;
  border-top-right-radius: 30px 30px;
  border-top: 2px solid ${palette.BORDER};
`;

export const StartButton = styled.button`
  width: 8rem;
  height: 2.5rem;
  text-align: center;
  text-decoration: none;
  background-color: black;
  color: white;
  cursor: pointer;
  border: none;
  border-radius: 4px;
`;
