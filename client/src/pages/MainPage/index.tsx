import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '@hooks/useSocket';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { MainPageLayout } from './styles';

function MainPage() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const [isReady, setIsReady] = useState<boolean>(false);

  const [socketRef, connectSocket, disconnectSocket] = useSocket();

  const initService = async () => {
    try {
      await connectSocket();
      const res = await axios.post('/api/room/connect', {
        roomCode,
        // 향후 유저 식별자가 userId에 추가되어야 함
        userId: '이창명4',
      });

      if (res.status < 300) {
        setIsReady(true);
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initService();

    return () => {
      disconnectSocket();
    };
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
    <MainPageLayout>
      room page
      <button type="button" onClick={sendMessage}>
        message send
      </button>
    </MainPageLayout>
  );
}

export default MainPage;
