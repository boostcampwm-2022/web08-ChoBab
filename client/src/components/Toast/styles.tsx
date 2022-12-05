import styled, { keyframes } from 'styled-components';

// animations
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

interface ToastStylePropsType {
  visible: boolean;
  bottom: number;
}

export const ToastLayout = styled.div<ToastStylePropsType>`
  position: absolute;
  width: 14rem;
  bottom: ${({ bottom }) => bottom}px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 30px;
  padding: 15px 20px;
  text-align: center;

  /* 중앙정렬 */
  left: 50%;
  margin-left: -7rem;

  /* show/hide */
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  animation: ${({ visible }) => (visible ? fadeIn : fadeOut)} 0.15s ease-out;
  transition: visibility 0.15s ease-out;
`;

export const ToastContentSpan = styled.span`
  color: #fff;
  font-size: 0.8rem;
`;
