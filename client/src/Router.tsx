import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GlobalStyle, { MainLayout } from '@styles/GlobalStyle';
import HomePage from '@pages/HomePage';
import InitRoomPage from '@pages/InitRoomPage';
import MainPage from '@pages/MainPage';
import ErrorPage from '@pages/ErrorPage';

function Router() {
  return (
    <BrowserRouter>
      <MainLayout>
        <GlobalStyle />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/init-room" element={<InitRoomPage />} />
          <Route path="/room/:roomCode" element={<MainPage />} />
          <Route path="*" element={<ErrorPage reason="존재하지 않는 페이지" />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default Router;
