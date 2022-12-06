import { PreprocessedRestaurantType as RestaurantType } from '@restaurant/restaurant';
import { VoteResultType } from '@socket/socket';

interface UserType {
  userId: string;
  userLat: number;
  userLng: number;
}

const dataTemplate = (message: string, data?: unknown) => {
  if (!data) {
    return { message };
  }
  return {
    message,
    data,
  };
};

export const SOCKET_RES = {
  CONNECT_FAIL: dataTemplate('접속 실패'),
  CONNECT_SUCCESS: (
    roomCode: string,
    lat: number,
    lng: number,
    restaurantList: RestaurantType[],
    candidateList: VoteResultType[],
    userList: UserType[],
    userId: string,
    userName: string
  ) =>
    dataTemplate('접속 성공', {
      roomCode,
      lat,
      lng,
      restaurantList,
      candidateList,
      userList,
      userId,
      userName,
    }),
  VOTE_RESTAURANT_SUCCESS: (restaurantId: string) => dataTemplate('투표 성공', { restaurantId }),
  VOTE_RESTAURANT_FAIL: dataTemplate('투표 실패'),
  UPDATE_VOTE_RESULT: (candidateList: VoteResultType[]) =>
    dataTemplate('투표 결과 업데이트', { candidateList }),
};