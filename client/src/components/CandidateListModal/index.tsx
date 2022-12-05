import { useEffect, useState } from 'react';
import { CandidateRow } from './CandidateRow';
import { CandidateListModalBox, CandidateListModalLayout } from './styles';

interface CandidateType {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  like: number;
  rating?: number;
  thumbnailImage?: string;
}

interface PropsType {
  roomLat: number;
  roomLng: number;
}

class CandidateMap {
  [key: string]: CandidateType;
}

export function CandidateListModal({ roomLat, roomLng }: PropsType) {
  const [candidateMap, setCandidateMap] = useState<CandidateMap>({});

  useEffect(() => {
    // 이후 실제 데이터를 가져오는 로직이 이를 대신해야합니다.
    const mockData = {
      asdv123: {
        id: 'asdv123',
        name: 'BHC',
        category: '치킨',
        lat: 37.2480099,
        lng: 127.0765416,
        like: 3,
        rating: 4.5,
        thumbnailImage:
          'https://upload.wikimedia.org/wikipedia/commons/2/20/Korean_fried_chicken_3_banban.jpg',
      },
      vjfnkj3: {
        id: 'asdv123',
        name: 'BHC',
        category: '치킨',
        lat: 38,
        lng: 127,
        like: 3,
        rating: 4.5,
      },
      fghkjgh4w: {
        id: 'fghkjgh4w',
        name: 'BHC',
        category: '치킨',
        lat: 38,
        lng: 127,
        like: 3,
        rating: 4.5,
        thumbnailImage:
          'https://upload.wikimedia.org/wikipedia/commons/2/20/Korean_fried_chicken_3_banban.jpg',
      },
      asdhwyqig: {
        id: 'asdhwyqig',
        name: 'BHC',
        category: '치킨',
        lat: 38,
        lng: 127,
        like: 3,
        rating: 4.5,
      },
      fhj3hf79: {
        id: 'fhj3hf79',
        name: 'BHC',
        category: '치킨',
        lat: 38,
        lng: 127,
        like: 3,
        rating: 4.5,
      },
      sadjkjh3: {
        id: 'sadjkjh3',
        name: 'BHC',
        category: '치킨',
        lat: 38,
        lng: 127,
        like: 3,
        rating: 4.5,
      },
    };
    setTimeout(() => {
      setCandidateMap({ ...candidateMap, ...mockData });
    }, 1000);
  }, []);
  return (
    <CandidateListModalLayout
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: '9%' }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{
        duration: 0.5,
      }}
    >
      <CandidateListModalBox>
        {Object.keys(candidateMap).map((id) => (
          <CandidateRow key={id} candidateRestaurant={candidateMap[id]} />
        ))}
      </CandidateListModalBox>
    </CandidateListModalLayout>
  );
}
