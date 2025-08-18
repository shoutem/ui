import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { resolveDimensions } from '../services/Dimensions';
import Image from './Image';

const AttachmentRenderer = ({ tnode, style, attachments }) => {
  if (!attachments || _.isEmpty(attachments)) {
    return null;
  }

  const image = _.find(attachments, { id: tnode?.id });

  if (!image || !image.src) {
    return null;
  }

  const source = { uri: image.src };
  const imageSize = { width: image.width, height: image.height };
  const { height, width } = resolveDimensions(imageSize, style);
  const resolvedStyle = { alignSelf: 'center', height, width };

  return <Image source={source} key={tnode?.id} style={resolvedStyle} />;
};

AttachmentRenderer.propTypes = {
  attachments: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  style: PropTypes.any,
  tnode: PropTypes.object,
};

AttachmentRenderer.defaultProps = {
  attachments: undefined,
  style: undefined,
  tnode: {},
};

export default AttachmentRenderer;
