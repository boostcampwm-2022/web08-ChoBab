import { failRes } from '@response/index';

export const COMMON_EXCEPTION = {
  INVALID_QUERY_PARAMS: failRes('올바르지 않은 Query Params입니다.'),
};
