import { ReactComponent as ShareImage } from '@assets/images/share.svg';
import { TOAST_DURATION_TIME, SUCCCESS_COPY_MESSAGE, FAIL_COPY_MESSAGE } from '@constants/toast';
import { useToast } from '@hooks/useToast';
import { ButtonBox } from './styles';

function LinkShareButton() {
  const { fireToast } = useToast();
  const location = window.location.href; // 현재 URL

  const copyClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      fireToast({ content: SUCCCESS_COPY_MESSAGE, duration: TOAST_DURATION_TIME, bottom: 80 });
    } catch (error) {
      fireToast({ content: FAIL_COPY_MESSAGE, duration: TOAST_DURATION_TIME, bottom: 80 });
    }
  };

  const handleClick = () => {
    // Web share API 사용 가능 환경 -> 공유 레이어 띄우기
    if (navigator.share) {
      navigator
        .share({
          title: '[ChoBab] 모임방 링크 : 링크를 통해 모임에 참여하세요!',
          url: location,
        })
        .catch((error) => {
          console.log(error);
        });
      return;
    }
    // Web share API 사용 불가능 환경 -> 클립보드 복사 기능
    copyClipboard(location);
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
