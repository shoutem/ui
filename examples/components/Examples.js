import React, { PureComponent } from 'react';

import { Screen } from '../../components/Screen';
import { Divider } from '../../components/Divider';
import { ScrollView } from '../../components/ScrollView';
import { DropDownMenu } from '../../components/DropDownMenu';

import { Typography } from './Typography';
import { Dividers } from './Dividers';
import { Rows } from './Rows';
import { Cards } from './Cards';
import { Tiles } from './Tiles';
import { Spinners } from './Spinners';
import { Buttons } from './Buttons';
import { Images } from './Images';
import { DropDownMenus } from './DropDownMenus';
import { FormComponents } from './FormComponents';
import { Headers } from './Headers';
import { NavigationBars } from './NavigationBars';
import { Videos } from './Videos';

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
  { title: 'Video', component: Videos },
  { title: 'Form Components', component: FormComponents },
];

export class Examples extends PureComponent {
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
        <Divider />
        <DropDownMenu
          styleName="horizontal"
          options={examples}
          selectedOption={this.state.selectedExample}
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
