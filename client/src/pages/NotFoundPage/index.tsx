import React from 'react';
import Error from '@components/Error';
import { NotFoundPageLayout } from './styles';

function NotFoundPage() {
  const reason = '존재하지 않는 페이지입니다.';

  return (
    <NotFoundPageLayout>
      <Error reason={reason} />
    </NotFoundPageLayout>
  );
}

export default NotFoundPage;
