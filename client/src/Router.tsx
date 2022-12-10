import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GlobalStyle, { MainLayout } from '@styles/GlobalStyle';
import HomePage from '@pages/HomePage';
import InitRoomPage from '@pages/InitRoomPage';
import MainPage from '@pages/MainPage';
import ErrorPage from '@pages/ErrorPage';
import { ERROR_REASON } from '@constants/error';
import { URL_PATH } from '@constants/url';

function Router() {
  return (
    <BrowserRouter>
      <MainLayout>
        <GlobalStyle />

        <Routes>
          <Route path={URL_PATH.HOME} element={<HomePage />} />
          <Route path={URL_PATH.INIT_ROOM} element={<InitRoomPage />} />
          <Route path={`${URL_PATH.JOIN_ROOM}/:roomCode`} element={<MainPage />} />
          <Route
            path={URL_PATH.INVALID_ROOM}
            element={<ErrorPage reason={ERROR_REASON.INVALID_ROOM} />}
          />
          <Route
            path={URL_PATH.INTERNAL_SERVER_ERROR}
            element={<ErrorPage reason={ERROR_REASON.INTERNAL_SERVER_ERROR} />}
          />
          <Route path="*" element={<ErrorPage reason={ERROR_REASON.NOT_FOUND_PAGE} />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default Router;
