import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle from '@styles/GlobalStyle';

function Router() {
  return (
    <BrowserRouter>
      <GlobalStyle />

      <Routes>
        <Route path="/" element={<div /> /* <HomePage /> */} />
        <Route path="/initRoom" element={<div /> /* <InitRoomPage /> */} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
