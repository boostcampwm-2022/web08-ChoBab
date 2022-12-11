import styled from 'styled-components';

interface LoadingSpinnerPropsType {
  type: string; // normal, map
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
  margin-top: ${({ type }) => (type === 'normal' ? '25vh' : '5vh')};
`;

export const LoadingMessageParagraph = styled.p`
  font-size: 1.5rem;
`;
