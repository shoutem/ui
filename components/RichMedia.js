import React from 'react';
import { Html } from '../html';

export default function RichMedia({ body }) {
  console.warn('RichMedia is deprecated and will be removed in next versions.');
  return <Html body={body} />;
}

RichMedia.propTypes = {
  body: React.PropTypes.string.isRequired,
};
