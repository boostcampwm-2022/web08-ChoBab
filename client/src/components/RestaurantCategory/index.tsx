import { useState } from 'react';
import Modal from '@components/Modal';
import { CATEGORY_TYPE } from '@constants/category';
import { useSelectedCategoryStore } from '@store/index';
import { ReactComponent as ArrowDown } from '@assets/images/arrow-down.svg';
import {
  RestaurantCategoryGuideParagraph,
  RestaurantCategoryToggleButton,
  RestaurantCategoryControlBarBox,
  RestaurantCategoryBox,
  RestaurantCategoryLayout,
  RestaurantCategoryList,
  RestaurantCategoryItem,
} from './styles';

function RestaurantCategory() {
  const [isCategoryOpen, setCategoryOpen] = useState<boolean>(false);

  const { selectedCategoryData, updateSelectedCategoryData } = useSelectedCategoryStore(
    (state) => state
  );

  const handleToggleCategory = (categoryName: CATEGORY_TYPE | null): (() => void) => {
    return (): void => {
      // '전체'가 선택된 경우
      if (!categoryName) {
        updateSelectedCategoryData(new Set());
        return;
      }

      // '카테고리'가 선택된 경우
      const newSelectedCategoryData = new Set(selectedCategoryData);

      if (selectedCategoryData.has(categoryName)) {
        newSelectedCategoryData.delete(categoryName);
      } else {
        newSelectedCategoryData.add(categoryName);
      }

      // '카테고리'가 전부 선택된 경우
      if (newSelectedCategoryData.size === Object.keys(CATEGORY_TYPE).length) {
        updateSelectedCategoryData(new Set());
        return;
      }

      updateSelectedCategoryData(newSelectedCategoryData);
    };
  };

  return (
    <RestaurantCategoryLayout>
      <RestaurantCategoryControlBarBox>
        <RestaurantCategoryGuideParagraph>
          {!selectedCategoryData.size
            ? '먹고싶은 음식을 선택해주세요!'
            : [...selectedCategoryData].join(', ')}
        </RestaurantCategoryGuideParagraph>
        <RestaurantCategoryToggleButton
          isOpen={isCategoryOpen}
          type="button"
          onClick={(event) => {
            setCategoryOpen(!isCategoryOpen);

            event.stopPropagation();
          }}
        >
          <ArrowDown />
        </RestaurantCategoryToggleButton>
      </RestaurantCategoryControlBarBox>

      <Modal isOpen={isCategoryOpen} setIsOpen={setCategoryOpen}>
        <RestaurantCategoryBox>
          <RestaurantCategoryList>
            <RestaurantCategoryItem
              isSelect={!selectedCategoryData.size}
              onClick={handleToggleCategory(null)}
            >
              전체
            </RestaurantCategoryItem>
            {Object.values(CATEGORY_TYPE).map((categoryName, index) => {
              return (
                <RestaurantCategoryItem
                  isSelect={selectedCategoryData.has(categoryName)}
                  // categoryName은 변하지 않는 데이터. index와 함께 쓸 명분이 있다.
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${categoryName}${index}`}
                  onClick={handleToggleCategory(categoryName)}
                >
                  {categoryName}
                </RestaurantCategoryItem>
              );
            })}
          </RestaurantCategoryList>
        </RestaurantCategoryBox>
      </Modal>
    </RestaurantCategoryLayout>
  );
}

export default RestaurantCategory;
