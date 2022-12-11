import { useEffect, useRef } from 'react';
import { ModalLayout } from './styles';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (status: boolean) => void;
  children: React.ReactNode;
}

function Modal({ isOpen, setIsOpen, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const modalCloseWindowEvent = (e: Event) => {
      const { target } = e;

      if (modalRef.current && target instanceof HTMLElement && modalRef.current.contains(target)) {
        return;
      }

      setIsOpen(false);
    };

    window.addEventListener('click', modalCloseWindowEvent);

    return () => {
      window.removeEventListener('click', modalCloseWindowEvent);
    };
  }, []);

  return <ModalLayout ref={modalRef}> {isOpen && children} </ModalLayout>;
}

export default Modal;
