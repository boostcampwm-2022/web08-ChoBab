import styled from 'styled-components';

interface LoadingSpinnerPropsType {
  size: string;
}

export const LoadingContentsLayout = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

export const LoadingSpinnerBox = styled.div<LoadingSpinnerPropsType>`
  margin-top: ${({ size }) => (size === 'large' ? '25vh' : '5vh')};
`;

export const LoadingMessageParagraph = styled.p`
  font-size: 1.5rem;
`;
