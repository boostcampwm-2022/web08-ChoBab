import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle, { MainLayout } from '@styles/GlobalStyle';
import HomePage from '@pages/HomePage';
import InitRoomPage from '@pages/InitRoomPage';
import RoomPage from '@pages/RoomPage';

function Router() {
  return (
    <BrowserRouter>
      <MainLayout>
        <GlobalStyle />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/init-room" element={<InitRoomPage />} />
          <Route path="/room/:roomCode" element={<RoomPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default Router;
