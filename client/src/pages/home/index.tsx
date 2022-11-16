import { MainWrapper, Main, Button, Logo } from './Style';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <MainWrapper>
      <Main>
        <Logo>
          <p>Cho</p>
          <p>Bab</p>
        </Logo>
        <Link to="/create">
          <Button>모임 생성</Button>
        </Link>
      </Main>
    </MainWrapper>
  );
}

export default Home;
