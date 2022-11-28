declare module 'http' {
  interface IncomingMessage {
    session: session & {
      nickName: string;
    };
    sessionID: string;
  }
}
