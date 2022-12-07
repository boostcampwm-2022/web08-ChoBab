import React, { useState } from 'react';
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
  const { votedRestaurantList, addVotedRestaurant, removeVotedRestaurant } =
    useVotedRestaurantListStore((state) => state);

  const handleClick: React.MouseEventHandler = (e) => {
    // 이벤트 버블링 방지: 버튼 클릭 시 상세 정보 모달이 열리지 않기 위해 필요
    e.stopPropagation();

    if (!(socket instanceof Socket)) {
      throw new Error();
    }

    // TODO: 디바운싱 처리 필요, isVoted값 바뀌고 있는데 세팅하면 곤란

    // console.log(restaurantId);
    // console.log(votedRestaurantList);

    // if 이 식당이. (전역 상태) 투표 리스트에 있으면?
    // 투표 취소 처리
    // removeVotedRestaurant
    // 소켓의 투표 취소 이벤트 호출
    // 정상 응답 받으면, 전역 상태의 투표 리스트를 업데이트하고.(이 식당 삭제)
    // 전역 상태 바뀌면, isVoted 업데이트, 걔에 따라 버튼 상태 변경...?
    if (isVoted) {
      socket.emit('cancelVoteRestaurant', restaurantId);
      socket.on('voteRestaurantResult', (result: VoteResultType) => {
        // console.log(result);
        // 성공 시
        if (result.message === '투표 취소 성공') {
          removeVotedRestaurant(restaurantId);
          setIsVoted(false);
        } else {
          // 어떤 처리를 해야할까? 0.5초 딜레이 후 false 세팅?
        }
      });
      return;
    }

    // else. 투표 리스트에 없으면?
    // 투표 처리
    // 소켓의 투표 이벤트 호출
    socket.emit('voteRestaurant', restaurantId);
    socket.on('voteRestaurantResult', (result: VoteResultType) => {
      console.log(result);
      // 성공 시
      if (result.message === '투표 성공') {
        addVotedRestaurant(restaurantId);
        setIsVoted(true);
      } else {
        // 어떤 처리를 해야할까? 0.5초 딜레이 후 false 세팅?
      }
    });
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
