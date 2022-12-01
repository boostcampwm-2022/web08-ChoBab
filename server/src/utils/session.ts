import * as session from 'express-session';
import * as fileStoreCreateFunction from 'session-file-store';

const FileStore = fileStoreCreateFunction(session);

export const sessionMiddleware = session({
  resave: false,
  saveUninitialized: true,
  // TODO: 추후 secret 값 환경변수로 이동
  secret: 'cookie-secret',
  cookie: {
    httpOnly: true,
    secure: false,
    // expires 를 따로 설정해주지 않으면 브라우저가 닫혔을 때 세션쿠키가 삭제되기 때문에
    // 적당한 세션쿠키 유효시간을 설정해 줌 (1시간)
    maxAge: 1000 * 60 * 60,
  },
  store: new FileStore(),
});
