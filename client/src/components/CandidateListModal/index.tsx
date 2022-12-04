import { CandidateListModalLayout } from './styles';

export function CandidateListModal() {
  return (
    <CandidateListModalLayout
      initial={{ opacity: 0, y: 999 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 999 }}
     />
  );
}
