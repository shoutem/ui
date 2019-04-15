import React from 'react';
import { Dimensions } from 'react-native';

import { Caption, Subtitle } from '../../Text';
import { View } from '../../components/View';
import { HorizontalPager } from '../../components/HorizontalPager';
import { Tile } from '../../Tile';
import { ImageBackground } from '../../ImageBackground';
import { Stage } from './Stage';

const window = Dimensions.get('window');

export function HorizontalPagers() {
  return (
    <View styleName="vertical collapsible">
      <Stage title="Horizontal Pager (with tiles as content)">
        <View style={{ height: 250, width: window.width }}>
          <HorizontalPager
            data={[
              { description: 'description', title: 'When The Morning Dawns - DJ Silver Sample Album', source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-1.png' }},
              { description: 'description', title: 'When The Morning Dawns', source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-2.png' }},
              { description: 'description', title: 'DJ Silver Sample Album', source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-3.png' }},
              { description: 'description', title: 'When The Morning Dawns - DJ Silver Sample Album', source: { uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-4.png' }},
            ]}
            renderPage={(page) => {
              return (
                <ImageBackground
                  styleName="large-wide"
                  source={{ uri: page.source.uri }}
                >
                  <Tile>
                    <Subtitle numberOfLines={2}>{page.title}</Subtitle>
                    <Caption>{page.description}</Caption>
                  </Tile>
                </ImageBackground>
              );
            }}
            pageMargin={20}
          />
        </View>
      </Stage>
    </View>
  );
}
