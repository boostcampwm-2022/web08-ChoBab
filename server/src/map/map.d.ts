interface areaType {
  name: string; // 명칭
}

export interface regionType {
  area1: areaType; // 행정안전부에서 공시된 시/도
  area2: areaType; // 행정안전부에서 공시된 시/군/구 명칭
}

export interface landType {
  number1: string; // 지번 주소인 경우 토지 본번호, 도로명 주소인 경우 상세주소
  name: string; // 지번 주소인 경우 reserved, 도로명 주소인 경우 도로명
}

interface statusType {
  code: number; // 코드 정보
}

interface resultType {
  region: regionType; // 지역 명칭 정보
  land: landType; // 상세주소 정보
}

export interface naverMapReverseGeocodeResType {
  status: statusType;
  results: resultType[];
}
