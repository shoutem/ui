import React, { PureComponent } from 'react';
import autoBind from 'auto-bind/react';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';

import { Button } from '../Button';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { View } from '../View';
import { DropDownModal } from './DropDownModal';

const modalSpecificProps = ['visible', 'onClose'];
// warning: Using propTypes from another component is not safe because they may be removed in
// production builds - react/forbid-foreign-prop-types
// We do not remove them in production builds.
// eslint-disable-next-line
const dropDownMenuPropTypes = { ..._.omit(DropDownModal.propTypes, modalSpecificProps) };

class DropDownMenu extends PureComponent {
  /**
  * @see DropDownModal.propTypes
  */
  static propTypes = {
    ...dropDownMenuPropTypes,
  };

  constructor(props) {
    super(props);

    autoBind(this);

    this.state = {
      collapsed: false,
    };
  }

  getSelectedOption() {
    const { options, selectedOption } = this.props;

    if (_.indexOf(options, selectedOption) === -1) {
      console.warn(
        `Invalid \`selectedOption\` ${JSON.stringify(selectedOption)}, `
        + 'DropDownMenu `selectedOption` must be a member of `options`.'
        + 'Check that you are using the same reference in both `options` and `selectedOption`.',
      );
      return null;
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

const StyledDropDownMenu = connectStyle('shoutem.ui.DropDownMenu')(DropDownMenu);

export {
  StyledDropDownMenu as DropDownMenu,
};
