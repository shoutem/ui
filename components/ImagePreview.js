import React, { PureComponent } from 'react';
import {
  View,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';
import autoBind from 'auto-bind/react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { makeZoomable } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

const ZoomableImage = makeZoomable(Image);

const CLOSE_ICON_NAME = 'clear';
const CLOSE_ICON_SIZE = 25;

/**
 * Renders an ImagePreview which shows an inline image preview.
 * When clicked, the image is displayed in full screen.
 */
class ImagePreview extends PureComponent {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    source: Image.propTypes.source,
    style: PropTypes.object,
  };

  static defaultProps = {
    width: undefined,
    height: undefined,
    source: undefined,
    style: {},
  };

  constructor(props) {
    super(props);

    autoBind(this);

    this.state = {
      fullScreen: false,
    };
  }

  onPressCloseButton() {
    this.setState({ fullScreen: false });
  }

  onPressImage() {
    this.setState({ fullScreen: true });
  }

  render() {
    const {
      source,
      style,
      width,
      height,
    } = this.props;
    const { fullScreen } = this.state;

    if (fullScreen) {
      const closeButton = (
        <View style={style.header}>
          <TouchableOpacity style={style.fullScreen} onPress={this.onPressCloseButton}>
            <Icon name={CLOSE_ICON_NAME} size={CLOSE_ICON_SIZE} style={style.closeIcon} />
          </TouchableOpacity>
        </View>
      );

      return (
        <Modal
          animated
          transparent
        >
          <View style={style.fullScreenContainer}>
            <ZoomableImage
              style={style.image}
              componentWidth={width}
              componentHeight={height}
              source={source}
            />
            {closeButton}
          </View>
        </Modal>
      );
    }

    return (
      <View style={[style.container, { width, height }]}>
        <TouchableOpacity onPress={this.onPressImage}>
          <Image
            style={style.thumbnail}
            source={source}
            width={width}
            height={height}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const StyledImagePreview = connectStyle('shoutem.ui.ImagePreview')(ImagePreview);

export {
  StyledImagePreview as ImagePreview,
};
