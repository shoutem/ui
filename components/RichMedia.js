import React from 'react';
import { Html } from '../html';

export default function RichMedia({ body }) {
  console.warn('RichMedia is deprecated and will be removed in next verions.');

  if (!body) {
    console.log('Missing body in RichMedia component.')
    return null;
  }

  return <Html body={body} />;
}
