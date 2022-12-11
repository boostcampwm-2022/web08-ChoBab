import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { MergedRestaurantType, RestaurantIdType } from '@restaurant/restaurant';
import { Cache } from 'cache-manager';

type UserIdType = string;

interface UserType {
  userId: UserIdType;
  userLat: number;
  userLng: number;
  userName: string;
}

interface CandidateHashType {
  [index: RestaurantIdType]: UserIdType[];
}

interface JoinListType {
  [index: UserIdType]: UserType;
}

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private readonly redisKey = {
    restaurantList: (roomCode: string) => `ROOM_CODE:${roomCode}:RESTAURANT_LIST`,
    candidateList: (roomCode: string) => `ROOM_CODE:${roomCode}:CANDIDATE_LIST`,
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
        hash[restaurant.id] = [];
        return hash;
      }, {});
      await this.cacheManager.set(candidateListKey, candidateHash);
    },

    getCandidateList: async (roomCode: string) => {
      const candidateListKey = this.redisKey.candidateList(roomCode);
      const candidateHash = this.cacheManager.get<CandidateHashType>(candidateListKey);
      return candidateHash;
    },

    likeCandidate: async (
      roomCode: string,
      userId: string,
      restaurantId: string
    ): Promise<boolean> => {
      const candidateListKey = this.redisKey.candidateList(roomCode);
      const candidateHash = await this.cacheManager.get<CandidateHashType>(candidateListKey);
      const restaurantVoteList = candidateHash[restaurantId];
      if (!restaurantVoteList) {
        // 이후 throw로 예외처리 필요
        return false;
      }
      // 이미 투표한 식당에 대한 처리
      if (restaurantVoteList.find((voter) => voter === userId)) {
        return false;
      }
      restaurantVoteList.push(userId);
      await this.cacheManager.set(candidateListKey, candidateHash);
      return true;
    },

    unlikeCandidate: async (
      roomCode: string,
      userId: string,
      restaurantId: string
    ): Promise<boolean> => {
      const candidateListKey = this.redisKey.candidateList(roomCode);
      const candidateHash = await this.cacheManager.get<CandidateHashType>(candidateListKey);
      const restaurantVoteList = candidateHash[restaurantId];
      if (!restaurantVoteList) {
        // 이후 throw로 예외처리 필요
        return false;
      }
      // 이전에 투표한 적 없는 식당에 대한 처리
      if (!restaurantVoteList.find((voter) => voter === userId)) {
        return false;
      }
      candidateHash[restaurantId] = restaurantVoteList.filter((voter) => voter !== userId);
      await this.cacheManager.set(candidateListKey, candidateHash);
      return true;
    },
  };

  joinList = {
    createEmptyJoinListForRoom: async (roomCode: string) => {
      const joinListKey = this.redisKey.joinList(roomCode);
      await this.cacheManager.set(joinListKey, {});
    },

    getJoinList: async (roomCode: string) => {
      const joinListKey = this.redisKey.joinList(roomCode);
      const findJoinHash = await this.cacheManager.get<JoinListType>(joinListKey);
      return findJoinHash;
    },

    addUserToJoinList: async (roomCode: string, user: UserType) => {
      const { userId } = user;
      const joinListKey = this.redisKey.joinList(roomCode);
      const findJoinHash = await this.cacheManager.get<JoinListType>(joinListKey);
      // 이미 입장한 상태일 때
      if (findJoinHash[userId]) {
        return;
      }
      const addUserData = {};
      addUserData[userId] = user;
      await this.cacheManager.set(joinListKey, { ...findJoinHash, ...addUserData });
    },

    delUserToJoinList: async (roomCode: string, userId: string) => {
      const joinListKey = this.redisKey.joinList(roomCode);
      const findJoinHash = await this.cacheManager.get<JoinListType>(joinListKey);
      if (!findJoinHash[userId]) {
        return;
      }
      delete findJoinHash[userId];
      await this.cacheManager.set(joinListKey, findJoinHash);
    },
  };
}
