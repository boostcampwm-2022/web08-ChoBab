import { failRes, successRes } from './index';

export const ROOM_RES = {
  SUCCESS_CREATE_ROOM: (roomCode: string) => {
    return successRes('성공적으로 모임방을 생성했습니다.', { roomCode });
  },
  SUCCESS_VALID_ROOM: successRes('유효한 roomCode입니다.', { isRoomValid: true }),
};

export const ROOM_EXCEPTION = {
  FAIL_CREATE_ROOM: failRes('모임방 생성에 실패했습니다.'),
  FAIL_VALID_ROOM: failRes('유효하지 않은 모임방입니다.'),
  FAIL_SEARCH_ROOM: failRes('모임방 검색에 실패했습니다.'),
  IS_NOT_EXIST_ROOM: failRes('존재하지 않는 모임방입니다.'),
  ALREADY_DELETED_ROOM: failRes('이미 삭제된 모임방입니다.'),
};
