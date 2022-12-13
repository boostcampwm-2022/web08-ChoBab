import { Oval } from 'react-loader-spinner';

import { LoadingContentsLayout, LoadingSpinnerBox, LoadingMessageParagraph } from './styles';

interface PropType {
  size: string; // 스피너 크기 - large, small
  // eslint-disable-next-line react/require-default-props
  message?: string;
}

function LoadingScreen({ size, message }: PropType) {
  return (
    <LoadingContentsLayout>
      <LoadingSpinnerBox size={size}>
        <Oval
          height={size === 'large' ? 100 : 50}
          width={size === 'large' ? 100 : 50}
          color="#949494"
          wrapperStyle={{}}
          wrapperClass=""
          ariaLabel="loading"
          secondaryColor="#949494"
          strokeWidth={3}
          strokeWidthSecondary={3}
        />
      </LoadingSpinnerBox>
      <LoadingMessageParagraph>{message}</LoadingMessageParagraph>
    </LoadingContentsLayout>
  );
}

export default LoadingScreen;
