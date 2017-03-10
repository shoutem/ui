import React, {
  Component,
  PropTypes,
} from 'react';
import {
  Platform,
  InteractionManager,
} from 'react-native';

import { View } from '../View';
import { Spinner } from '../Spinner';
import { connectStyle } from '@shoutem/theme';
import HypermediaComposer from './HypermediaComposer';
import createDOM from './createDom';

const DEFAULT_IMAGE_HEIGHT = 200;
const DEFAULT_VIDEO_HEIGHT = 200;

function shouldDelayDomParsing() {
  // DOM parsing is slow on Android, so we are
  // delaying it after the navigation transition.
  return Platform.OS === 'android';
}

/**
 * Displays content in the html body as a composition of
 * react native components.
 */
class RichMedia extends Component {
  state = {
    dom: null,
    isLoading: shouldDelayDomParsing(),
  };

  componentDidMount() {
    if (shouldDelayDomParsing()) {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ isLoading: false });
        this.updateDomState();
      });
    } else {
      this.updateDomState();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.body !== nextProps.body) {
      this.updateDomState();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.body !== nextProps.body || this.state.dom !== nextState.dom;
  }

  updateDomState() {
    const { body } = this.props;

    if (body) {
      createDOM(body, (err, dom) => {
        if (err) {
          this.props.onError(err);
        }

        this.setState({ dom });
      });
    }
  }

  render() {
    const {
      renderElement,
      renderText,
      style,
      openUrl,
    } = this.props;
    const { dom, isLoading } = this.state;

    if (isLoading) {
      return (
        <View styleName="md-gutter">
          <Spinner styleName="sm-gutter" />
        </View>
      );
    }

    if (!dom) {
      // Returning null here doesn't unmount the spinner
      // on Android, but returning an empty array works.
      // Unfortunately, empty array cannot be returned on iOS...
      // The Android issue is probably related to this:
      // https://github.com/facebook/react-native/issues/8968
      return (Platform.OS === 'android') ? [] : null;
    }

    return (
      <View >
        <HypermediaComposer
          dom={dom}
          style={style || {}}
          openUrl={openUrl}
          elementTransformer={renderElement}
          textTransformer={renderText}
        />
      </View>
    );
  }
}

RichMedia.defaultProps = {
  onError: console.error.bind(console),
};

RichMedia.propTypes = {
  body: PropTypes.string,
  onError: PropTypes.func,
  style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
  openUrl: PropTypes.func,
  renderElement: PropTypes.func,
  renderText: PropTypes.func,
};

const defaultStyle = {
  img: {
    height: DEFAULT_IMAGE_HEIGHT,
  },
  video: {
    height: DEFAULT_VIDEO_HEIGHT,
  },
};

const StyledRichMedia = connectStyle('shoutem.ui.RichMedia', defaultStyle)(RichMedia);
export {
  StyledRichMedia as RichMedia,
};
