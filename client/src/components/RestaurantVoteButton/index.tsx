import React, { useEffect, useState, useRef } from 'react';

import { ReactComponent as LikeImage } from '@assets/images/filled-like.svg';
import { ReactComponent as UnLikeImage } from '@assets/images/unfilled-like.svg';

import { TOAST_DURATION_TIME, FAIL_VOTE_MESSAGE, FAIL_CANCEL_VOTE_MESSAGE } from '@constants/toast';
import { RESTAURANT_LIST_TYPES } from '@constants/modal';
import { useSocketStore } from '@store/socket';
import { useToast } from '@hooks/useToast';

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

interface VoteRestaurantListType {
  message: string;
  data: { voteRestaurantIdList: string[] };
}

function RestaurantVoteButton({
  id: restaurantId,
  restaurantListType: listType,
  likeCnt,
}: PropsType) {
  const [isVoted, setIsVoted] = useState(false);
  const { socket } = useSocketStore((state) => state);
  const votedRestaurantListRef = useRef<string[]>([]); // 사용자가 투표한 음식점 리스트
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { fireToast } = useToast();

  // 서버로부터 사용자가 투표한 음식점 목록을 받아와서 votedRestaurantListRef에 저장
  const setVotedRestaurantList = () => {
    if (!(socket instanceof Socket)) {
      throw new Error();
    }

    socket.emit('getUserVoteRestaurantIdList');
    socket.on('userVoteRestaurantIdList', (result: VoteRestaurantListType) => {
      votedRestaurantListRef.current = result.data?.voteRestaurantIdList;
      setIsVoted(votedRestaurantListRef.current.includes(restaurantId));
    });
  };

  useEffect(() => {
    setVotedRestaurantList();
  }, []);

  const voteRestaurant = () => {
    if (!(socket instanceof Socket)) {
      throw new Error();
    }

    // 사용자가 이미 투표한 식당인 경우, 투표 취소
    if (votedRestaurantListRef.current.includes(restaurantId)) {
      socket.emit('cancelVoteRestaurant', { restaurantId });
      socket.on('cancelVoteRestaurantResult', (result: VoteResultType) => {
        if (result.message === '투표 취소 실패') {
          fireToast({
            content: FAIL_CANCEL_VOTE_MESSAGE,
            duration: TOAST_DURATION_TIME,
            bottom: 280,
          });
          setIsVoted(true);
        }
      });
      return;
    }

    // 사용자가 투표하지 않은 식당인 경우, 투표
    socket.emit('voteRestaurant', { restaurantId });
    socket.on('voteRestaurantResult', (result: VoteResultType) => {
      if (result.message === '투표 실패') {
        fireToast({
          content: FAIL_VOTE_MESSAGE,
          duration: TOAST_DURATION_TIME,
          bottom: 280,
        });
        setIsVoted(false);
      }
    });
  };

  const handleClick: React.MouseEventHandler = (e) => {
    // 이벤트 버블링 방지: 버튼 클릭 시 상세 정보 모달이 열리지 않기 위해 필요
    e.stopPropagation();

    // 쓰로틀링: 버튼 연속 클릭 방지(delay time: 500ms)
    if (timerRef.current) {
      return;
    }

    // 버튼 색상 변경은 클릭 시 즉각적으로 일어나야 함(쓰로틀링 딜레이 시간 이후 변하면 X)
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
