import { useRestaurantDetailLayerStatusStore, useSelectedRestaurantDataStore } from '@store/index';
import RestaurantRow from '@components/RestaurantRow';
import { RESTAURANT_LIST_TYPES, RESTAURANT_DETAIL_TYPES } from '@constants/modal';
import { RestaurantFilteredBox, RestaurantFilteredList, RestaurantFilteredItem } from './styles';

interface PropsType {
  restaurantData: RestaurantType[];
}

function RestaurantFiltered({ restaurantData }: PropsType) {
  const { updateRestaurantDetailLayerStatus } = useRestaurantDetailLayerStatusStore(
    (state) => state
  );

  const { updateSelectedRestaurantData } = useSelectedRestaurantDataStore((state) => state);

  return (
    <RestaurantFilteredBox>
      <RestaurantFilteredList>
        {restaurantData.slice(0, 20).map((restaurant) => {
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
    </RestaurantFilteredBox>
  );
}

export default RestaurantFiltered;
