import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MainPageLayout } from './styles';

export function MainRoomPage() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const [isLoading, setLoading] = useState<boolean>(true);

  const initService = async () => {
    try {
      const res = await axios.post('/api/room/connect', {
        roomCode,
        // 향후 유저 식별자가 userId에 추가되어야 함
        userId: '이창명4',
      });

      if (res.status < 300) {
        setLoading(false);
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    initService();
  }, []);

  return isLoading ? <div>loading...</div> : <MainPageLayout>메인페이지 구현 예정</MainPageLayout>;
}
