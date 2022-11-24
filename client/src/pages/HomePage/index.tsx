import { ReactComponent as LogoImage } from '@assets/images/logo.svg';
import { Link } from 'react-router-dom';
import { HomePageLayout, HomePageBox, Button, FooterBox, ButtonBox } from './styles';

function HomePage() {
  return (
    <HomePageLayout>
      <HomePageBox>
        <LogoImage />

        <ButtonBox>
          <Link to="/init-room">
            <Button>모임 생성</Button>
          </Link>
          <Link to="/join-room">
            <Button>모임 참여</Button>
          </Link>
        </ButtonBox>
      </HomePageBox>
      <FooterBox>
        <p>밥을 골라주마.</p>
        <p>Copyright 2022. Chobab. All Right Reserved.</p>
      </FooterBox>
    </HomePageLayout>
  );
}

export default HomePage;
