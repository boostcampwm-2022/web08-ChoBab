import React, { useState } from 'react';
import { ModalLayout } from './styles';

export function RestaurantDetailModal() {
  const [isReady, setReady] = useState<boolean>(false);
  return <ModalLayout>
    {isReady?<div>loading...</div>:<div>완료...</div>}
  </ModalLayout>;
}
