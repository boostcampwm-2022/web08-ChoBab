import { failRes } from './index';

export const LOCATION_EXCEPTION = {
  OUT_OF_KOREA: failRes('대한민국을 벗어난 입력입니다.'),
  OUT_OF_MAX_RADIUS: failRes('최대 탐색 반경을 벗어난 입력입니다.'),
};
