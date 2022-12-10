import { API_URL } from '@constants/url';
import axios from 'axios';

export const apiService = {
    getRoomValid: async (roomCode: string) => {
      const {
        data: {
          data: { isRoomValid },
        },
      } = await axios.get<ResTemplateType<RoomValidType>>(API_URL.GET.ROOM_VALID, {
        params: { roomCode },
      });
      return isRoomValid;
    },

    getDrivingInfoData: async (
      startLat: number,
      startLng: number,
      goalLat: number,
      goalLng: number
    ) => {
      const {
        data: { data: drivingInfoData },
      } = await axios.get<ResTemplateType<DrivingInfoType>>(API_URL.GET.DRIVING_INFO, {
        params: {
          start: `${startLng},${startLat}`,
          goal: `${goalLng},${goalLat}`,
        },
      });
      return drivingInfoData;
    },

    postRoom: async (lat: number, lng: number) => {
      const {
        data: {
          data: { roomCode },
        },
      } = await axios.post<ResTemplateType<RoomCodeType>>(API_URL.POST.CREATE_ROOM, {
        lat,
        lng,
      });

      return roomCode;
    },
};
