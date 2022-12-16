import styled from 'styled-components';

export const ImageCarouslLayout = styled.div`
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

export const ImageCarouslBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

export const ImageBox = styled.div`
  width: 100%;
  height: 100%;
  flex: none;
  position: relative;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  background-position: 50% 50%;
  object-fit: cover;
  background-repeat: no-repeat;
`;

export const ImageFakeBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 100%;
    height: 100%;
  }
`;
