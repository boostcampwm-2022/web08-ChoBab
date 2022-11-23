/**
 * DTO: Data Transfer Object (데이터 계층 간 통신을 위한 객체)
 */
export class GetRestaurantDto {
  lat: number;
  lng: number;
  radius: number;
  roomCode: string;
}
