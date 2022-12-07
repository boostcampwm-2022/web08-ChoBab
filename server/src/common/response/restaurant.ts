import { failRes, successRes } from './index';

export const RESTAURANT_RES = {
  SUCCESS_SEARCH_RESTAURANT_DETAIL: (rating?: number, priceLevel?: number) =>
    successRes('음식점의 세부정보를 찾았습니다.', { rating, priceLevel }),
};

export const RESTAURANT_EXCEPTION = {
  FAIL_SEARCH_RESTAURANT_DETAIL: failRes('음식점의 세부정보를 찾지 못했습니다.'),
};
