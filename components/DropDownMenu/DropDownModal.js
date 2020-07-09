import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Modal,
  LayoutAnimation,
  Dimensions,
} from 'react-native';
import _ from 'lodash';

import { TimingDriver, FadeIn, ZoomOut } from '@shoutem/animation';
import { connectStyle, changeColorAlpha } from '@shoutem/theme';

import { Button } from '../Button';
import { Icon } from '../Icon';
import { LinearGradient } from '../LinearGradient';
import { ListView } from '../ListView';
import { Text } from '../Text';
import { TouchableOpacity } from '../TouchableOpacity';
import { View } from '../View';

const window = Dimensions.get('window');

class DropDownModal extends PureComponent {
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

    this.close = this.close.bind(this);
    this.emitOnOptionSelectedEvent = this.emitOnOptionSelectedEvent.bind(this);
    this.getKeyAreaHeights = this.getKeyAreaHeights.bind(this);
    this.renderGradient = this.renderGradient.bind(this);
    this.resolveListViewStyle = this.resolveListViewStyle.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.selectOption = this.selectOption.bind(this);
    this.onOptionLayout = this.onOptionLayout.bind(this);

    this.state = {
      optionHeight: 0,
      modalContentVisible: false,
    };

    this.timingDriver = new TimingDriver();
  }

  componentDidUpdate(prevProps) {
    const { visible: wasVisible } = prevProps;
    const { visible: isVisible } = this.props;

    if (!wasVisible && isVisible) {
      this.setState({ modalContentVisible: isVisible });
      this.timingDriver.toValue(1, () => {
        LayoutAnimation.easeInEaseOut();
      });
    }
  }

  onOptionLayout(event) {
    const { height } = event.nativeEvent.layout;
    this.setState({ optionHeight: height });
  }

  getVisibleOptions() {
    const {
      visibleOptions,
      style: { visibleOptions: styleVisibleOptions }
    } = this.props;
    const defaultOptions = DropDownModal.DEFAULT_VISIBLE_OPTIONS;

    return visibleOptions || styleVisibleOptions || defaultOptions;
  }

  selectOption(option) {
    const { selectedOption } = this.props;

    this.close();

    if (option !== selectedOption) {
      this.emitOnOptionSelectedEvent(option);
    }
  }

  close() {
    if (this.props.onClose) {
      this.timingDriver.toValue(0, () => {
        this.props.onClose();
        this.setState({ modalContentVisible: false });
      });
    }
  }

  emitOnOptionSelectedEvent(option) {
    if (this.props.onOptionSelected) {
      this.props.onOptionSelected(option);
    }
  }

  resolveListViewStyle() {
    const { style, options } = this.props;

    const { bufferHeight } = this.getKeyAreaHeights();
    const visibleOptions = this.getVisibleOptions();

    const padding = style.modal.paddingVertical ? bufferHeight - style.modal.paddingVertical : bufferHeight;
    const flex = _.size(options) >= visibleOptions ? 0 : 1;

    return {
      listContent: {
        flex,
        backgroundColor: style.modal.backgroundColor,
        paddingVertical: Math.min(250, padding),
        justifyContent: 'center',
      },
    };
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

  getKeyAreaHeights() {
    const { optionHeight } = this.state;

    const listViewHeight = this.calculateListViewHeight();
    const screenHeight = window.height;
    const gradientHeight = optionHeight;
    const transparencyHeight = listViewHeight - optionHeight * 2;
    const bufferHeight = (screenHeight - listViewHeight) / 2;

    return {
      listViewHeight,
      screenHeight,
      gradientHeight,
      transparencyHeight,
      bufferHeight,
    };
  }

  renderGradient() {
    const { style } = this.props;
    const { backgroundColor } = style.modal;

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

    const {
      listViewHeight,
      screenHeight,
      gradientHeight,
      transparencyHeight,
      bufferHeight,
    } = this.getKeyAreaHeights();

    const bufferColor = backgroundColor;
    const invertedColor = changeColorAlpha(backgroundColor, 0);

    // This config array holds the appropriate screen segment ratios per calculcations above
    // Every screen segment has it's corresponding color to transition to.

    const gradientConfig = [{
      location: 0,
      color: changeColorAlpha(bufferColor, 1),
    }, {
      location: Math.min(0.25, bufferHeight / screenHeight),
      color: backgroundColor
    }, {
      location: (bufferHeight + gradientHeight) / screenHeight,
      color: invertedColor
    }, {
      location: (bufferHeight + gradientHeight + transparencyHeight) / screenHeight,
      color: invertedColor,
    }, {
      location: Math.max((bufferHeight + listViewHeight) / screenHeight, 0.75),
      color: backgroundColor
    }, {
      location: 1,
      color: changeColorAlpha(bufferColor, 1),
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
    const { titleProperty, options, style, visible } = this.props;
    const { modalContentVisible } = this.state;

    if (_.size(options) === 0) {
      return null;
    }

    const listViewStyle = this.resolveListViewStyle();
    const data = options.filter((option) => option[titleProperty]);

    return (
      <Modal
        visible={visible}
        onRequestClose={this.close}
        transparent
      >
        <ZoomOut driver={this.timingDriver} maxFactor={1.1} style={{ flex: 1 }}>
          <FadeIn driver={this.timingDriver} style={{ flex: 1 }}>
            <View style={style.modal}>
              {modalContentVisible &&
                <ListView
                  data={data}
                  renderRow={this.renderRow}
                  style={listViewStyle}
                  renderFooter={this.renderFooter}
                />
              }
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
