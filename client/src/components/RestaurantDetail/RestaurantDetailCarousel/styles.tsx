import styled from 'styled-components';

export const ImageCarousel = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 45%;
  background-color: black;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
  p {
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: white;
  }
`;

export const ImageBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

export const Image = styled.div`
  width: 100%;
  height: 100%;
  flex: none;
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
`;
