import { io, Socket } from 'socket.io-client';
import { MutableRefObject, useRef } from 'react';

export const useSocket = (): [MutableRefObject<Socket | null>, () => void, () => void] => {
  const socket = useRef<Socket | null>(null);

  const connectSocket = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (socket.current !== null) {
        resolve();
        // resolve or reject 함수를 호출해도
        // 코드는 계속해서 실행되기 때문에 return
        return;
      }

      socket.current = io('/room');

      socket.current.on('connect', () => {
        resolve();
      });

      socket.current.on('connect_error', () => {
        reject();
      });
    });
  };

  const disconnectSocket = (): void => {
    if (socket.current === null) {
      return;
    }

    socket.current.close();
  };

  return [socket, connectSocket, disconnectSocket];
};

export default '';
