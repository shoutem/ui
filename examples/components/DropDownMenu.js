import React, { Component } from 'react';

import { View } from '../../components/View';
import { Stage } from './Stage';
import { DropDownMenu } from '../../components/DropDownMenu';

const options = [
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

];

export class DropDownMenus extends Component {
  constructor() {
    super();
    this.state = {
      selectedOption: options[0],
    }
  }

  render() {
    return (
      <View styleName="vertical collapsed">
        <Stage title="Dropdown">
          <DropDownMenu
            options={options}
            selectedOption={this.state.selectedOption}
            onOptionSelected={(option) => this.setState({ selectedOption: option })}
            titleProperty={"name"}
            valueProperty={"id"}
          />
        </Stage>
        <Stage title="Dropdown (horizontal)">
          <DropDownMenu
            styleName="horizontal"
            options={options}
            selectedOption={this.state.selectedOption}
            onOptionSelected={(option) => this.setState({ selectedOption: option })}
            titleProperty={"name"}
            valueProperty={"id"}
          />
        </Stage>
      </View>
    );
  }
}
