import React from 'react';
import { Link } from 'react-router-dom';
import { ErrorBox, Button } from './styles';

interface PropsType {
  reason: string;
}

function Error({ reason }: PropsType) {
  return (
    <ErrorBox>
      <h3>{reason}</h3>
      <Link to="/">
        <Button>홈으로 가기</Button>
      </Link>
    </ErrorBox>
  );
}

export default Error;
