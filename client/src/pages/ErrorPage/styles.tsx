import styled from 'styled-components';
import * as palette from '@styles/Variables';

export const ErrorPageLayout = styled.div`
  background-color: ${palette.PRIMARY};
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const ErrorBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 1.5rem;
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
