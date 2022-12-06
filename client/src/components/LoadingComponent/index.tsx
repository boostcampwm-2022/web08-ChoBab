import { LoadingBox, LoadingLayout } from './styles';

// 음식점 상세 모달을 만들면서 작성한 로딩 화면입니다.
export function LoadingComponent() {
  return (
    <LoadingLayout>
      <LoadingBox
        animate={{
          rotate: [0, 360], // html 태그를 0도를 기준으로 회전시킴
        }}
        transition={{
          repeat: Infinity, // 애니메이션이 생명주기를 반복하게 만듦
          ease: 'easeInOut',
          duration: 1 // 애니메이션의 생명주기
        }}
      >
        loading...
      </LoadingBox>
    </LoadingLayout>
  );
}
