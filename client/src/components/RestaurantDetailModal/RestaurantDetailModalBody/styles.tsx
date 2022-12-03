import styled from 'styled-components';
import * as palette from '@styles/Variables';

export const ModalBodyLayout = styled.div`
  width: 100%;
  height: 20%;
  padding: 10px 10px;
  box-shadow: 0px 4px 10px rgba(51, 51, 51, 0.1), 0px 0px 4px rgba(51, 51, 51, 0.05);
  box-sizing: border-box;
`;


export const ModalBodyBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const NameBox = styled.div`
  font-size: 20px;
  font-weight: 700;
`;

export const CategoryBox = styled.div`
  font-size: 16px;
`;

export const RatingBox = styled.div``;
