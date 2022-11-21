import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle, { MainLayout } from '@styles/GlobalStyle';
import HomePage from '@pages/HomePage';

function Router() {
  return (
    <BrowserRouter>
      <MainLayout>
        <GlobalStyle />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/initRoom" element={<div /> /* <InitRoomPage /> */} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default Router;
