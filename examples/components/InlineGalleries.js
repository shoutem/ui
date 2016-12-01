import React from 'react';

import { Stage } from './Stage';
import {
  View,
  InlineGallery,
} from '../../index';

export function InlineGalleries() {
  return (
    <View styleName="vertical collapsible">
      <Stage title="Inline Gallery (regular size)">
        <InlineGallery
          data={[
            { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-1.png' }},
            { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-2.png' }},
            { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-3.png' }},
            { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-4.png' }},
          ]}
          pageMargin={20}
        />
      </Stage>

      <Stage title="Inline Gallery (large-wide size)">
        <InlineGallery
          data={[
            { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-1.png' }},
            { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-2.png' }},
            { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-3.png' }},
            { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-4.png' }},
          ]}
          pageMargin={20}
          styleName="large-wide"
        />
      </Stage>

      <Stage title="Inline Gallery (large-ultra-wide size)">
        <InlineGallery
          data={[
            { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-1.png' }},
            { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-2.png' }},
            { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-3.png' }},
            { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-4.png' }},
          ]}
          pageMargin={20}
          styleName="large-ultra-wide"
        />
      </Stage>
    </View>
  );
}
