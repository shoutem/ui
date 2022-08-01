import React from 'react';
import renderer from 'react-test-renderer';
import { View } from '../components/View';

test('View renders correctly', () => {
  const tree = renderer.create(
    <View style={{ height: 40, width: 40, backgroundColor: 'red' }} />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

test('View renders children vertically with vertical styleName', () => {
  const tree = renderer.create(
    <View styleName="vertical">
      <View style={{ height: 40, width: 40, backgroundColor: 'red' }} />
      <View style={{ height: 40, width: 40, backgroundColor: 'green' }} />
    </View>
  );
});

test('View centers children horizontally with h-center styleName', () => {
  const tree = renderer.create(
    <View style={{ width: 100 }} styleName="vertical h-center">
      <View style={{ height: 40, width: 40, backgroundColor: 'red' }} />
      <View style={{ height: 40, width: 40, backgroundColor: 'green' }} />
    </View>
  );
});

test('View renders children horizontally with horizontal styleName', () => {
  const tree = renderer.create(
    <View styleName="horizontal">
      <View style={{ height: 40, width: 40, backgroundColor: 'red' }} />
      <View style={{ height: 40, width: 40, backgroundColor: 'green' }} />
    </View>
  );
});

test('View centers children vertically with v-center styleName', () => {
  const tree = renderer.create(
    <View style={{ height: 100 }} styleName="horizontal v-center">
      <View style={{ height: 40, width: 40, backgroundColor: 'red' }} />
      <View style={{ height: 40, width: 40, backgroundColor: 'green' }} />
    </View>
  );
});

test('View fills parent with fill-parent styleName', () => {
  const tree = renderer.create(
    <View style={{ height: 40, width: 40 }}>
      <View style={{ backgroundColor: 'red' }} styleName="fill-parent" />
    </View>
  );
});
