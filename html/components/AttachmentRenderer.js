import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { resolveDimensions } from '../services/Dimensions';
import Image from './Image';

const AttachmentRenderer = ({ id, type, style, attachments }) => {
  if (!attachments) {
    return null;
  }

  if (type === 'image') {
    const image = _.find(attachments, { id });

    if (image && image.src) {
      const source = { uri: image.src };
      const imageSize = { width: image.width, height: image.height };
      const { height, width } = resolveDimensions(imageSize, style);
      const resolvedStyle = { alignSelf: 'center', height, width };

      return <Image source={source} key={id} style={resolvedStyle} />;
    }
  }

  return null;
};

AttachmentRenderer.propTypes = {
  attachments: PropTypes.oneOf([PropTypes.array, PropTypes.object]),
  id: PropTypes.any,
  style: PropTypes.any,
  type: PropTypes.any,
};

AttachmentRenderer.defaultProps = {
  id: undefined,
  type: undefined,
  attachments: undefined,
  style: undefined,
};

export default AttachmentRenderer;
