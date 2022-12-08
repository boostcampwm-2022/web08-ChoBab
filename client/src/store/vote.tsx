import create from 'zustand';

interface VotedRestaurantListType {
  votedRestaurantList: Set<string>;
  addVotedRestaurant: (restaurantId: string) => void;
  removeVotedRestaurant: (restaurantId: string) => void;
}

// 사용자가 투표한 식당 id 목록
export const useVotedRestaurantListStore = create<VotedRestaurantListType>((set) => ({
  votedRestaurantList: new Set(),
  // 투표
  addVotedRestaurant: (restaurantId) =>
    set((state) => ({ votedRestaurantList: new Set(state.votedRestaurantList).add(restaurantId) })),
  // 투표 취소
  removeVotedRestaurant: (restaurantId) =>
    set((state) => {
      const newList = new Set(state.votedRestaurantList);
      newList.delete(restaurantId);
      return { votedRestaurantList: newList };
    }),
}));
