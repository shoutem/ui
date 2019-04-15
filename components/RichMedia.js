import PropTypes from 'prop-types';
import React from 'react';

import { Html } from '../html';

export default function RichMedia({ body }) {
  console.warn("'RichMedia' is deprecated and will be removed soon. Use 'Html' instead.");
  return <Html body={body} />;
}

RichMedia.propTypes = {
  body: PropTypes.string.isRequired,
};
