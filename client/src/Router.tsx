import { BrowserRouter, Routes, Route } from 'react-router-dom';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div /> /* <HomePage /> */} />
        <Route path="/initRoom" element={<div /> /* <InitRoomPage /> */} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
