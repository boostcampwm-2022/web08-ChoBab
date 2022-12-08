import RestaurantRow from '@components/RestaurantRow';
import { RESTAURANT_LIST_TYPES } from '@constants/modal';
import { useSocketStore } from '@store/socket';
import { useVotedRestaurantListStore } from '@store/vote';
import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
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
  candidateData: RestaurantType[];
}

interface ResultType {
  message: string;
  data?: { candidateList: { restaurantId: string; count: number }[] };
}
class CandidateMap {
  [key: string]: CandidateType;
}

export function CandidateListModal({ candidateData }: PropsType) {
  const { socket } = useSocketStore((state) => state);

  if (!(socket instanceof Socket)) {
    throw new Error();
  }

  useEffect(() => {
    // getVoteResult 필요
  }, []);

  socket.on('voteResultUpdate', (result: ResultType) => {
    console.log('투표 결과 업데이트됨');
    console.log(result);
  });

  // 여기서 업데이트도 필요하지만, 요청하면 주는 것도 필요할 듯..?

  return (
    <CandidateListModalLayout>
      <CandidateListModalBox>
        {candidateData.map((candidate) => (
          <RestaurantRow
            key={candidate.id}
            restaurant={candidate}
            restaurantListType={RESTAURANT_LIST_TYPES.candidate}
          />
        ))}
      </CandidateListModalBox>
    </CandidateListModalLayout>
  );
}
