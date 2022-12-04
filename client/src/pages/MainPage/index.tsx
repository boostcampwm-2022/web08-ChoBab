import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '@hooks/useSocket';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { ReactComponent as CandidateListIcon } from '@assets/images/candidate-list.svg';
import { ReactComponent as ListIcon } from '@assets/images/list-icon.svg';
import ActiveUserInfo from '@components/ActiveUserInfo';
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

export interface UserType {
  userId: string;
  userLat: number;
  userLng: number;
  userName: string;
}

interface RestaurantType {
  id: string;
  name: string;
  category: string;
  phone: string;
  lat: number;
  lng: number;
  address: string;
}

interface ResTemplateType<T> {
  message: string;
  data: T;
}

interface RoomValidType {
  isRoomValid: boolean;
}

interface RoomDataType {
  roomCode: string;
  lat: number;
  lng: number;
  userList: UserType[];
  restaurantList: RestaurantType[];
  candidateList: RestaurantType[];
  userId: string;
  userName: string;
}

function MainPage() {
  const userLocation = useCurrentLocation();
  const { roomCode } = useParams<{ roomCode: string }>();
  const [isRoomConnect, setRoomConnect] = useState<boolean>(false);
  const [socketRef, connectSocket, disconnectSocket] = useSocket();

  const [myId, setMyId] = useState<string>('');
  const [myName, setMyName] = useState<string>('');
  const [joinList, setJoinList] = useState<Map<string, UserType>>(new Map());

  const [restaurantData, setRestaurantData] = useState<RestaurantType[]>([]);
  const [roomLocation, setRoomLocation] = useState<{ lat: number; lng: number }>({
    lat: NAVER_LAT,
    lng: NAVER_LNG,
  });

  const connectRoom = () => {
    const clientSocket = socketRef.current;
    const { lat: userLat, lng: userLng } = userLocation;
    if (!(clientSocket instanceof Socket)) {
      throw new Error();
    }
    clientSocket.on('connectResult', (data: ResTemplateType<RoomDataType>) => {
      if (!data.data) {
        console.log(data.message);
        return;
      }

      const { lat, lng, userList, restaurantList, candidateList, userId, userName } = data.data;

      const tmp = new Map();

      userList.forEach((userInfo) => {
        if (userInfo.userId !== userId) {
          tmp.set(userInfo.userId, userInfo);
        }
      });

      setJoinList(tmp);

      setMyId(userId);
      setMyName(userName);
      setRoomConnect(true);
      setRestaurantData(restaurantList);
      setRoomLocation({ ...roomLocation, ...{ lat, lng } });
    });
    clientSocket.emit('connectRoom', { roomCode, userLat, userLng });
  };

  const initService = async () => {
    try {
      /**
       * connect 순서 매우 중요
       * 세션 객체 생성을 위해 rest api 가 먼저 호출되어야 한다.
       */
      const {
        data: {
          data: { isRoomValid },
        },
      } = await axios.get<ResTemplateType<RoomValidType>>(`/api/room/valid?roomCode=${roomCode}`);

      if (!isRoomValid) {
        throw new Error('입장하고자 하는 방이 올바르지 않습니다.');
      }

      await connectSocket();

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
      <MainMap restaurantData={restaurantData} roomLocation={roomLocation} />
      <HeaderBox>
        <Header>
          <ActiveUserInfo
            myId={myId}
            myName={myName}
            socketRef={socketRef}
            joinList={joinList}
            setJoinList={setJoinList}
          />
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
    </MainPageLayout>
  );
}

export default MainPage;
