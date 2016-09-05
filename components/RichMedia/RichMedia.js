import React, {
  Component,
  PropTypes,
} from 'react';
import { View } from '../View';
import { connectStyle } from '@shoutem/theme';
import HypermediaComposer from './HypermediaComposer';
import createDOM from './createDom';

const DEFAULT_IMAGE_HEIGHT = 200;
const DEFAULT_VIDEO_HEIGHT = 200;

/**
 * Displays content in the html body as a composition of
 * react native components.
 */
class RichMedia extends Component {
  state = {
    dom: null,
  };

  componentDidMount() {
    this.updateDomState();
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
    const { dom } = this.state;

    if (!dom) {
      return null;
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
  style: PropTypes.object,
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
