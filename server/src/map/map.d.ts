interface StartOrGoalType {
  location: number[];
}

export interface SummaryType {
  start: StartOrGoalType; // 출발지
  goal: StartOrGoalType; // 도착지
  distance: number; // 총 거리
  duration: number; // 소요 시간(millisecond)
  tollFare: number; // 통행 요금(톨게이트)
  taxiFare: number; // 택시 요금
  fuelPrice: number; // 전국 평균 유류비와 연비를 감안한 유류비
}

export interface TraoptimalType {
  summary: SummaryType; // 요약 정보
  path: number[][]; // 경로를 구성하는 모든 좌표열
}

interface RouteType {
  traoptimal: TraoptimalType[];
}

export interface NaverDrivingResType {
  code: number; // 응답 결과 코드
  route: RouteType; // 응답 결과
}
