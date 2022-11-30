import { failRes, successRes } from '@response/index';
import { TraoptimalType } from '@map/map';

export const MAP_RES = {
  SUCCESS_GET_DRIVING_INFO: (traoptimal: TraoptimalType) => {
    return successRes('성공적으로 경로 정보를 가져왔습니다.', { ...traoptimal });
  },
};

export const MAP_EXCEPTION = {
  FAIL_GET_DRIVING_INFO: failRes('길찾기 정보를 가져오는데 실패했습니다.'),
  INVALID_GOAL: failRes('출발지와 도착지가 같습니다.'),
};
