import React, { Component } from 'react';

import { Screen, DropDownMenu, Divider, ScrollView, } from '../../index';

import { Typography } from './Typography';
import { Dividers } from './Dividers';
import { Rows } from './Rows';
import { Cards } from './Cards';
import { Tiles } from './Tiles';
import { Spinners } from './Spinners';
import { Buttons } from './Buttons';
import { Images } from './Images';
import { DropDownMenus } from './DropDownMenu';
import { FormComponents } from './FormComponents';
import { Headers } from './Headers';
import { NavigationBars } from './NavigationBars';

const examples = [
  { title: 'Typography', component: Typography },
  { title: 'Navigation Bars', component: NavigationBars },
  { title: 'Dropdown Menus', component: DropDownMenus },
  { title: 'Dividers', component: Dividers },
  { title: 'Cards', component: Cards },
  { title: 'Rows', component: Rows },
  { title: 'Tiles', component: Tiles },
  { title: 'Headers', component: Headers },
  { title: 'Spinners', component: Spinners },
  { title: 'Buttons', component: Buttons },
  { title: 'Images', component: Images },
  { title: 'Form Components', component: FormComponents },
];

export class Examples extends Component {
  constructor() {
    super();
    this.state = {
      selectedExample: examples[0],
    };
  }

  render() {
    const { selectedExample } = this.state;
    const SelectedComponent = selectedExample.component;
    return (
      <Screen>
        <DropDownMenu
          styleName="horizontal"
          options={examples}
          onOptionSelected={(example) => this.setState({ selectedExample: example })}
          titleProperty="title"
          valueProperty="component"
        />

        <ScrollView key={selectedExample.title}>
          <SelectedComponent />
        </ScrollView>
      </Screen>
    );
  }
}
