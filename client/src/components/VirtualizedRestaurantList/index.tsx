import { CSSProperties, useRef, useState, useEffect } from 'react';
import { VariableSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';

import RestaurantRow from '@components/RestaurantRow';
import LoadingScreen from '@components/LoadingScreen';

import { RESTAURANT_LIST_TYPES, RESTAURANT_DETAIL_TYPES } from '@constants/modal';
import { useRestaurantDetailLayerStatusStore, useSelectedRestaurantDataStore } from '@store/index';
import { RestaurantFilteredList, RestaurantFilteredItem } from './styles';

interface PropsType {
  filteredRestaurantList: RestaurantType[];
}

function VirtualizedRestaurantList({ filteredRestaurantList }: PropsType) {
  const { updateRestaurantDetailLayerStatus } = useRestaurantDetailLayerStatusStore(
    (state) => state
  );
  const { updateSelectedRestaurantData } = useSelectedRestaurantDataStore((state) => state);

  const [hasNextPage, setHasNextPage] = useState(true); // 다음 페이지 존재 여부
  const [isNextPageLoading, setIsNextPageLoading] = useState(false); // 다음 페이지 로딩중
  const [items, setItems] = useState<RestaurantType[]>([]); // 여태껏 로드된 아이템(가상화 목록에 추가된 아이템)
  const itemRef = useRef(null); // TODO: 요소의 높이를 받아오기 위해 필요, 방법 찾는 중

  let itemCount = hasNextPage ? items.length + 1 : items.length;

  const isItemLoaded = (index: number) => !hasNextPage || index < items.length;

  const getItemSize = (index: any) => {
    // console.log(itemRef.current.offsetWidth);
    // 여기서 아이템 행 높이를 받아오는 법?
    return 160;
  };

  // 필터 조건이 변경돼 필터링 데이터가 바뀌는 경우
  useEffect(() => {
    // 가상화 목록 초기화
    setItems([]);
    itemCount = 0;

    // 다음페이지 로드를 위한 상태 변경
    setHasNextPage(true);
  }, [filteredRestaurantList]);

  // eslint-disable-next-line react/no-unstable-nested-components
  function Row({ index, style }: { index: number; style: CSSProperties }) {
    const restaurant = items[index];

    return !isItemLoaded(index) ? (
      <div style={style} ref={itemRef}>
        <LoadingScreen size={index === 0 ? 'large' : 'small'} />
      </div>
    ) : (
      <div style={style} ref={itemRef}>
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

  const loadNextPage = (startIndex: number) => {
    // 현재 스크롤 시 axios 요청을 안보내기 때문에, 의도적으로 delay time 걸음
    // 초기 로딩 시엔 delay time을 200ms로 짧게 설정
    const delayTime = startIndex === 0 ? 200 : 1000;

    setIsNextPageLoading(true);
    // console.log(startIndex);
    // console.log(delayTime);
    // console.log(items.length);
    // console.log(filteredRestaurantList.length); //45 개

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsNextPageLoading(false);
        setHasNextPage(items.length < filteredRestaurantList.length); // 가상화 목록 아이템 수 < 보여줘야할 데이터 개수 일때만 true
        setItems([...items].concat(filteredRestaurantList.slice(startIndex, startIndex + 5)));
        resolve();
      }, delayTime);
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  return (
    <AutoSizer>
      {({ height, width }) => (
        <RestaurantFilteredList>
          <InfiniteLoader
            isItemLoaded={(index: number) => {
              return index < items.length;
            }}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <VariableSizeList
                height={height}
                width={width}
                itemCount={itemCount}
                itemSize={getItemSize}
                onItemsRendered={onItemsRendered}
                ref={ref}
              >
                {Row}
              </VariableSizeList>
            )}
          </InfiniteLoader>
        </RestaurantFilteredList>
      )}
    </AutoSizer>
  );
}

export default VirtualizedRestaurantList;
