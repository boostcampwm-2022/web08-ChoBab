import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GlobalStyle, { MainLayout } from '@styles/GlobalStyle';
import HomePage from '@pages/HomePage';
import InitRoomPage from '@pages/InitRoomPage';
import MainPage from '@pages/MainPage';
import ErrorPage from '@pages/ErrorPage';
import { ERROR_REASON } from '@constants/error';

function Router() {
  return (
    <BrowserRouter>
      <MainLayout>
        <GlobalStyle />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/init-room" element={<InitRoomPage />} />
          <Route path="/room/:roomCode" element={<MainPage />} />
          <Route
            path="/error/invalid-room"
            element={<ErrorPage reason={ERROR_REASON.INVALID_ROOM} />}
          />
          <Route
            path="/error/internal-server"
            element={<ErrorPage reason={ERROR_REASON.INTERNAL_SERVER_ERROR} />}
          />
          <Route path="*" element={<ErrorPage reason={ERROR_REASON.NOT_FOUND_PAGE} />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default Router;
