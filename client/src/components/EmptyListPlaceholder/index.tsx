import {
  EmptyListPlaceholderGuideBox,
  EmptyListPlaceholderParagraph,
  EmptyListPlaceholderIconBox,
} from './styles';

function EmptyListPlaceholder() {
  return (
    <EmptyListPlaceholderGuideBox>
      <EmptyListPlaceholderIconBox>
        {['컾', '핒', '짲', '잌', '칰'][Math.floor(Math.random() * 5)]}
      </EmptyListPlaceholderIconBox>
      <EmptyListPlaceholderParagraph>목록이 텅~ 비었어요</EmptyListPlaceholderParagraph>
    </EmptyListPlaceholderGuideBox>
  );
}

export default EmptyListPlaceholder;
