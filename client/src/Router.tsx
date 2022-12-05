import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle, { MainLayout } from '@styles/GlobalStyle';
import HomePage from '@pages/HomePage';
import InitRoomPage from '@pages/InitRoomPage';
import MainPage from '@pages/MainPage';
import TestPage from '@pages/TestPage';

function Router() {
  return (
    <BrowserRouter>
      <MainLayout>
        <GlobalStyle />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/init-room" element={<InitRoomPage />} />
          <Route path="/room/:roomCode" element={<MainPage />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default Router;
