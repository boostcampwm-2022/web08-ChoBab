import styled from 'styled-components';

export const ModalBody = styled.div`
  width: 100%;
  height: 35%;
  padding: 30px;
`;

export const ModalBodyNav = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-content: center;
  border-bottom: 0.1px solid gray;
`;

export const ModalBodyContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 10px;
  gap: 10px;
`;

export const AddressBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  svg {
    height: 22px;
  }
`;

export const IconBox = styled.div`
  width: 26px;
  height: 26px;
`;

export const PhoneBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  svg {
    height: 22px;
  }
`;

export const MapLayout = styled.div`
  width: 100%;
  padding: 5px;
`;

export const MapBox = styled.div`
  width: 100%;
  height: 200px;
  border: 0.1px solid gray;
  border-radius: 5px;
`;
