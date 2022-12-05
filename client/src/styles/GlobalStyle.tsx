import styled, { createGlobalStyle } from 'styled-components';
import * as palette from '@styles/Variables';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

export const MainLayout = styled.div`
  width: 100%;
  max-width: 420px;
  height: 100%;
  margin: 0 auto;
  border: 3px solid ${palette.BORDER};
  zoom: 1.25;

  @media (max-width: ${palette.BREAKPOINT_TABLET}) {
    zoom: 0;
    border: 0;
  }
`;

export default GlobalStyle;
