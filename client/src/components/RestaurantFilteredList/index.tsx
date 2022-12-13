import { useState, useEffect } from 'react';

import EmptyListPlaceholder from '@components/EmptyListPlaceholder';
import VirtualizedRestaurantList from '@components/VirtualizedRestaurantList';

import { CATEGORY_TYPE } from '@constants/category';
import { useSelectedCategoryStore, useMapStore } from '@store/index';
import { RestaurantFilteredBox } from './styles';

interface PropsType {
  restaurantData: RestaurantType[];
}

function RestaurantFiltered({ restaurantData }: PropsType) {
  const { map } = useMapStore((state) => state);

  // 필터된 식당 데이터
  const [filteredRestaurantList, setFilteredRestaurantList] = useState<RestaurantType[]>([]);

  // 카테고리로 필터링
  const { selectedCategoryData } = useSelectedCategoryStore((state) => state);
  const isNotAnyFilter = () => {
    return selectedCategoryData.size === 0;
  };

  useEffect(() => {
    const newRestaurantData = restaurantData.filter(
      (restaurant) =>
        isNotAnyFilter() || selectedCategoryData.has(restaurant.category as CATEGORY_TYPE)
    );

    if (!map) {
      setFilteredRestaurantList(newRestaurantData);
    } else {
      setFilteredRestaurantList(
        newRestaurantData.filter((restaurant) => {
          const { lat, lng } = restaurant;
          const mapBounds = map.getBounds() as naver.maps.LatLngBounds;
          return mapBounds.hasLatLng(new naver.maps.LatLng(lat, lng));
        })
      );
    }
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
