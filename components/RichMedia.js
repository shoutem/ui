import React from 'react';
import PropTypes from 'prop-types';
import { Html } from '../html';

export default function RichMedia({ body }) {
  console.warn('RichMedia is deprecated and will be removed in next versions.');
  return <Html body={body} />;
}

RichMedia.propTypes = {
  body: PropTypes.string.isRequired,
};
