import {
  Component,
  ComponentType,
  CSSProperties,
  Ref,
  Key,
  FunctionComponent,
  ComponentClass,
} from 'react';

import { VariableSizeList } from 'react-window';
import {
  useRestaurantDetailLayerStatusStore,
  useSelectedRestaurantDataStore,
  useSelectedCategoryStore,
} from '@store/index';
import RestaurantRow from '@components/RestaurantRow';
import EmptyListPlaceholder from '@components/EmptyListPlaceholder';
import { RESTAURANT_LIST_TYPES, RESTAURANT_DETAIL_TYPES } from '@constants/modal';
import { CATEGORY_TYPE } from '@constants/category';
import { RestaurantFilteredBox, RestaurantFilteredList, RestaurantFilteredItem } from './styles';

interface PropsType {
  restaurantData: RestaurantType[];
}

function RestaurantFiltered({ restaurantData }: PropsType) {
  const { updateRestaurantDetailLayerStatus } = useRestaurantDetailLayerStatusStore(
    (state) => state
  );

  const { selectedCategoryData } = useSelectedCategoryStore((state) => state);

  const { updateSelectedRestaurantData } = useSelectedRestaurantDataStore((state) => state);

  const isNotAnyFilter = () => {
    return selectedCategoryData.size === 0;
  };

  const restaurantFilteredList = restaurantData
    .filter(
      (restaurant) =>
        isNotAnyFilter() || selectedCategoryData.has(restaurant.category as CATEGORY_TYPE)
    )
    .slice(0, 20);

  const getItemSize = (index: any) => {
    // 아이템 행 높이 계산 필요
    return 200;
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  function Row({ index, style }: { index: number; style: CSSProperties }) {
    const restaurant = restaurantData[index];
    return (
      <div style={style}>
        <RestaurantFilteredItem
          onClick={() => {
            updateRestaurantDetailLayerStatus(RESTAURANT_DETAIL_TYPES.show);
            updateSelectedRestaurantData(restaurant);
          }}
          key={restaurant.id}
        >
          <RestaurantRow
            restaurant={restaurant}
            restaurantListType={RESTAURANT_LIST_TYPES.filtered}
          />
        </RestaurantFilteredItem>
      </div>
    );
  }

  return (
    <RestaurantFilteredBox>
      {!restaurantFilteredList.length ? (
        <EmptyListPlaceholder />
      ) : (
        <RestaurantFilteredList>
          <VariableSizeList
            height={400}
            width={300}
            itemCount={restaurantData.length}
            itemSize={getItemSize}
          >
            {Row}
          </VariableSizeList>
        </RestaurantFilteredList>
      )}
    </RestaurantFilteredBox>
  );
}

export default RestaurantFiltered;
