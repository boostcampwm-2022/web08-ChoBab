export const URL_PATH = Object.freeze({
  HOME: '/',
  INIT_ROOM: '/init-room',
  JOIN_ROOM: '/room',
  FAIL_CREATE_ROOM: '/fail-create-room',
  INVALID_ROOM: '/error/invalid-room',
  INTERNAL_SERVER_ERROR: '/error/internal-server',
});

export const API_URL = Object.freeze({
  GET: Object.freeze({
    ROOM_VALID: '/api/room/valid',
    DRIVING_INFO: '/api/map/driving',
  }),

  POST: Object.freeze({
    CREATE_ROOM: '/api/room',
  }),
});
