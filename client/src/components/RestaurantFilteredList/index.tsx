import { useRestaurantDetailLayerStatusStore, useSelectedRestaurantDataStore , useSelectedCategoryStore } from '@store/index';
import RestaurantRow from '@components/RestaurantRow';
import { RESTAURANT_LIST_TYPES, RESTAURANT_DETAIL_TYPES } from '@constants/modal';
import { CATEGORY_TYPE } from '@constants/category';
import {
  RestaurantFilteredParagraph,
  RestaurantFilteredBox,
  RestaurantFilteredList,
  RestaurantFilteredItem,
  RestaurantFilteredGuideBox,
} from './styles';

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
        <RestaurantFilteredGuideBox>
          <RestaurantFilteredParagraph>
            {['컾', '핒', '짲', '잌', '칰'][Math.floor(Math.random() * 5)]}
          </RestaurantFilteredParagraph>
        </RestaurantFilteredGuideBox>
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
