import styled from 'styled-components';

export const MapLayout = styled.div`
  width: 100%;
  height: 100%;
`;

export const MapLoadingBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

export const MapBox = styled.div`
  width: 100%;
  height: 100%;
  z-index: 1;

  position: absolute;

  &:focus-visible {
    outline: none;
  }
`;
