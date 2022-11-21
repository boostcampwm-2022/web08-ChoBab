import { ReactComponent as LogoImage } from '@assets/images/logo.svg';
import { Link } from 'react-router-dom';
import { HomePageLayout, HomePageBox, Button } from './Style';

function HomePage() {
  return (
    <HomePageLayout>
      <HomePageBox>
        <LogoImage />

        {/* 추후 kebab-case 로 변경 필요 */}
        <Link to="/initRoom">
          <Button>모임 생성</Button>
        </Link>
      </HomePageBox>
    </HomePageLayout>
  );
}

export default HomePage;
