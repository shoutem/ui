import { HTMLContentModel, HTMLElementModel } from 'react-native-render-html';

export const videoModel = HTMLElementModel.fromCustomModel({
  contentModel: HTMLContentModel.block,
  tagName: 'video',
  isOpaque: true,
});
