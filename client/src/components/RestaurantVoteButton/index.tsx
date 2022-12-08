import React, { useEffect, useState, useRef } from 'react';
import { RESTAURANT_LIST_TYPES } from '@constants/modal';
import { useSocketStore } from '@store/socket';
import { useVotedRestaurantListStore } from '@store/vote';
import { Socket } from 'socket.io-client';
import { VoteLayout, VoteButton, LikeButton } from './styles';

interface PropsType {
  id: string;
  restaurantListType: string;
}

interface VoteResultType {
  message: string;
  data?: { restaurantId: string };
}
function RestaurantVoteButton({ id: restaurantId, restaurantListType: listType }: PropsType) {
  const [isVoted, setIsVoted] = useState(false);

  const { socket } = useSocketStore((state) => state);
  // votedRestaurantList -> 사용자가 투표한 식당 목록, 추후 store가 아니라,서버에서 내려주도록 로직 수정 필요
  const { votedRestaurantList, addVotedRestaurant, removeVotedRestaurant } =
    useVotedRestaurantListStore((state) => state);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (votedRestaurantList.has(restaurantId)) {
      setIsVoted(true);
    }
  }, []);

  const voteRestaurant = () => {
    if (!(socket instanceof Socket)) {
      throw new Error();
    }

    // 이미 투표한 식당인 경우, 투표 취소
    // isVoted 판단 -> 추후 서버에서 받아온 투표 List에 포함되어있는지에 따라 세팅하도록 수정 필요
    if (isVoted) {
      socket.emit('cancelVoteRestaurant', restaurantId);
      socket.on('voteRestaurantResult', (result: VoteResultType) => {
        // TODO: 윤희님이 투표 취소 로직 개발 후, 수정 예정
        if (result.message === '투표 취소 성공') {
          removeVotedRestaurant(restaurantId);
        } else {
          // 투표 취소 실패
          // TODO: 어떤 처리를 해야할 지 고민
        }
      });
      return;
    }

    // 투표한 적 없는 식당인 경우, 투표
    socket.emit('voteRestaurant', restaurantId);
    socket.on('voteRestaurantResult', (result: VoteResultType) => {
      // 성공 시
      if (result.message === '투표 성공') {
        addVotedRestaurant(restaurantId);
      } else {
        // 투표 실패
        // TODO: 어떤 처리를 해야할 지 고민
      }
    });
  };

  const handleClick: React.MouseEventHandler = (e) => {
    // 이벤트 버블링 방지: 버튼 클릭 시 상세 정보 모달이 열리지 않기 위해 필요
    e.stopPropagation();

    // 쓰로틀링: 버튼 연속 클릭 방지
    if (timerRef.current) {
      return;
    }

    // 버튼 색상 변경은 클릭 시 즉각적으로 일어나야 함
    setIsVoted(!isVoted);

    timerRef.current = setTimeout(() => {
      voteRestaurant();
      timerRef.current = null;
    }, 500);
  };

  return (
    <VoteLayout whileTap={{ scale: 0.85 }}>
      {listType === RESTAURANT_LIST_TYPES.filtered && (
        <VoteButton isVoted={isVoted} onClick={handleClick}>
          {isVoted ? '❌ 투표' : '✔️ 투표'}
        </VoteButton>
      )}
      {listType === RESTAURANT_LIST_TYPES.candidate && <LikeButton>추가 예정</LikeButton>}
    </VoteLayout>
  );
}

export default RestaurantVoteButton;
