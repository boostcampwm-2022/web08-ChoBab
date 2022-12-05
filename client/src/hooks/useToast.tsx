import { useToastStore } from '@store/index';

interface ToastType {
  content: string;
  bottom?: number;
  duration?: number;
}

export function useToast() {
  const { updateIsOpen, updateToast } = useToastStore((state) => state);

  const fireToast = (toast: ToastType) => {
    const { content, bottom, duration } = toast;

    updateIsOpen(true);
    updateToast(content, bottom, duration);

    setTimeout(() => {
      updateIsOpen(false);
    }, toast.duration);
  };

  return { fireToast };
}
