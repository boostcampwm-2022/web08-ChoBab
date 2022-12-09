import React, { useEffect, useState, useRef } from 'react';

import { ReactComponent as LikeImage } from '@assets/images/filled-like.svg';
import { ReactComponent as UnLikeImage } from '@assets/images/unfilled-like.svg';

import { RESTAURANT_LIST_TYPES } from '@constants/modal';
import { useSocketStore } from '@store/socket';
import { useVotedRestaurantListStore } from '@store/vote';
import { Socket } from 'socket.io-client';
import { VoteLayout, VoteButton, LikeButton, LikeCountSpan } from './styles';

interface PropsType {
  id: string;
  restaurantListType: string;
  // eslint-disable-next-line react/require-default-props
  likeCnt?: number;
}

interface VoteResultType {
  message: string;
  data?: { restaurantId: string };
}
function RestaurantVoteButton({
  id: restaurantId,
  restaurantListType: listType,
  likeCnt,
}: PropsType) {
  const [isVoted, setIsVoted] = useState(false);

  const { socket } = useSocketStore((state) => state);
  // votedRestaurantList -> 사용자가 투표한 식당 목록, 추후 store가 아니라,서버에서 내려주도록 로직 수정 필요
  const { votedRestaurantList, addVotedRestaurant, removeVotedRestaurant } =
    useVotedRestaurantListStore((state) => state);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsVoted(votedRestaurantList.has(restaurantId));
  });

  const voteRestaurant = () => {
    if (!(socket instanceof Socket)) {
      throw new Error();
    }

    // 이미 투표한 식당인 경우, 투표 취소
    // 투표 여부 판단 -> 현재는 전역 store지만, 추후 서버에서 받아온 나의 투표 List에 포함되어있는지에 따라 세팅하도록 수정 필요
    if (votedRestaurantList.has(restaurantId)) {
      socket.emit('cancelVoteRestaurant', { restaurantId });
      socket.on('cancelVoteRestaurantResult', (result: VoteResultType) => {
        if (result.message === '투표 취소 성공') {
          removeVotedRestaurant(restaurantId);
        } else {
          console.log('투표 취소 실패');
          setIsVoted(true);
        }
      });
      return;
    }

    // 투표한 적 없는 식당인 경우, 투표
    socket.emit('voteRestaurant', { restaurantId });
    socket.on('voteRestaurantResult', (result: VoteResultType) => {
      // 성공 시
      if (result.message === '투표 성공') {
        addVotedRestaurant(restaurantId);
      } else {
        console.log('투표 실패');
        setIsVoted(false);
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
      {/* 음식점 리스트일 때 */}
      {listType === RESTAURANT_LIST_TYPES.filtered && (
        <VoteButton type="button" isVoted={isVoted} onClick={handleClick}>
          {isVoted ? '❌ 투표' : '✔️ 투표'}
        </VoteButton>
      )}
      {/* 후보 리스트일 때 */}
      {listType === RESTAURANT_LIST_TYPES.candidate && (
        <LikeButton type="button" isVoted={isVoted} onClick={handleClick}>
          <LikeCountSpan>{likeCnt}</LikeCountSpan>
          {isVoted ? (
            <LikeImage width="20" height="20" fill="#EF5F21" />
          ) : (
            <UnLikeImage width="20" height="20" />
          )}
        </LikeButton>
      )}
    </VoteLayout>
  );
}

export default RestaurantVoteButton;
