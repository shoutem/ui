import React, { PureComponent } from 'react';

import { Caption } from '../../components/Text';
import { View } from '../../components/View';
import { Switch } from '../../components/Switch';
import { FormGroup } from '../../components/FormGroup';
import { TextInput } from '../../components/TextInput';
import { Stage } from './Stage';

export class FormComponents extends PureComponent {
  constructor() {
    super();
    this.state = {
      switchOn: false,
    };
  }

  render() {
    const { switchOn } = this.state;

    return (
      <View styleName="vertical collapsed">
        <Stage title="TextInput / Full width">
          <TextInput
            styleName="stretch"
            placeholder="Username or Email"
          />
        </Stage>
        <Stage title="TextInput  /  Full width secure entry">
          <TextInput
            styleName="stretch"
            placeholder="Password"
            secureTextEntry
          />
        </Stage>
        <Stage title="Input with label">
          <FormGroup styleName="stretch">
            <Caption>NAME</Caption>
            <TextInput
              placeholder="Username or Email"
            />
          </FormGroup>
        </Stage>
        <Stage title="Switch">
          <Switch
            onValueChange={value => this.setState({ switchOn: value})}
            value={switchOn}
          />
        </Stage>
      </View>
    );
  }
}
