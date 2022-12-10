import React from 'react';
import { Link } from 'react-router-dom';
import { URL_PATH } from '@constants/url';
import { Button, ErrorBox, ErrorPageLayout } from './styles';

interface PropsType {
  reason: string;
}

function ErrorPage({ reason }: PropsType) {
  return (
    <ErrorPageLayout>
      <ErrorBox>
        <h3>{reason}</h3>
        <Link to={URL_PATH.HOME}>
          <Button>홈으로 가기</Button>
        </Link>
      </ErrorBox>
    </ErrorPageLayout>
  );
}

export default ErrorPage;
