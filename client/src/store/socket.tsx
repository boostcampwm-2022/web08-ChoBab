import create from 'zustand';
import { Socket } from 'socket.io-client';

interface SocketStoreType {
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
}

// props drilling을 막기 위해 소켓 객체를 전역으로 저장
export const useSocketStore = create<SocketStoreType>((set) => ({
  socket: null,
  setSocket: (socket) => set(() => ({ socket })),
}));
