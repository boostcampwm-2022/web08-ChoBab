import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle from '../GlobalStyle';
import Home from './home';
import Create from './create';

function Router() {
  return (
    <BrowserRouter>
      <GlobalStyle />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
