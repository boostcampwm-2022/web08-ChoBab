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

  const restaurantFilteredList = restaurantData
    .slice(0, 20)
    .filter(
      (restaurant) =>
        selectedCategoryData.has(restaurant.category as CATEGORY_TYPE) || !selectedCategoryData.size
    );

  return (
    <RestaurantFilteredBox>
      {!restaurantFilteredList.length ? (
        <EmptyListPlaceholder />
      ) : (
        <RestaurantFilteredList>
          {restaurantFilteredList.map((restaurant) => {
            return (
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
            );
          })}
        </RestaurantFilteredList>
      )}
    </RestaurantFilteredBox>
  );
}

export default RestaurantFiltered;
