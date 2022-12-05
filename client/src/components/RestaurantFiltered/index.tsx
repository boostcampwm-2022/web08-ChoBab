import { useRestaurantDetailStateStore } from '@store/index';
import RestaurantRow from '@components/RestaurantRow';
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
              <RestaurantRow restaurant={restaurant} />
            </RestaurantFilteredItem>
          );
        })}
      </RestaurantFilteredList>
    </RestaurantFilteredBox>
  );
}

export default RestaurantFilterd;
