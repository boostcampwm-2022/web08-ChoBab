import { io, Socket } from 'socket.io-client';
import { MutableRefObject, useRef } from 'react';
import { useSocketStore } from '@store/socket';

export const useSocket = (): [MutableRefObject<Socket | null>, () => Promise<void>, () => void] => {
  const socketRef = useRef<Socket | null>(null);
  const { setSocket } = useSocketStore((state) => state);

  const connectSocket = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current instanceof Socket) {
        resolve();
        return;
      }

      socketRef.current = io('/room');

      const socket = socketRef.current;
      setSocket(socket);

      socket.on('connect', () => {
        resolve();
      });

      socket.on('connect_error', () => {
        reject();
      });
    });
  };

  const disconnectSocket = (): void => {
    if (!(socketRef.current instanceof Socket)) {
      return;
    }

    socketRef.current.close();
    socketRef.current = null;
  };

  return [socketRef, connectSocket, disconnectSocket];
};
