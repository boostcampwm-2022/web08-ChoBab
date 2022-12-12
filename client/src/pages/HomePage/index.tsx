import { ReactComponent as LogoImage } from '@assets/images/logo.svg';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { URL_PATH } from '@constants/url';
import {
  Button,
  ButtonBox,
  FooterBox,
  HomePageBox,
  HomePageLayout,
  ModalBox,
  ModalInput,
  ModalInputButton,
  ModalInputError,
  ModalLayout,
} from './styles';

function Modal() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputError, setInputError] = useState<string>('');

  return (
    <ModalBox>
      <ModalInput ref={inputRef} type="text" placeholder="모임방 url을 입력하세요." />
      <ModalInputError>{inputError}</ModalInputError>
      <ModalInputButton
        onClick={(e) => {
          e.preventDefault();
          if (!inputRef.current) {
            return;
          }
          // 공백 제거
          inputRef.current.value = inputRef.current.value.replace(/^\s+|\s+$/gm, '');

          // 입력된 값이 없을 경우
          if (!inputRef.current.value) {
            setInputError('입력은 공백일 수 없습니다!');
            return;
          }

          // url 이동
          document.location.href = inputRef.current.value;
        }}
      >
        입장
      </ModalInputButton>
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
          <Link to={URL_PATH.INIT_ROOM}>
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
