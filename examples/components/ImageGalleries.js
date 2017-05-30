import React from 'react';
import { Dimensions } from 'react-native';

import { Stage } from './Stage';
import {
  View,
  ImageGallery,
} from '../../index';

const window = Dimensions.get('window');

export function ImageGalleries() {
  return (
    <View styleName="vertical collapsible">
      <Stage title="Image Gallery">
        <View style={{ height: 500, width: window.width }}>
          <ImageGallery
            data={[
              { description: 'description', title: 'title', source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-1.png' }},
              { description: 'description', title: 'title', source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-2.png' }},
              { description: 'description', title: 'title', source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-3.png' }},
              { description: 'description', title: 'title', source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-4.png' }},
            ]}
            pageMargin={20}
          />
        </View>
      </Stage>
    </View>
  );
}
