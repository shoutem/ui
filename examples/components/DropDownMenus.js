import React, { PureComponent } from 'react';

import { Caption } from '../../components/Text';
import { View } from '../../components/View';
import { FormGroup } from '../../components/FormGroup';
import { DropDownMenu } from '../../components/DropDownMenu';
import { Stage } from './Stage';

const options = [
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

];

const emptyOption = { id: '', name: 'Select'};
const optionsWithEmptyOption = [emptyOption, ...options];

export class DropDownMenus extends PureComponent {
  constructor() {
    super();
    this.state = {
      selectedOption: options[0],
      selectedOptionForFormGroupDropdown: emptyOption,
    };
  }

  render() {
    const { selectedOption, selectedOptionForFormGroupDropdown } = this.state;

    return (
      <View styleName="vertical collapsed">
        <Stage title="Dropdown">
          <DropDownMenu
            options={options}
            selectedOption={selectedOption}
            onOptionSelected={option => this.setState({ selectedOption: option })}
            titleProperty={"name"}
            valueProperty={"id"}
          />
        </Stage>
        <Stage title="Dropdown (horizontal)">
          <DropDownMenu
            styleName="horizontal"
            options={options}
            selectedOption={selectedOption}
            onOptionSelected={option => this.setState({ selectedOption: option })}
            titleProperty={"name"}
            valueProperty={"id"}
          />
        </Stage>
        <Stage title="Dropdown (large)">
          <DropDownMenu
            styleName="large"
            options={options}
            selectedOption={selectedOption}
            onOptionSelected={option => this.setState({ selectedOption: option })}
            titleProperty={"name"}
            valueProperty={"id"}
          />
        </Stage>
        <Stage title="Dropdown (inside a form group)">
          <FormGroup styleName="stretch">
            <Caption>CATEGORY</Caption>
            <DropDownMenu
              styleName={selectedOptionForFormGroupDropdown.id ? '' : 'empty'}
              options={optionsWithEmptyOption}
              selectedOption={selectedOptionForFormGroupDropdown}
              onOptionSelected={option =>
                this.setState({ selectedOptionForFormGroupDropdown: option })}
              titleProperty={"name"}
              valueProperty={"id"}
            />
          </FormGroup>
        </Stage>
      </View>
    );
  }
}
