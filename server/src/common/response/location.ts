import { failRes } from './index';

export const LOCATION_RES = {};

export const LOCATION_EXCEPTION = {
  OUT_OF_KOREA: failRes('대한민국을 벗어난 입력입니다.'),
};
