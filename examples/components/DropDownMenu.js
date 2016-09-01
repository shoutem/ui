import React from 'react';

import { View } from '../../components/View';
import { Stage } from './Stage';
import { DropDownMenu } from '../../components/DropDownMenu';

export function DropDownMenus() {
  return (
    <View styleName="vertical collapsed">
      <Stage title="Dropdown">
        <DropDownMenu
          options={[
            {
              name: 'Lifestyle',
              id: '7',
            },
            {
              name: 'Food',
              id: '8',
            },
            {
              name: 'Nature',
              id: '9',
            },
            {
              name: 'Lifestyle',
              id: '7',
            },
            {
              name: 'Food',
              id: '8',
            },
            {
              name: 'Lifestyle',
              id: '7',
            },
            {
              name: 'Food',
              id: '8',
            },
            {
              name: 'Nature',
              id: '9',
            },
            {
              name: 'Lifestyle',
              id: '7',
            },
            {
              name: 'Food',
              id: '8',
            },
            {
              name: 'Lifestyle',
              id: '7',
            },
            {
              name: 'Food',
              id: '8',
            },
            {
              name: 'Nature',
              id: '9',
            },
            {
              name: 'Lifestyle',
              id: '7',
            },
            {
              name: 'Food',
              id: '8',
            },
            {
              name: 'Lifestyle',
              id: '7',
            },
            {
              name: 'Food',
              id: '8',
            },
            {
              name: 'Nature',
              id: '9',
            },
            {
              name: 'Lifestyle',
              id: '7',
            },
            {
              name: 'Food',
              id: '8',
            },
          ]}
          titleProperty={"name"}
          valueProperty={"id"}
        />
      </Stage>

      <Stage title="Dropdown">
        <DropDownMenu
          options={[
            {
              name: 'Lifestyle',
              id: '7',
            },
            {
              name: 'Lifestyle',
              id: '7',
            },
            {
              name: 'Food',
              id: '8',
            },
            {
              name: 'Food',
              id: '8',
            },
            {
              name: 'Nature',
              id: '9',
            },

          ]}
          titleProperty={"name"}
          valueProperty={"id"}
        />
      </Stage>
      <Stage title="Dropdown (horizontal)">
        <DropDownMenu
          styleName="horizontal"
          options={[
            {
              name: 'Lifestyle',
              id: '7',
            },
            {
              name: 'Lifestyle',
              id: '7',
            },
            {
              name: 'Food',
              id: '8',
            },
            {
              name: 'Food',
              id: '8',
            },
            {
              name: 'Nature',
              id: '9',
            },

          ]}
          titleProperty={"name"}
          valueProperty={"id"}
        />
      </Stage>

    </View>

  );
}
