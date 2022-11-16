import styled from 'styled-components';
import * as palette from '../../assets/styles/Variables';

export const MainWrapper = styled.div`
  background-color: ${palette.PRIMARY};
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 100px;
`;

export const Logo = styled.div`
  color: white;
  font-size: 60px;
  font-weight: bolder;
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
