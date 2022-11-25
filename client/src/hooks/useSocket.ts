import { io, Socket } from 'socket.io-client';
import { MutableRefObject, useRef } from 'react';

export const useSocket = (): [MutableRefObject<Socket | null>, () => Promise<void>] => {
  const socket = useRef<Socket | null>(null);

  const connectSocket = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (socket.current !== null) {
        resolve();
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

  return [socket, connectSocket];
};
