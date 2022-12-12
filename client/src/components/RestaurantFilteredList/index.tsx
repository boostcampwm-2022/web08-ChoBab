import { useState, useEffect } from 'react';

import EmptyListPlaceholder from '@components/EmptyListPlaceholder';
import VirtualizedRestaurantList from '@components/VirtualizedRestaurantList';

import { CATEGORY_TYPE } from '@constants/category';
import { useSelectedCategoryStore } from '@store/index';
import { RestaurantFilteredBox } from './styles';

interface PropsType {
  restaurantData: RestaurantType[];
}

function RestaurantFiltered({ restaurantData }: PropsType) {
  // 필터된 식당 데이터
  const [filteredRestaurantList, setFilteredRestaurantList] = useState<RestaurantType[]>([]);

  // 카테고리로 필터링
  const { selectedCategoryData } = useSelectedCategoryStore((state) => state);
  const isNotAnyFilter = () => {
    return selectedCategoryData.size === 0;
  };

  useEffect(() => {
    setFilteredRestaurantList(
      restaurantData.filter(
        (restaurant) =>
          isNotAnyFilter() || selectedCategoryData.has(restaurant.category as CATEGORY_TYPE)
      )
    );
  }, []);

  useEffect(() => {
    setFilteredRestaurantList(
      restaurantData.filter(
        (restaurant) =>
          isNotAnyFilter() || selectedCategoryData.has(restaurant.category as CATEGORY_TYPE)
      )
    );
  }, [selectedCategoryData]);

  return (
    <RestaurantFilteredBox>
      {!filteredRestaurantList.length ? (
        <EmptyListPlaceholder />
      ) : (
        <VirtualizedRestaurantList filteredRestaurantList={filteredRestaurantList} />
      )}
    </RestaurantFilteredBox>
  );
}

export default RestaurantFiltered;
