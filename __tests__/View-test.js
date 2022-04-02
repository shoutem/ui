import React from 'react';
import renderer from 'react-test-renderer';
import { View } from '../components/View';

test('View renders correctly', () => {
  const tree = renderer.create(
    <View style={{ height: 40, width: 40, backgroundColor: 'red' }} />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
