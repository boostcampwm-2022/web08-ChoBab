import styled from 'styled-components';
import * as palette from '@styles/Variables';

export const CandidateRowBox = styled.div`
  width: 100%;
  height: 30%;
  background-color: white;
  box-sizing: border-box;
  border-radius: 10px;
  border: 0.1px solid ${palette.BORDER};
  box-shadow: 0 0 3px 3px ${palette.BORDER};
  flex: none;
  display: flex;
  flex-direction: row;
  padding: 20px 10px;
  align-items: center;
  position: relative;
  gap: 20px;
`;

export const ImageBox = styled.div`
  height: 100px;
  width: 100px;
  background-color: gray;
  border-radius: 10px;
  box-sizing: content-box;
`;

export const ThumbnailImage = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 10px;
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
`;

export const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 50%;
  gap: 10px;
  box-sizing: border-box;
`;

export const NameBox = styled.div`
  width: 100%;
  font-weight: 700;
  height: 15%;
  font-size: 18px;
`;

export const CategoryBox = styled.div`
  width: 100%;
  height: 15%;
`;

export const RatingBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 15%;
  gap: 10px;
`;

export const DistanceBox = styled.div`
  width: 100%;
  height: 15%;
  color: ${palette.PRIMARY};
`;

export const LikeButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 15px;
  right: 15px;
  border-radius: 5px;
  width: 15%;
  height: 15%;
  background-color: white;
  font-size: 10px;
  border: 0.1px solid ${palette.BORDER};
  box-shadow: 0 0 2px 2px ${palette.BORDER};
`;
