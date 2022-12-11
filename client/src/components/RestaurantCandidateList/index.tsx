import { useEffect, useState } from 'react';

import RestaurantRow from '@components/RestaurantRow';
import { RESTAURANT_DETAIL_TYPES, RESTAURANT_LIST_TYPES } from '@constants/modal';

import { useSocketStore } from '@store/socket';
import { Socket } from 'socket.io-client';
import EmptyListPlaceholder from '@components/EmptyListPlaceholder';
import { useRestaurantDetailLayerStatusStore, useSelectedRestaurantDataStore } from '@store/index';
import { CandidateItem, CandidateListModalBox, CandidateListModalLayout } from './styles';

interface CandidateType extends RestaurantType {
  count?: number;
}

interface PropsType {
  restaurantData: RestaurantType[];
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
  const [candidateData, setCandidateData] = useState<CandidateType[]>([]); // 투표된 음식점의 정보 데이터
  const { updateRestaurantDetailLayerStatus } = useRestaurantDetailLayerStatusStore(
    (state) => state
  );
  const { updateSelectedRestaurantData } = useSelectedRestaurantDataStore((state) => state);

  const compare = (a: CandidateType, b: CandidateType): number => {
    const aCount = a.count || 0;
    const bCount = b.count || 0;
    if (aCount > bCount) {
      return -1;
    }
    return 1;
  };

  const makeCandidateData = (candidateList: VoteDataType[]): CandidateType[] => {
    const tempList: CandidateType[] = [];

    // voteList에 있는 후보 음식점들의 상세정보를 candidateData에 세팅
    restaurantData.forEach((restaurantItem) => {
      candidateList.forEach((voteItem: VoteDataType) => {
        if (restaurantItem.id === voteItem.restaurantId) {
          const tempItem: CandidateType = { ...restaurantItem };

          // 좋아요 수 렌더링을 위해 음식점 상세정보에 투표 count값 추가
          tempItem.count = voteItem.count;
          tempList.push(tempItem);
        }
      });
    });

    return tempList;
  };

  useEffect(() => {
    if (!(socket instanceof Socket)) {
      return;
    }

    socket.on('currentVoteResult', (result: VoteResultType) => {
      if (!result.data) {
        return;
      }

      setCandidateData(makeCandidateData(result.data.candidateList));
    });
    // 투표 결과 요청
    socket.emit('getVoteResult');

    // 투표 결과 업데이트 (다른 참여자가 투표하는 경우 발생)
    socket.on('voteResultUpdate', (result: VoteResultType) => {
      if (!result.data) {
        return;
      }

      setCandidateData(makeCandidateData(result.data.candidateList));
    });
  }, []);

  return (
    <CandidateListModalLayout>
      {!candidateData.length ? (
        <EmptyListPlaceholder />
      ) : (
        <CandidateListModalBox>
          {[...candidateData].sort(compare).map((candidate: CandidateType) => {
            return (
              <CandidateItem
                onClick={() => {
                  updateRestaurantDetailLayerStatus(RESTAURANT_DETAIL_TYPES.show);
                  updateSelectedRestaurantData(candidate);
                }}
                key={candidate.id}
              >
                <RestaurantRow
                  key={candidate.id}
                  restaurant={candidate}
                  restaurantListType={RESTAURANT_LIST_TYPES.candidate}
                  likeCnt={candidate.count}
                />
              </CandidateItem>
            );
          })}
        </CandidateListModalBox>
      )}
    </CandidateListModalLayout>
  );
}
