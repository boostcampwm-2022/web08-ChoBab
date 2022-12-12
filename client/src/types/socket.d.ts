declare interface UserType {
  userId: string;
  userLat: number;
  userLng: number;
  userName?: string;
}

declare interface RestaurantType {
  id: string;
  name: string;
  category: string;
  phone: string;
  lat: number;
  lng: number;
  address: string;
  rating?: number;
  photoUrlList?: string[];
}

declare interface ResTemplateType<T> {
  message: string;
  data: T;
}

declare interface RoomValidType {
  isRoomValid: boolean;
}

declare interface RoomCodeType {
  roomCode: string;
}

declare interface RoomDataType extends RoomCodeType {
  lat: number;
  lng: number;
  userList: { [index: string]: UserType };
  restaurantList: RestaurantType[];
  candidateList: { [index: string]: number };
  userId: string;
  userName: string;
}

declare interface DrivingInfoType {
  start: number[];
  goal: number[];
  distance: number;
  duration: number;
  tollFare: number;
  taxiFare: number;
  fuelPrice: number;
  path: number[][];
}

declare type UserIdType = string;

declare interface JoinListType {
  [index: UserIdType]: UserType;
}
