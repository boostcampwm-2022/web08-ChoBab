import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '@hooks/useSocket';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useCurrentLocation from '@hooks/useCurrentLocation';
import { HeaderBox, MainPageLayout, MapBox, CategoryToggle, Header } from './styles';

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
  const mapRef = useRef<HTMLDivElement>(null);
  const userLocation = useCurrentLocation();
  const { roomCode } = useParams<{ roomCode: string }>();
  const [isRoomConnect, setRoomConnect] = useState<boolean>(false);
  const [socketRef, connectSocket, disconnectSocket] = useSocket();

  const [restaurantData, setRestaurantData] = useState<RestaurantType[]>([]);
  const [roomLocation, setRoomLocation] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });

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

  const initMap = () => {
    if (!mapRef.current || !roomLocation.lat || !roomLocation.lng) {
      return;
    }
    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(roomLocation.lat, roomLocation.lng),
      zoom: 14,
    });
  };

  useEffect(() => {
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

  useEffect(() => {
    if (!isRoomConnect) {
      return;
    }
    if (!mapRef.current) {
      return;
    }
    if (!roomLocation.lat || !roomLocation.lng) {
      return;
    }
    initMap();
  }, [isRoomConnect]);

  return !isRoomConnect ? (
    <div>loading...</div>
  ) : (
    <MainPageLayout>
      <MapBox ref={mapRef} />
      <HeaderBox>
        <Header>헤더</Header>
        <CategoryToggle>토글</CategoryToggle>
      </HeaderBox>
    </MainPageLayout>
  );
}

export default MainPage;
