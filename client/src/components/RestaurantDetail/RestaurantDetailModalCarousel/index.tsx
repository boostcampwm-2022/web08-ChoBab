import { useState, useRef } from 'react';
import { ImageCarousel, Image, ImageBox } from './styles';

interface PropsType {
  imageUrlList: string[];
}

export function RestaurantDetailCarousel({ imageUrlList }: PropsType) {
  const imageCount = imageUrlList.length;
  const [visibleImageIdx, setVisibleImageIdx] = useState<number>(0);
  const touchPosition = useRef<{ start: number; end: number }>({ start: 0, end: 0 });
  const MIN_SLIDE_UNIT = 50;
  return (
    <ImageCarousel
      onTouchStart={(e) => {
        touchPosition.current.start = e.changedTouches[0].clientX;
      }}
      onTouchEnd={(e) => {
        touchPosition.current.end = e.changedTouches[0].clientX;
        const { start: touchStart, end: touchEnd } = touchPosition.current;
        if (touchStart - touchEnd > MIN_SLIDE_UNIT) {
          setVisibleImageIdx(
            visibleImageIdx < imageCount - 1 ? visibleImageIdx + 1 : visibleImageIdx
          );
          return;
        }
        if (touchEnd - touchStart > MIN_SLIDE_UNIT) {
          setVisibleImageIdx(visibleImageIdx > 0 ? visibleImageIdx - 1 : visibleImageIdx);
          
        }
      }}
    >
      <ImageBox style={{ marginLeft: `-${visibleImageIdx * 100}%` }}>
        {imageUrlList.map((imageUrl) => (
          <Image key={imageUrl} style={{ backgroundImage: `url(${imageUrl})` }} />
        ))}
      </ImageBox>
      <p>{imageCount ? `${visibleImageIdx + 1}/${imageCount}` : `0/0`}</p>
    </ImageCarousel>
  );
}
