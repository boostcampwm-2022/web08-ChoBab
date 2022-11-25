import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '@hooks/useSocket';

function RoomPage() {
  const [isReady, setIsReady] = useState<boolean>(false);

  const [socketRef, connectSocket] = useSocket();

  const initSerive = async () => {
    try {
      // TODO: 소켓연결 작업뿐만이 아닌 다른 로딩관련 작업 추가
      await connectSocket();

      setIsReady(true);
    } catch (error) {
      // TODO: 오류 페이지로 이동관련 로직 추가
      console.log(error);
    }
  };

  useEffect(() => {
    initSerive();
  }, []);

  useEffect(() => {
    const socket = socketRef.current;

    if (!(socket instanceof Socket)) {
      return;
    }

    if (!isReady) {
      return;
    }

    socket.on('serverToClient', (data) => {
      console.log('from server', data);
    });
  }, [isReady]);

  const sendMessage = () => {
    const socket = socketRef.current;

    if (!(socket instanceof Socket)) {
      return;
    }

    socket.emit('clientToServer', 'message');
  };

  return !isReady ? (
    <div>loading...</div>
  ) : (
    <div>
      room page
      <button type="button" onClick={sendMessage}>
        message send
      </button>
    </div>
  );
}

export default RoomPage;
