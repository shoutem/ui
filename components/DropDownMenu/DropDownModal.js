import React, { PureComponent } from 'react';
import { Dimensions, Modal } from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { changeColorAlpha, connectStyle } from '@shoutem/theme';
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
      <Text>{option[titleProperty].toUpperCase()}</Text>
    ),
  };

  static DEFAULT_VISIBLE_OPTIONS = 8;

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = { optionHeight: 0 };
  }

  onOptionLayout(event) {
    const { height } = event.nativeEvent.layout;
    const { optionHeight } = this.state;

    if (height !== optionHeight) {
      this.setState({
        optionHeight: height,
        listStyle: this.resolveListViewStyle(height),
      });
    }
  }

  getVisibleOptions() {
    const {
      visibleOptions,
      style: { visibleOptions: styleVisibleOptions },
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
    const { onClose } = this.props;

    if (onClose) {
      onClose();
    }
  }

  emitOnOptionSelectedEvent(option) {
    if (this.props.onOptionSelected) {
      this.props.onOptionSelected(option);
    }
  }

  resolveListViewStyle(height) {
    const { style } = this.props;

    const { bufferHeight } = this.getKeyAreaHeights(height);

    return {
      listContent: {
        backgroundColor: style.modal.backgroundColor,
        paddingVertical: bufferHeight,
        justifyContent: 'center',
      },
    };
  }

  calculateListViewHeight(optionHeight) {
    const { optionHeight: existingHeight } = this.state;
    const { options } = this.props;

    const resolvedHeight = optionHeight || existingHeight;

    const visibleOptions = this.getVisibleOptions();
    const optionsSize = _.size(options);

    return optionsSize > visibleOptions
      ? visibleOptions * resolvedHeight
      : optionsSize * resolvedHeight;
  }

  renderFooter() {
    return <View styleName="md-gutter-top" />;
  }

  getKeyAreaHeights(manualOptionHeight) {
    const { optionHeight } = this.state;
    const { style } = this.props;

    const gradientHeight = manualOptionHeight || optionHeight;
    const listViewHeight = this.calculateListViewHeight(gradientHeight);
    const screenHeight = window.height;
    const paddedScreenHeight = style.modal.paddingVertical
      ? screenHeight - style.modal.paddingVertical * 2
      : screenHeight;
    const bufferHeight = Math.max(
      (paddedScreenHeight - listViewHeight) / 2,
      gradientHeight * 2,
    );

    return {
      listViewHeight,
      screenHeight,
      gradientHeight,
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
      bufferHeight,
    } = this.getKeyAreaHeights();

    const bufferColor = backgroundColor;
    const invertedColor = changeColorAlpha(backgroundColor, 0);

    // This config array holds the appropriate screen segment ratios per calculcations above
    // Every screen segment has it's corresponding color to transition to.

    const gradientConfig = [
      {
        location: 0,
        color: changeColorAlpha(bufferColor, 1),
      },
      {
        location: Math.max(
          (bufferHeight - gradientHeight) / screenHeight,
          0.15,
        ),
        color: backgroundColor,
      },
      {
        location: Math.max(bufferHeight / screenHeight, 0.2),
        color: invertedColor,
      },
      {
        location: Math.min((bufferHeight + listViewHeight) / screenHeight, 0.8),
        color: invertedColor,
      },
      {
        location: Math.min(
          (bufferHeight + listViewHeight + gradientHeight) / screenHeight,
          0.85,
        ),
        color: backgroundColor,
      },
      {
        location: 1,
        color: changeColorAlpha(bufferColor, 1),
      },
    ];

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
    const { style, titleProperty, renderOption, selectedOption } = this.props;

    const optionItem = renderOption(option, titleProperty);
    const selectedItem = selectedOption.id === option.id || false;
    const onPress = () => this.selectOption(option);

    return (
      <TouchableOpacity
        onPress={onPress}
        style={selectedItem ? style.selectedModalItem : style.modalItem}
        onLayout={this.onOptionLayout}
      >
        {optionItem}
      </TouchableOpacity>
    );
  }

  render() {
    const { titleProperty, options, style, visible } = this.props;
    const { listStyle } = this.state;

    if (_.size(options) === 0) {
      return null;
    }
    const data = options.filter(option => option[titleProperty]);

    return (
      <Modal
        visible={visible}
        onRequestClose={this.close}
        animationType="fade"
        transparent
      >
        <View style={style.modal}>
          <ListView
            data={data}
            renderRow={this.renderRow}
            style={listStyle}
            renderFooter={this.renderFooter}
          />
          {this.renderGradient()}
          <Button onPress={this.close} styleName="clear close">
            <Icon name="close" />
          </Button>
        </View>
      </Modal>
    );
  }
}

const StyledModal = connectStyle('shoutem.ui.DropDownModal')(DropDownModal);

export { StyledModal as DropDownModal };
