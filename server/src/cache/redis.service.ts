import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { MergedRestaurantType } from '@restaurant/restaurant';
import { Cache } from 'cache-manager';

interface UserType {
  userId: string;
  userLat: number;
  userLng: number;
  userName: string;
}

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private readonly redisKey = {
    restaurantList: (roomCode: string) => `ROOM_CODE:${roomCode}:RESTAURANT_LIST`,
    candidateList: (roomCode: string) => `ROOM_CODE:${roomCode}:CANDIDATE_LIST`,
    userLikeList: (roomCode: string, userId: string) =>
      `ROOM_CODE:${roomCode}:USER_ID:${userId}:CANDIDATE_LIST`,
    joinList: (roomCode: string) => `ROOM_CODE:${roomCode}:JOIN_LIST`,
  };

  restaurantList = {
    setRestaurantListForRoom: async (roomCode: string, restaurantList: MergedRestaurantType[]) => {
      const restaurantListKey = this.redisKey.restaurantList(roomCode);
      await this.cacheManager.set(restaurantListKey, restaurantList);
    },

    getRestaurantListForRoom: async (roomCode: string) => {
      const restaurantListKey = this.redisKey.restaurantList(roomCode);
      const result = await this.cacheManager.get<MergedRestaurantType[]>(restaurantListKey);
      return result;
    },
  };

  candidateList = {
    createEmptyCandidateListForRoom: async (
      roomCode: string,
      restaurantList: MergedRestaurantType[]
    ) => {
      const candidateListKey = this.redisKey.candidateList(roomCode);
      const candidateHash = restaurantList.reduce((hash, restaurant) => {
        hash[restaurant.id] = 0;
        return hash;
      }, {});
      await this.cacheManager.set(candidateListKey, candidateHash);
    },

    getCandidateList: async (roomCode: string) => {
      const candidateListKey = this.redisKey.candidateList(roomCode);
      const candidateHash = this.cacheManager.get<{ [index: string]: number }>(candidateListKey);
      return candidateHash;
    },

    likeCandidate: async (roomCode: string, userId: string, restaurantId: string) => {
      const candidateListKey = this.redisKey.candidateList(roomCode);
      const userLikeListKey = this.redisKey.userLikeList(roomCode, userId);
      const userLikeList = await this.cacheManager.get<string[]>(userLikeListKey);
      if (userLikeList.find((likeRestaurantId) => restaurantId === likeRestaurantId)) {
        // 이미 좋아요를 누른 음식점에 대한 처리
        return false;
      }
      const candidateHash = await this.cacheManager.get<{ [index: string]: number }>(
        candidateListKey
      );
      candidateHash[restaurantId] += 1;
      await this.cacheManager.set(candidateListKey, candidateHash);
      await this.cacheManager.set(userLikeListKey, [...userLikeList, restaurantId]);
    },

    unlikeCandidate: async (roomCode: string, userId: string, restaurantId: string) => {
      const candidateListKey = this.redisKey.candidateList(roomCode);
      const userLikeListKey = this.redisKey.userLikeList(roomCode, userId);
      const userLikeList = await this.cacheManager.get<string[]>(userLikeListKey);
      if (!userLikeList.find((likeRestaurantId) => restaurantId === likeRestaurantId)) {
        // 좋아요를 누른 적이 없는데 좋아요 취소 요청이 들어왔을 때에 대한 처리
        return false;
      }
      const candidateHash = await this.cacheManager.get<{ [index: string]: number }>(
        candidateListKey
      );
      candidateHash[restaurantId] -= 1;
      await this.cacheManager.set(candidateListKey, candidateHash);
      await this.cacheManager.set(
        userLikeListKey,
        userLikeList.filter((likeRestaurantId) => likeRestaurantId !== restaurantId)
      );
    },
  };

  joinList = {
    createEmptyJoinListForRoom: async (roomCode: string) => {
      const joinListKey = this.redisKey.joinList(roomCode);
      await this.cacheManager.set(joinListKey, {});
    },

    getJoinList: async (roomCode: string) => {
      const joinListKey = this.redisKey.joinList(roomCode);
      const findJoinHash = await this.cacheManager.get<{ [index: string]: UserType }>(joinListKey);
      return findJoinHash;
    },

    addUserToJoinList: async (roomCode: string, user: UserType) => {
      const { userId } = user;
      const joinListKey = this.redisKey.joinList(roomCode);
      const userLikeListKey = this.redisKey.userLikeList(roomCode, userId);
      const findJoinHash = await this.cacheManager.get<{ [index: string]: UserType }>(joinListKey);
      // 이미 입장한 상태일 때
      if (findJoinHash[userId]) {
        return;
      }
      const addUserData = {};
      addUserData[userId] = user;
      await this.cacheManager.set(userLikeListKey, []);
      await this.cacheManager.set(joinListKey, { ...findJoinHash, ...addUserData });
    },

    delUserToJoinList: async (roomCode: string, userId: string) => {
      const joinListKey = this.redisKey.joinList(roomCode);
      const findJoinHash = await this.cacheManager.get<{ [index: string]: UserType }>(joinListKey);
      if (!findJoinHash[userId]) {
        return;
      }
      delete findJoinHash[userId];
      await this.cacheManager.set(joinListKey, findJoinHash);
    },
  };
}
