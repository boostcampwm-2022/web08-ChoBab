import 'socket.io'; // 이거 없으면 declare module 'socket.io' 오작동

declare module 'http' {
  interface IncomingMessage {
    session: session & {
      nickName: string;
    };
    sessionID: string;
  }
}

declare module 'socket.io' {
  class Socket {
    sessionID: string;
    roomCode: string;
  }
}

export interface VoteResultType {
  restaurantId: string;
  count: number;
}
