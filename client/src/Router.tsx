import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle, { MainLayout } from '@styles/GlobalStyle';

function Router() {
  return (
    <BrowserRouter>
      <MainLayout>
        <GlobalStyle />

        <Routes>
          <Route path="/" element={<div /> /* <HomePage /> */} />
          <Route path="/initRoom" element={<div /> /* <InitRoomPage /> */} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default Router;
