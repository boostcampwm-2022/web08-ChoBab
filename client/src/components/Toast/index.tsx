import { useToastStore } from '@store/index';
import { ToastLayout, ToastContentSpan } from './styles';

function Toast() {
  const { isOpen, content, bottom } = useToastStore();

  return (
    <ToastLayout bottom={bottom} visible={isOpen}>
      <ToastContentSpan>{content}</ToastContentSpan>
    </ToastLayout>
  );
}

export default Toast;
