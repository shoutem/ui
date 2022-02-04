import React, { PureComponent } from 'react';
import { Divider } from '../../components/Divider';
import { DropDownMenu } from '../../components/DropDownMenu';
import { Screen } from '../../components/Screen';
import { ScrollView } from '../../components/ScrollView';
import { Buttons } from './Buttons';
import { Cards } from './Cards';
import { Dividers } from './Dividers';
import { DropDownMenus } from './DropDownMenus';
import { FormComponents } from './FormComponents';
import { Headers } from './Headers';
import { Images } from './Images';
import { NavigationBars } from './NavigationBars';
import { Rows } from './Rows';
import { Spinners } from './Spinners';
import { Tiles } from './Tiles';
import { Typography } from './Typography';
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
          onOptionSelected={example =>
            this.setState({ selectedExample: example })
          }
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
