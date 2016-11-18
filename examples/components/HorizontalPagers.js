import React from 'react';

import { Stage } from './Stage';
import {
  View,
  HorizontalPager,
  Tile,
  Overlay,
  Icon,
  Image,
  Subtitle,
  Caption,
} from '../../index';

export function HorizontalPagers() {
  return (
    <View styleName="vertical collapsible">
      <Stage title="Horizontal Pager (with tiles as content)">
        <HorizontalPager
          data={[
            { description: 'description', title: 'When The Morning Dawns - DJ Silver Sample Album', source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-1.png' }},
            { description: 'description', title: 'When The Morning Dawns', source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-2.png' }},
            { description: 'description', title: 'DJ Silver Sample Album', source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-3.png' }},
            { description: 'description', title: 'When The Morning Dawns - DJ Silver Sample Album', source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-4.png' }},
          ]}
          renderPage={(page) => {
            return (
              <Tile styleName="clear">
                <Image
                  styleName="large-wide"
                  source={{ uri: page.source.uri }}
                >
                  <Overlay styleName="fill-parent">
                  <Subtitle numberOfLines={2}>{page.title}</Subtitle>
                  <Caption>{page.description}</Caption>
                  </Overlay>
                </Image>
              </Tile>
            );
          }}
          pageMargin={20}
        />
      </Stage>
    </View>
  );
}
