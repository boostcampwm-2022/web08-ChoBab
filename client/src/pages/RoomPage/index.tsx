import { useState, useEffect } from 'react';
import { useSocket } from '@hooks/useSocket';

function RoomPage() {
  const [ready, setReady] = useState<boolean>(false);

  const [socket, connectSocket] = useSocket();

  const loading = async () => {
    try {
      // TODO: 소켓연결 작업뿐만이 아닌 다른 로딩관련 작업 추가
      await connectSocket();

      setReady(true);
    } catch (error) {
      // TODO: 오류 페이지로 이동관련 로직 추가
      console.log(error);
    }
  };

  useEffect(() => {
    loading();
  }, []);

  useEffect(() => {
    if (socket.current === null) {
      return;
    }

    if (!ready) {
      return;
    }

    socket.current.on('serverToClient', (data) => {
      console.log('from server', data);
    });
  }, [ready]);

  const sendMessage = () => {
    if (socket.current === null) {
      return;
    }

    socket.current.emit('clientToServer', 'message');
  };

  return !ready ? (
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
