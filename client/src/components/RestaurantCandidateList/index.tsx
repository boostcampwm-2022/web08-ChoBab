import { useEffect, useState, useRef } from 'react';

import RestaurantRow from '@components/RestaurantRow';
import { RESTAURANT_LIST_TYPES } from '@constants/modal';
import { useSocketStore } from '@store/socket';

import { Socket } from 'socket.io-client';
import { CandidateListModalBox, CandidateListModalLayout } from './styles';

interface CandidateType extends RestaurantType {
  count?: number;
}

interface PropsType {
  restaurantData: CandidateType[];
}

interface VoteDataType {
  restaurantId: string;
  count: number;
}
interface VoteResultType {
  message: string;
  data?: { candidateList: VoteDataType[] };
}

export function CandidateListModal({ restaurantData }: PropsType) {
  const { socket } = useSocketStore((state) => state);
  const voteList = useRef<VoteDataType[]>([]);
  const [candidateData, setCandidateData] = useState<CandidateType[]>([]); // 투표된 음식점의 정보 데이터

  if (!(socket instanceof Socket)) {
    throw new Error();
  }

  const makeCandidateData = (candidateList: VoteDataType[]) => {
    voteList.current = candidateList;
    let tempList: CandidateType[] = [];

    // voteList에 있는 후보 음식점들의 상세정보를 candidateData에 세팅
    restaurantData.forEach((restaurantItem) => {
      voteList.current.forEach((voteItem: VoteDataType) => {
        if (restaurantItem.id === voteItem.restaurantId) {
          // 좋아요 수 렌더링을 위해 음식점 상세정보에 투표 count값 추가
          // eslint-disable-next-line no-param-reassign
          restaurantItem.count = voteItem.count;
          tempList = [...tempList, restaurantItem];
        }
      });
    });

    return tempList;
  };

  useEffect(() => {
    // 투표 결과 요청
    socket.emit('getVoteResult');
    socket.on('currentVoteResult', (result: VoteResultType) => {
      if (!result.data) {
        return;
      }

      setCandidateData(makeCandidateData(result.data?.candidateList));
    });

    // 투표 결과 업데이트 (다른 참여자가 투표하는 경우 발생)
    socket.on('voteResultUpdate', (result: VoteResultType) => {
      if (!result.data) {
        return;
      }

      setCandidateData(makeCandidateData(result.data?.candidateList));
    });
  }, []);

  return (
    <CandidateListModalLayout>
      <CandidateListModalBox>
        {candidateData.map((candidate: CandidateType) => (
          <RestaurantRow
            key={candidate.id}
            restaurant={candidate}
            restaurantListType={RESTAURANT_LIST_TYPES.candidate}
            likeCnt={candidate.count}
          />
        ))}
      </CandidateListModalBox>
    </CandidateListModalLayout>
  );
}
