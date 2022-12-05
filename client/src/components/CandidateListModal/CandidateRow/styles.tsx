import styled from 'styled-components';

export const CandidateRowBox = styled.div`
  width: 100%;
  height: 30%;
  background-color: aliceblue;
  box-sizing: border-box;
  border-radius: 10px;
  flex: none;
  display: flex;
  flex-direction: row;
  padding: 10px;
  align-items: center;
`;

export const ImageBox = styled.div`
  height: 100px;
  width: 100px;
  background-color: gray;
  border-radius: 10px;
`

export const ThumbnailImage = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 10px;
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
`;
