import { ReactComponent as LogoImage } from '@assets/images/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  HomePageLayout,
  HomePageBox,
  Button,
  FooterBox,
  ButtonBox,
  ModalLayout,
  ModalBox,
  InputButton,
} from './styles';

function Modal() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <ModalBox>
      <input ref={inputRef} type="text" placeholder="모임 코드를 입력하세요." />
      <InputButton
        onClick={(e) => {
          e.preventDefault();
          if (!inputRef.current) {
            return;
          }
          document.location.href = inputRef.current.value;
        }}
      >
        입장
      </InputButton>
    </ModalBox>
  );
}

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modalRef.current) {
      return;
    }

    modalRef.current.style.visibility = isModalOpen ? 'visible' : 'hidden';
  }, [isModalOpen]);

  return (
    <HomePageLayout>
      <HomePageBox>
        <LogoImage />

        <ButtonBox>
          <Link to="/init-room">
            <Button>모임 생성</Button>
          </Link>
          <Button onClick={() => setIsModalOpen(!isModalOpen)}>모임 참여</Button>
        </ButtonBox>
      </HomePageBox>
      <FooterBox>
        <p>밥을 골라주마.</p>
        <p>Copyright 2022. Chobab. All Right Reserved.</p>
      </FooterBox>
      <ModalLayout
        ref={modalRef}
        onClick={(e) => {
          if (!modalRef.current || modalRef.current !== e.target) {
            return;
          }
          setIsModalOpen(!isModalOpen);
        }}
      >
        <Modal />
      </ModalLayout>
    </HomePageLayout>
  );
}

export default HomePage;
