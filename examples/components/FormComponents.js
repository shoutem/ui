import React, {
  Component,
} from 'react';

import { Stage } from './Stage';
import {
  Switch,
  View,
  TextInput,
} from '../../index';

export class FormComponents extends Component {
  constructor() {
    super();
    this.state = {
      switchOn: false,
    }
  }

  render() {
    const { switchOn } = this.state;

    return (
      <View styleName="vertical collapsed">
        <Stage title="TextInput / Full width">
          <TextInput
            placeholder="Username or Email"
          />
        </Stage>
        <Stage title="TextInput  / Full width secure entry">
          <TextInput
            placeholder="Password"
            secureTextEntry
          />
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
