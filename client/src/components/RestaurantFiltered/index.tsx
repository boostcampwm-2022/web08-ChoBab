import { useRestaurantDetailStateStore } from '@store/index';
import RestaurantRow from '@components/RestaurantRow';
import { RESTAURANT_LIST_TYPES } from '@constants/modal';
import { RestaurantFilteredBox, RestaurantFilteredList, RestaurantFilteredItem } from './styles';

interface PropsType {
  restaurantData: RestaurantType[];
}

function RestaurantFilterd({ restaurantData }: PropsType) {
  const { updateRestaurantDetailState } = useRestaurantDetailStateStore((state) => state);

  return (
    <RestaurantFilteredBox>
      <RestaurantFilteredList>
        {restaurantData.slice(0, 20).map((restaurant) => {
          return (
            <RestaurantFilteredItem
              onClick={() => {
                updateRestaurantDetailState(restaurant);
              }}
              key={restaurant.id}
            >
              <RestaurantRow
                restaurant={restaurant}
                restaurantListType={RESTAURANT_LIST_TYPES.category}
              />
            </RestaurantFilteredItem>
          );
        })}
      </RestaurantFilteredList>
    </RestaurantFilteredBox>
  );
}

export default RestaurantFilterd;
