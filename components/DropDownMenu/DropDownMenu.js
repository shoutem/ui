import React, {
  Component,
} from 'react';
import _ from 'lodash';

import { Button } from '../Button';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { View } from '../View';
import { DropDownModal } from './ModalMenu';

import { connectStyle } from '@shoutem/theme';

const modalSpecificProps = ['visible', 'onClose'];
const dropDownMenuPropTypes = { ..._.omit(DropDownModal.propTypes, modalSpecificProps) };

export class DropDown extends Component {
  static propTypes = {
    ...dropDownMenuPropTypes,
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
    this.collapse = this.collapse.bind(this);
    this.close = this.close.bind(this);
  }

  getSelectedOption() {
    const { options, selectedOption } = this.props;
    if (_.indexOf(options, selectedOption) === -1) {
      console.warn(
        `Invalid \`selectedOption\` ${JSON.stringify(selectedOption)}, ` +
        'DropDownMenu `selectedOption` must be a member of `options`.' +
        'Check that you are using the same reference in both `options` and `selectedOption`.'
      );
      return;
    }
    return selectedOption;
  }

  collapse() {
    this.setState({ collapsed: true });
  }

  close() {
    this.setState({ collapsed: false });
  }

  renderSelectedOption() {
    const { style, titleProperty } = this.props;

    const selectedOption = this.getSelectedOption();
    return selectedOption ? (
      <View style={style.horizontalContainer}>
        <Button onPress={this.collapse} style={style.selectedOption}>
          <Text>{selectedOption[titleProperty]}</Text>
          <Icon name="drop-down" />
        </Button>
      </View>
    ) : null;
  }

  render() {
    const { collapsed } = this.state;
    const { options } = this.props;

    const button = this.renderSelectedOption();
    if (_.size(options) === 0 || !button) {
      return null;
    }

    return (
      <View renderToHardwareTextureAndroid>
        {button}
        <DropDownModal
          {..._.omit(this.props, 'style')}
          visible={collapsed}
          onClose={this.close}
        />
      </View>
    );
  }
}

const StyledDropDownMenu = connectStyle('shoutem.ui.DropDownMenu')(DropDown);

export {
  StyledDropDownMenu as DropDownMenu,
};
