import { NICKNAME_ADJECTIVE, NICKNAME_NOUN } from '@constants/nickname';

export const makeUserRandomNickname = () => {
  const nickname = `${NICKNAME_ADJECTIVE[Math.floor(Math.random() * NICKNAME_ADJECTIVE.length)]} ${
    NICKNAME_NOUN[Math.floor(Math.random() * NICKNAME_NOUN.length)]
  }`;
  return nickname;
};
