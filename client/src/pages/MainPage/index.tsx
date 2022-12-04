import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '@hooks/useSocket';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { ReactComponent as CandidateListIcon } from '@assets/images/candidate-list.svg';
import { ReactComponent as ListIcon } from '@assets/images/list-icon.svg';
import { RestaurantDetailModal } from '@components/RestaurantDetailModal';
import { AnimatePresence, motion } from 'framer-motion';
import LinkShareButton from '@components/LinkShareButton';
import MainMap from '@components/MainMap';
import { NAVER_LAT, NAVER_LNG } from '@constants/map';
import useCurrentLocation from '@hooks/useCurrentLocation';

import {
  ButtonInnerTextBox,
  CandidateListButton,
  CategoryToggle,
  Header,
  HeaderBox,
  MainPageLayout,
  MapOrListButton,
} from './styles';

interface RestaurantType {
  id: string;
  name: string;
  category: string;
  phone: string;
  lat: number;
  lng: number;
  address: string;
}

interface RoomValidResponseType {
  message: string;
  data: {
    isRoomValid: boolean;
  };
}

interface UserType {
  userId: string;
  userLat: number;
  userLng: number;
}

function MainPage() {
  const userLocation = useCurrentLocation();
  const { roomCode } = useParams<{ roomCode: string }>();
  const [isRoomConnect, setRoomConnect] = useState<boolean>(false);
  const [socketRef, connectSocket, disconnectSocket] = useSocket();

  const [restaurantData, setRestaurantData] = useState<RestaurantType[]>([]);
  const [roomLocation, setRoomLocation] = useState<{ lat: number; lng: number }>({
    lat: NAVER_LAT,
    lng: NAVER_LNG,
  });

  const [isRestaurantDetailModalOn, setRestaurantDetailModalOn] = useState<boolean>(false);

  const connectRoom = () => {
    const clientSocket = socketRef.current;
    const { lat: userLat, lng: userLng } = userLocation;
    if (!(clientSocket instanceof Socket)) {
      throw new Error();
    }
    clientSocket.on(
      'connectResult',
      (data: {
        message: string;
        data?: {
          roomCode: string;
          lat: number;
          lng: number;
          userList: UserType[];
          restaurantList: RestaurantType[];
          candidateList: RestaurantType[];
        };
      }) => {
        if (!data.data) {
          console.log(data.message);
          return;
        }
        const { lat, lng, userList, restaurantList, candidateList } = data.data;
        setRoomConnect(true);
        setRestaurantData(restaurantList);
        setRoomLocation({ ...roomLocation, ...{ lat, lng } });
        console.log(data);
      }
    );
    clientSocket.emit('connectRoom', { roomCode, userLat, userLng });
  };

  const initService = async () => {
    try {
      await connectSocket();
      const {
        data: {
          data: { isRoomValid },
        },
      } = await axios.get<RoomValidResponseType>(`/api/room/valid?roomCode=${roomCode}`);

      if (!isRoomValid) {
        throw new Error('입장하고자 하는 방이 올바르지 않습니다.');
      }

      connectRoom();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // userLocation 의 초기값을 {lat:null, lng:null} 로 지정.
    // 따라서 사용자의 위치 정보의 로딩이 끝나기 전까지(위치 정보 불러오기 성공 혹은 실패) 해당 if 문을 통해 initService가 작동하지 않게 됨.
    // userLocation으로 사용자의 위치 정보를 불러오는 과정이 비동기로 이루어지기 때문에 initService가 여러번 발생할 위험이 있었는데 이를 차단.
    // PR: https://github.com/boostcampwm-2022/web08-ChoBab/pull/92
    if (!userLocation.lat || !userLocation.lng) {
      return;
    }
    if (!roomCode) {
      return;
    }
    if (isRoomConnect) {
      return;
    }

    initService();

    // eslint-disable-next-line consistent-return
    return () => {
      disconnectSocket();
    };
  }, [userLocation]);

  return !isRoomConnect ? (
    <div>loading...</div>
  ) : (
    <MainPageLayout>
      <MainMap restaurantData={restaurantData.slice(80, 100)} roomLocation={roomLocation} />
      <HeaderBox>
        <Header>
          <LinkShareButton />
        </Header>
        <CategoryToggle>토글</CategoryToggle>
      </HeaderBox>
      <CandidateListButton>
        <CandidateListIcon />
      </CandidateListButton>
      <MapOrListButton>
        <ListIcon />
        <ButtonInnerTextBox>목록보기</ButtonInnerTextBox>
      </MapOrListButton>
      <AnimatePresence>
        {isRestaurantDetailModalOn && (
          <RestaurantDetailModal setRestaurantDetailModalOn={setRestaurantDetailModalOn} />
        )}
      </AnimatePresence>
    </MainPageLayout>
  );
}

export default MainPage;
