import React from 'react';
import { ReactComponent as ShareImage } from '@assets/images/share.svg';

import { ButtonBox } from './styles';

function LinkShareButton() {
  const handleClick = () => {
    // Web share API 사용 가능 환경 -> 공유 레이어 띄우기
    if (navigator.share) {
      navigator
        .share({
          title: '[ChoBab] 모임방 링크 : 링크를 통해 모임에 참여하세요!',
          url: 'https://shinsangeun.github.io',
        })
        .catch((error) => {
          console.log(error);
        });
    }
    // Web share API 사용 불가능 환경 -> 클립보드 복사 기능
    else {
      console.log('다른 복사 기능 등 넣기');
      alert('공유하기가 지원되지 않는 환경 입니다.');
    }
  };

  return (
    <ButtonBox>
      <button type="button" onClick={handleClick}>
        <ShareImage />
      </button>
    </ButtonBox>
  );
}

export default LinkShareButton;
