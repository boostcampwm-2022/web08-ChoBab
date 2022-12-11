export const getRandomNum = (lastNum: number) => {
  const lastInt = Math.floor(lastNum);
  const randomNum = Math.floor(Math.random() * lastInt);
  return randomNum;
};

export const getRandomRating = () => 3 + Math.floor(Math.random() * 2 * 10) / 10;
