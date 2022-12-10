import styled from 'styled-components';

export const CandidateListModalLayout = styled.div`
  width: 100%;
  height: 100%;
  padding: 10% 5%;
  background-color: white;
`;

export const CandidateListModalBox = styled.div`
  width: 100%;
`;

export const CandidateItem = styled.li`
  list-style: none;
  padding-bottom: 5%;
  &:last-child {
    padding-bottom: 0;
  }
`;
