import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '@hooks/useSocket';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useRestaurantListLayerStatusStore } from '@store/index';

import { ReactComponent as CandidateListIcon } from '@assets/images/candidate-list.svg';
import { ReactComponent as ListIcon } from '@assets/images/list-icon.svg';
import { RestaurantDetailModal } from '@components/RestaurantDetailModal';
import { AnimatePresence } from 'framer-motion';
import { ReactComponent as MapIcon } from '@assets/images/map-icon.svg';
import { ReactComponent as MapLocationIcon } from '@assets/images/map-location.svg';

import ActiveUserInfo from '@components/ActiveUserInfo';
import LinkShareButton from '@components/LinkShareButton';
import MainMap from '@components/MainMap';

import { NAVER_LAT, NAVER_LNG } from '@constants/map';
import { RESTAURANT_LIST_TYPES } from '@constants/modal';

import useCurrentLocation from '@hooks/useCurrentLocation';

import RestaurantListLayer from '@components/RestaurantListLayer';
import RestaurantDetailLayer from '@components/RestaurantDetailLayer';

import {
  ButtonInnerTextBox,
  CandidateListButton,
  CategoryToggle,
  Header,
  HeaderBox,
  MainPageLayout,
  MapOrListButton,
} from './styles';

function MainPage() {
  const userLocation = useCurrentLocation();
  const { roomCode } = useParams<{ roomCode: string }>();
  const [isRoomConnect, setRoomConnect] = useState<boolean>(false);
  const [socketRef, connectSocket, disconnectSocket] = useSocket();

  const [myId, setMyId] = useState<string>('');
  const [myName, setMyName] = useState<string>('');
  const [joinList, setJoinList] = useState<Map<string, UserType>>(new Map());
  const [restaurantData, setRestaurantData] = useState<RestaurantType[]>([]);
  const [candidateData, setCandidateData] = useState<RestaurantType[]>([]);
  const [roomLocation, setRoomLocation] = useState<{ lat: number; lng: number }>({
    lat: NAVER_LAT,
    lng: NAVER_LNG,
  });

  const { restaurantListLayerStatus, updateRestaurantListLayerStatus } =
    useRestaurantListLayerStatusStore((state) => state);

  const isMap = () => {
    return restaurantListLayerStatus === RESTAURANT_LIST_TYPES.hidden;
  };

  const isRestaurantFilteredList = () => {
    return restaurantListLayerStatus === RESTAURANT_LIST_TYPES.filtered;
  };

  const isRestaurantCandidateList = () => {
    return restaurantListLayerStatus === RESTAURANT_LIST_TYPES.candidate;
  };

  const handleSwitchCandidateList = () => {
    if (isMap() || isRestaurantFilteredList()) {
      updateRestaurantListLayerStatus(RESTAURANT_LIST_TYPES.candidate);
      return;
    }

    updateRestaurantListLayerStatus(RESTAURANT_LIST_TYPES.hidden);
  };

  const handleSwitchRestaurantList = () => {
    if (isMap() || isRestaurantCandidateList()) {
      updateRestaurantListLayerStatus(RESTAURANT_LIST_TYPES.filtered);
      return;
    }

    updateRestaurantListLayerStatus(RESTAURANT_LIST_TYPES.hidden);
  };

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
      setCandidateData(candidateList);
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

      {/* 식당 후보 목록 <-> 지도 화면 */}
      {/* 식당 후보 목록 <-- 전체 식당 목록 */}
      <CandidateListButton onClick={handleSwitchCandidateList}>
        {isRestaurantCandidateList() ? <MapLocationIcon /> : <CandidateListIcon />}
      </CandidateListButton>

      {/* 전체 식당 목록 <-> 지도 화면 */}
      {/* 전체 식당 목록 <-- 식당 후보 목록 */}
      <MapOrListButton onClick={handleSwitchRestaurantList}>
        {isRestaurantFilteredList() ? <MapIcon /> : <ListIcon />}
        <ButtonInnerTextBox>
          {isRestaurantFilteredList() ? '지도보기' : '목록보기'}
        </ButtonInnerTextBox>
      </MapOrListButton>

      {/* 식당 리스트 & 식당 상세정보 Full-Screen 모달 컴포넌트 */}
      <RestaurantListLayer restaurantData={restaurantData} candidateData={candidateData} />
      <RestaurantDetailLayer />
    </MainPageLayout>
  );
}

export default MainPage;
