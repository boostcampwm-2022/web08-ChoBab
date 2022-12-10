/**
 * milliseconds 단위 시간을 화면에 표시할 시간과 분 단위로 변환
 */
export const msToTimeDisplay = (time: number) => {
  const hour = Math.floor((time / (1000 * 60 * 60)) % 24); // 시간
  const minutes = Math.floor((time / (1000 * 60)) % 60); // 분

  return hour > 0 ? `${hour}시간 ${minutes}분` : `${minutes}분`;
};
