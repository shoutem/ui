import React, {
  Component,
} from 'react';
import {
  Modal,
  ListView,
  LayoutAnimation,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Button } from '../Button';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { View } from '../View';
import { LinearGradient } from '../LinearGradient';
import { TouchableOpacity } from '../TouchableOpacity';

import { connectStyle, changeColorAlpha } from '@shoutem/theme';

import {
  TimingDriver,
  FadeIn,
  ZoomOut,
} from '@shoutem/animation';

const window = Dimensions.get('window');

class DropDownModal extends Component {
  static propTypes = {
    /**
     * Callback that is called when dropdown option is selected
     */
    onOptionSelected: PropTypes.func,
    /**
     * Collection of objects which will be shown as options in DropDownMenu
     */
    options: PropTypes.array.isRequired,
    /**
     * Selected option that will be shown.
     */
    selectedOption: PropTypes.any.isRequired,
    /**
     * Key name that represents option's string value,
     * and it will be displayed to the user in the UI
     */
    titleProperty: PropTypes.string.isRequired,
    /**
     * Key name that represents option's value
     */
    valueProperty: PropTypes.string.isRequired,
    /**
     * Number of options shown without scroll.
     * Can be set trough DropDown style.visibleOptions.
     * Prop definition overrides style.
     */
    visibleOptions: PropTypes.number,
    /**
     * Optional render function, for every item in the list.
     * Input parameter should be shaped as one of the items from the
     * options object
     */
    renderOption: PropTypes.func,
    /**
     * Visibility flag, controling the modal visibility
     */
    visible: PropTypes.bool,
    /**
     * Callback that is called when modal should be closed
     */
    onClose: PropTypes.func,
    style: PropTypes.object,
  };

  static defaultProps = {
    renderOption: (option, titleProperty) => (
      <Text>{option[titleProperty].toUpperCase()}</Text>),
  };

  static DEFAULT_VISIBLE_OPTIONS = 8;

  constructor(props) {
    super(props);
    this.state = {
      optionHeight: 0,
      shouldRenderModalContent: false,
    };
    this.close = this.close.bind(this);
    this.emitOnOptionSelectedEvent = this.emitOnOptionSelectedEvent.bind(this);
    this.renderGradient = this.renderGradient.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.selectOption = this.selectOption.bind(this);
    this.onOptionLayout = this.onOptionLayout.bind(this);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  componentWillMount() {
    this.timingDriver = new TimingDriver();
  }

  componentWillReceiveProps(nextProps) {
    const { visible: wasVisible } = this.props;
    const { visible: isVisible } = nextProps;

    if (!wasVisible && isVisible) {
      this.timingDriver.toValue(1, () => {
        LayoutAnimation.easeInEaseOut();
        this.setState({ shouldRenderModalContent: true });
      });
    }
  }

  onOptionLayout(event) {
    const { height } = event.nativeEvent.layout;
    this.setState({ optionHeight: height });
  }

  getVisibleOptions() {
    const { visibleOptions, style } = this.props;
    return visibleOptions || style.visibleOptions || DropDownModal.DEFAULT_VISIBLE_OPTIONS;
  }

  selectOption(option) {
    this.close();
    if (option !== this.props.selectedOption) {
      this.emitOnOptionSelectedEvent(option);
    }
  }

  close() {
    if (this.props.onClose) {
      this.timingDriver.toValue(0, () => {
        this.props.onClose();
        this.setState({ shouldRenderModalContent: false });
      });
    }
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
    const { options } = this.props;
    const visibleOptions = this.getVisibleOptions();
    const optionsSize = _.size(options);

    return optionsSize > visibleOptions ?
      visibleOptions * optionHeight : optionsSize * optionHeight;
  }

  renderFooter() {
    return (
      <View styleName="md-gutter-top" />
    );
  }

  renderGradient() {
    const { style } = this.props;
    const { backgroundColor } = style.modal;
    const { optionHeight } = this.state;

    // We divide the modal screen per key areas to which we apply a layer of gradient
    // Screen ratio is represented in (0 - 1) format, where the ratio of 1 represents the entire
    // screen height. Screen is then divided into 5 areas, marking the following elements ->
    // Buffer area, where the layer is filled with default background color of the modal window,
    // with no transparency. This area is applied above and below the list. Gradient area,
    // where we apply the gradient transitioning the layer transparency from 1 -> 0. This
    // section corrseponds to one list option height. Transparency area, where the layer is
    // completely transparent, allowing us to see list options. Screen is then divided in the
    // following fashion
    //  -> Buffer area -> Gradient area -> Transparency area -> Gradient Area -> Buffer Area

    const listViewHeight = this.calculateListViewHeight();
    const screenHeight = window.height;
    const gradientHeight = optionHeight;
    const transparencyHeight = listViewHeight - optionHeight * 2;
    const bufferHeight = (screenHeight - listViewHeight) / 2;

    const bufferColor = backgroundColor;
    const invertedColor = changeColorAlpha(backgroundColor, 0);

    // This config array holds the appropriate screen segment ratios per calculcations above
    // Every screen segment has it's corresponding color to transition to.

    const gradientConfig = [{
      location: 0,
      color: bufferColor
    },{
      location: bufferHeight / screenHeight,
      color: backgroundColor
    },{
      location: (bufferHeight + gradientHeight) / screenHeight,
      color: invertedColor
    },{
      location: (bufferHeight + gradientHeight + transparencyHeight) / screenHeight,
      color: invertedColor,
    },{
      location: (bufferHeight + listViewHeight) / screenHeight,
      color: backgroundColor
    },{
      location: 1,
      color: bufferColor
    }];

    return (
      <LinearGradient
        pointerEvents="none"
        styleName="fill-parent"
        locations={_.map(gradientConfig, breakpoint => breakpoint.location)}
        colors={_.map(gradientConfig, breakpoint => breakpoint.color)}
      />
    );
  }

  renderRow(option) {
    const {
      style,
      titleProperty,
      renderOption,
    } = this.props;

    const optionItem = renderOption(option, titleProperty);
    const onPress = () => this.selectOption(option);

    return (
      <TouchableOpacity onPress={onPress} style={style.modalItem} onLayout={this.onOptionLayout}>
        {optionItem}
      </TouchableOpacity>
    );
  }

  render() {
    const { titleProperty, options, style } = this.props;
    const { shouldRenderModalContent } = this.state;
    if (_.size(options) === 0) {
      return null;
    }

    const listViewStyle = this.resolveListViewStyle();
    const dataSource = this.ds.cloneWithRows(options.filter((option) => option[titleProperty]));

    return (
      <Modal
        visible={this.props.visible}
        onRequestClose={this.close}
        transparent
      >
        <ZoomOut driver={this.timingDriver} maxFactor={1.1} style={{ flex: 1 }}>
          <FadeIn driver={this.timingDriver} style={{ flex: 1 }}>
            <View style={style.modal} styleName="vertical">
              {shouldRenderModalContent ?
                <ListView
                  scrollRenderAheadDistance={50}
                  dataSource={dataSource}
                  renderRow={this.renderRow}
                  style={listViewStyle}
                  renderFooter={this.renderFooter}
                /> : null}
              {this.renderGradient()}
              <Button onPress={this.close} styleName="clear close">
                <Icon name="close" />
              </Button>
            </View>
          </FadeIn>
        </ZoomOut>

      </Modal>
    );
  }
}

const StyledModal = connectStyle('shoutem.ui.DropDownModal')(DropDownModal);

export {
  StyledModal as DropDownModal,
};
