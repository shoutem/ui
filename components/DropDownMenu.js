import React, {
  Component,
} from 'react';
import { Modal, ListView, } from 'react-native';
import _ from 'lodash';

import { Button } from './Button';
import { Icon } from './Icon';
import { Text } from './Text';
import { View } from './View';
import { TouchableOpacity } from './TouchableOpacity';

import { connectStyle } from '@shoutem/theme';

import {
  ScrollDriver,
  TimingDriver,
  FadeIn,
  FadeOut,
  ZoomOut,
} from '@shoutem/animation';

class DropDownMenu extends Component {
  static propTypes = {
    /**
     * Callback that is called when dropdown option is selected
     */
    onOptionSelected: React.PropTypes.func,
    /**
     * Collection of objects which will be shown as options in DropDownMenu
     */
    options: React.PropTypes.array.isRequired,
    /**
     * Selected option that will be shown.
     */
    selectedOption: React.PropTypes.any.isRequired,
    /**
     * Key name that represents option's string value,
     * and it will be displayed to the user in the UI
     */
    titleProperty: React.PropTypes.string.isRequired,
    /**
     * Key name that represents option's value
     */
    valueProperty: React.PropTypes.string.isRequired,
    /**
     * Number of options shown without scroll
     */
    visibleOptions: React.PropTypes.number,
    style: React.PropTypes.object,
  };

  static defaultProps = {
    visibleOptions: 8,
  };

  constructor(props) {
    super(props);
    this.state = {
      optionHeight: 0,
      collapsed: false,
    };
    this.collapse = this.collapse.bind(this);
    this.close = this.close.bind(this);
    this.emitOnOptionSelectedEvent = this.emitOnOptionSelectedEvent.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.selectOption = this.selectOption.bind(this);
    this.onOptionLayout = this.onOptionLayout.bind(this);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  componentWillMount() {
    this.scrollDriver = new ScrollDriver();
    this.timingDriver = new TimingDriver();
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

  onOptionLayout(event) {
    const { height } = event.nativeEvent.layout;
    this.setState({ optionHeight: height });
  }

  collapse() {
    this.setState({ collapsed: true });
    this.scrollDriver = new ScrollDriver();
    this.timingDriver.runTimer(1);
  }

  selectOption(option) {
    this.close();
    if (option !== this.props.selectedOption) {
      this.emitOnOptionSelectedEvent(option);
    }
  }

  close() {
    this.timingDriver.runTimer(0, () => this.setState({ collapsed: false }));
  }

  emitOnOptionSelectedEvent(option) {
    if (this.props.onOptionSelected) {
      this.props.onOptionSelected(option);
    }
  }

  resolveListViewStyle() {
    const listViewHeight = this.calculateListViewHeight();
    return { flex: 0, maxHeight: listViewHeight };
  }

  calculateListViewHeight() {
    const { optionHeight } = this.state;
    const { options, visibleOptions } = this.props;
    const optionsSize = _.size(options);

    return optionsSize > visibleOptions ?
    visibleOptions * optionHeight : optionsSize * optionHeight;
  }

  renderSelectedOption() {
    const { style, titleProperty } = this.props;

    const selectedOption = this.getSelectedOption();
    return selectedOption ? (
      <Button onPress={this.collapse} style={style.selectedOption}>
        <Text>{selectedOption[titleProperty]}</Text>
        <Icon name="drop-down" />
      </Button>
    ) : null;
  }

  renderRow(option, sectionId, rowId) {
    const {
      style,
      titleProperty,
      visibleOptions,
    } = this.props;
    const { optionHeight } = this.state;
    const optionPosition = rowId * optionHeight;
    // start to fade in option when option is scrolled in
    const fadeInStart = optionPosition - (visibleOptions - 0.5) * optionHeight;
    const fadeInEnd = optionPosition - (visibleOptions - 1.5) * optionHeight;
    const onPress = () => this.selectOption(option);
    return (
      <TouchableOpacity onPress={onPress} style={style.modalItem} onLayout={this.onOptionLayout}>
        <FadeOut
          inputRange={[optionPosition, optionPosition + optionHeight / 2]}
          driver={this.scrollDriver}
        >
          {/* there should be visible only initial visibleOptions options */}
          <FadeIn
            inputRange={[fadeInStart, fadeInEnd]}
            driver={this.scrollDriver}
          >
            <Text>
              {option[titleProperty].toUpperCase()}
            </Text>
          </FadeIn>
        </FadeOut>
      </TouchableOpacity>
    );
  }

  render() {
    const { collapsed } = this.state;
    const { titleProperty, options, style } = this.props;

    const button = this.renderSelectedOption();
    if (_.size(options) === 0 || !button) {
      return null;
    }

    const listViewStyle = this.resolveListViewStyle();
    const dataSource = this.ds.cloneWithRows(options.filter((option) => option[titleProperty]));

    return (
      <View renderToHardwareTextureAndroid>
        {button}
        <Modal
          visible={collapsed}
          onRequestClose={this.close}
          transparent
        >
          <ZoomOut driver={this.timingDriver} maxFactor={1.1} style={{ flex: 1 }}>
            <FadeIn driver={this.timingDriver} style={{ flex: 1 }}>
              <View style={style.modal} styleName="vertical">
                <ListView
                  dataSource={dataSource}
                  renderRow={this.renderRow}
                  style={listViewStyle}
                  {...this.scrollDriver.scrollViewProps}
                />
                <Button onPress={this.close} styleName="clear close">
                  <Icon name="close" />
                </Button>
              </View>
            </FadeIn>
          </ZoomOut>
        </Modal>
      </View>
    );
  }
}

const StyledDropDownMenu = connectStyle('shoutem.ui.DropDownMenu', {})(DropDownMenu);

export {
  StyledDropDownMenu as DropDownMenu,
};
