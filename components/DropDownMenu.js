import React, {
  Component,
} from 'react';
import { Modal, ListView } from 'react-native';

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

import _ from 'lodash';

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
     * Initially selected option
     */
    selectedOption: React.PropTypes.any,
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
  }

  static defaultProps = {
    visibleOptions: 8,
  }

  constructor(props) {
    super(props);
    this.state = {
      optionHeight: 0,
      selectedOption: props.selectedOption,
    };
    this.collapse = this.collapse.bind(this);
    this.close = this.close.bind(this);
    this.emitOnOptionSelectedEvent = this.emitOnOptionSelectedEvent.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onOptionLayout = this.onOptionLayout.bind(this);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  componentWillMount() {
    this.autoSelect(this.props.options, this.props.selectedOption);
    this.scrollDriver = new ScrollDriver();
    this.timingDriver = new TimingDriver();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.selectedOption && _.size(nextProps.options) > 0) {
      this.autoSelect(nextProps.options, nextProps.selectedOption);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.options !== this.props.options) ||
      (nextState !== this.state);
  }

  onOptionLayout(event) {
    const { height } = event.nativeEvent.layout;
    this.setState({ optionHeight: height });
  }

  getValue() {
    const {
      selectedOption,
      valueProperty,
    } = this.state;

    return selectedOption[valueProperty];
  }

  getSelectedOption() {
    return this.state.selectedOption;
  }

  /**
   * Selects first item as default if non is selected
   */
  autoSelect(options = [], selectedOption) {
    if (!selectedOption && !this.state.selectedOption && _.size(options) > 0) {
      this.setState({ selectedOption: options[0] }, this.emitOnOptionSelectedEvent);
    }
  }

  collapse() {
    this.setState({ collapsed: true });
    this.scrollDriver = new ScrollDriver();
    this.timingDriver.runTimer(1);
  }

  close() {
    this.timingDriver.runTimer(0, () => this.setState({ collapsed: false }));
  }

  emitOnOptionSelectedEvent() {
    if (this.props.onOptionSelected) {
      this.props.onOptionSelected(this.state.selectedOption);
    }
  }

  resolveListViewStyle() {
    const listViewHeight = this.calculateListViewHeight();

    return { flex: 0, height: listViewHeight };
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
    const { selectedOption } = this.state;

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
    const onPress = () => {
      this.close();
      this.setState({ selectedOption: option }, this.emitOnOptionSelectedEvent);
    };
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

    if (!options) {
      return null;
    }

    const button = this.renderSelectedOption();
    const listViewStyle = this.resolveListViewStyle();
    const dataSource = this.ds.cloneWithRows(options.filter((option) => option[titleProperty]));

    return (
      <View renderToHardwareTextureAndroid>
        {button}
        <Modal
          visible={collapsed || false}
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
