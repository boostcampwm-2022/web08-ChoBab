import RestaurantRow from '@components/RestaurantRow';
import { RESTAURANT_LIST_TYPES } from '@constants/modal';
import EmptyListPlaceholder from '@components/EmptyListPlaceholder';
import { CandidateListModalBox, CandidateListModalLayout } from './styles';

interface CandidateType {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  like: number;
  rating?: number;
  thumbnailImage?: string;
}

interface PropsType {
  candidateData: RestaurantType[];
}

class CandidateMap {
  [key: string]: CandidateType;
}

export function CandidateListModal({ candidateData }: PropsType) {
  return (
    <CandidateListModalLayout>
      {!candidateData.length ? (
        <EmptyListPlaceholder />
      ) : (
        <CandidateListModalBox>
          {candidateData.map((candidate) => (
            <RestaurantRow
              key={candidate.id}
              restaurant={candidate}
              restaurantListType={RESTAURANT_LIST_TYPES.candidate}
            />
          ))}
        </CandidateListModalBox>
      )}
    </CandidateListModalLayout>
  );
}
