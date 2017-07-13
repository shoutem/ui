import React, {
  Component,
} from 'react';
import { Modal, ListView, Animated } from 'react-native';
import _ from 'lodash';

import { Button } from '../Button';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { View } from '../View';
import { LinearGradient } from '../LinearGradient';
import { TouchableOpacity } from '../TouchableOpacity';

import { connectStyle, changeColorAlpha } from '@shoutem/theme';

import {
  ScrollDriver,
  TimingDriver,
  FadeIn,
  ZoomOut,
} from '@shoutem/animation';

const AnimatedListView = Animated.createAnimatedComponent(ListView);

export class ModalMenu extends Component {
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
     * Number of options shown without scroll.
     * Can be set trough DropDown style.visibleOptions.
     * Prop definition overrides style.
     */
    visibleOptions: React.PropTypes.number,
    /**
     * Optional render function, for every item in the list.
     * Input parameter should be shaped as one of the items from the
     * options object
     */
    renderOption: React.PropTypes.func,
    /**
     * Visibility flag, controling the modal visibility
     */
    visible: React.PropTypes.bool,
    /**
     * Callback that is called when modal should be closed
     */
    onClose: React.PropTypes.func,
    style: React.PropTypes.object,
  };

  static DEFAULT_VISIBLE_OPTIONS = 8;

  constructor(props) {
    super(props);
    this.state = {
      optionHeight: 0,
    };
    this.close = this.close.bind(this);
    this.emitOnOptionSelectedEvent = this.emitOnOptionSelectedEvent.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.selectOption = this.selectOption.bind(this);
    this.onOptionLayout = this.onOptionLayout.bind(this);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  componentWillMount() {
    this.timingDriver = new TimingDriver();
    this.scrollDriver = new ScrollDriver();
  }

  componentWillReceiveProps(nextProps) {
    const { visible: wasVisible } = this.props;
    const { visible: isVisible } = nextProps;

    if (!wasVisible && isVisible) {
      this.scrollDriver = new ScrollDriver();
      this.timingDriver.toValue(1);
    }
  }

  onOptionLayout(event) {
    const { height } = event.nativeEvent.layout;
    this.setState({ optionHeight: height });
  }

  getVisibleOptions() {
    const { visibleOptions, style } = this.props;
    return visibleOptions || style.visibleOptions || ModalMenu.DEFAULT_VISIBLE_OPTIONS;
  }

  selectOption(option) {
    this.close();
    if (option !== this.props.selectedOption) {
      this.emitOnOptionSelectedEvent(option);
    }
  }

  close() {
    if (this.props.onClose) {
      this.timingDriver.toValue(0, () => this.props.onClose());
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

  renderRow(option) {
    const {
      style,
      titleProperty,
      renderOption,
    } = this.props;

    const optionItem = renderOption ? renderOption(option) :
      option[titleProperty].toUpperCase();
    const onPress = () => this.selectOption(option);

    return (
      <TouchableOpacity onPress={onPress} style={style.modalItem} onLayout={this.onOptionLayout}>
        <Text>
          {optionItem}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { titleProperty, options, style } = this.props;
    const { backgroundColor } = style.modal;
    if (_.size(options) === 0) {
      return null;
    }

    const fillColor = changeColorAlpha(backgroundColor, 1);
    const invertedColor = changeColorAlpha(backgroundColor, 0);
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
              <View>
                <AnimatedListView
                  scrollRenderAheadDistance={50}
                  dataSource={dataSource}
                  renderRow={this.renderRow}
                  style={listViewStyle}
                  {...this.scrollDriver.scrollViewProps}
                />
                <LinearGradient
                  pointerEvents="none"
                  styleName="fill-parent"
                  locations={[0, 0.2, 0.8, 1]}
                  colors={[fillColor, invertedColor, invertedColor, fillColor]}
                />
              </View>
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

export const DropDownModal = connectStyle('shoutem.ui.DropDownModal')(ModalMenu);
