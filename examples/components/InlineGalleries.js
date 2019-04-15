import React from 'react';
import { Dimensions } from 'react-native';

import { View } from '../../components/View';
import { InlineGallery } from '../../components/InlineGallery';
import { Stage } from './Stage';

const window = Dimensions.get('window');

export function InlineGalleries() {
  return (
    <View styleName="vertical collapsible">
      <Stage title="Inline Gallery (regular size)">
        <View style={{ flex: 1, width: window.width }}>
          <InlineGallery
            data={[
              { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-1.png' } },
              { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-2.png' } },
              { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-3.png' } },
              { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-4.png' } },
            ]}
            pageMargin={20}
          />
        </View>
      </Stage>

      <Stage title="Inline Gallery (large-wide size)">
        <View style={{ flex: 1, width: window.width }}>
          <InlineGallery
            data={[
              { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-1.png' } },
              { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-2.png' } },
              { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-3.png' } },
              { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-4.png' } },
            ]}
            pageMargin={20}
            styleName="large-wide"
          />
        </View>
      </Stage>

      <Stage title="Inline Gallery (large-ultra-wide size)">
        <View style={{ flex: 1, width: window.width }}>
          <InlineGallery
            data={[
              { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-1.png' } },
              { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-2.png' } },
              { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-3.png' } },
              { source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-4.png' } },
            ]}
            pageMargin={20}
            styleName="large-ultra-wide"
          />
        </View>
      </Stage>
    </View>
  );
}
