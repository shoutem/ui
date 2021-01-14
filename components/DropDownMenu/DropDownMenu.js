import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { View } from '../View';
import { DropDownModal } from './DropDownModal';

const modalSpecificProps = ['visible', 'onClose'];
const dropDownMenuPropTypes = {
  ..._.omit(DropDownModal.propTypes, modalSpecificProps),
};

class DropDownMenu extends PureComponent {
  /**
   * @see DropDownModal.propTypes
   */
  static propTypes = {
    /**
     * Icon displayed on dropdown menu button
     */
    iconName: PropTypes.string,
    /**
     * Whether the text should be displayed next to dropdown icon or not
     */
    showSelectedOption: PropTypes.bool,
    ...dropDownMenuPropTypes,
  };

  static defaultProps = {
    iconName: 'drop-down',
    showSelectedOption: true,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      collapsed: false,
    };
  }

  getSelectedOption() {
    const { options, selectedOption } = this.props;
    if (_.indexOf(options, selectedOption) === -1) {
      // eslint-disable-next-line no-console
      console.warn(
        `Invalid \`selectedOption\` ${JSON.stringify(selectedOption)}, ` +
          'DropDownMenu `selectedOption` must be a member of `options`.' +
          'Check that you are using the same reference in both `options` and `selectedOption`.',
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
    const { iconName, showSelectedOption, style, titleProperty } = this.props;

    const selectedOption = this.getSelectedOption();
    return selectedOption ? (
      <View style={style.horizontalContainer}>
        <Button onPress={this.collapse} style={style.selectedOption}>
          {showSelectedOption && <Text>{selectedOption[titleProperty]}</Text>}
          <Icon name={iconName} />
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

const StyledDropDownMenu = connectStyle('shoutem.ui.DropDownMenu')(
  DropDownMenu,
);

export { StyledDropDownMenu as DropDownMenu };
