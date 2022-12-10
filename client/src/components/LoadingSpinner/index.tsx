import { Oval } from 'react-loader-spinner';

import { LoadingContentsLayout, LoadingSpinnerBox, LoadingMessageParagraph } from './styles';

interface PropType {
  type: string; // normal(페이지에서 쓰이는 로더), map(지도 안에서 쓰이는 로더)
  // eslint-disable-next-line react/require-default-props
  message?: string;
}

function LoadingSpinner({ type, message }: PropType) {
  return (
    <LoadingContentsLayout>
      <LoadingSpinnerBox type={type}>
        <Oval
          height={type === 'normal' ? 100 : 50}
          width={type === 'normal' ? 100 : 50}
          color="#949494"
          wrapperStyle={{}}
          wrapperClass=""
          ariaLabel="loading"
          secondaryColor="#949494"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </LoadingSpinnerBox>
      <LoadingMessageParagraph>{message}</LoadingMessageParagraph>
    </LoadingContentsLayout>
  );
}

export default LoadingSpinner;
