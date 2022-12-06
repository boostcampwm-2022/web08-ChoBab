import { useState, useRef } from 'react';
import { ImageCarousel, Image, ImageBox } from './styles';

interface PropsType {
  imageUrlList: string[];
}

export function RestaurantDetailCarousel({ imageUrlList }: PropsType) {
  const imageCount = imageUrlList.length;
  const [visibleImageIdx, setVisibleImageIdx] = useState<number>(0);
  const throttlingTimerRef = useRef<NodeJS.Timer | null>(null);
  const THROTTLINGTIME = 1500;
  return (
    <ImageCarousel
      onWheel={(e) => {
        if (throttlingTimerRef.current) {
          return;
        }
        throttlingTimerRef.current = setTimeout(() => {
          throttlingTimerRef.current = null;
        }, THROTTLINGTIME);
        const isScrollLeft = e.deltaX > 0;
        if (isScrollLeft) {
          setVisibleImageIdx(
            visibleImageIdx < imageCount - 1 ? visibleImageIdx + 1 : visibleImageIdx
          );
          return;
        }
        setVisibleImageIdx(visibleImageIdx > 0 ? visibleImageIdx - 1 : visibleImageIdx);
      }}
    >
      <ImageBox style={{ marginLeft: `-${visibleImageIdx * 100}%` }}>
        {imageUrlList.map((imageUrl) => (
          <Image key={imageUrl} style={{ backgroundImage: `url(${imageUrl})` }} />
        ))}
      </ImageBox>
      <p>{!imageCount ? `${visibleImageIdx + 1}/${imageCount}` : `0/0`}</p>
    </ImageCarousel>
  );
}
