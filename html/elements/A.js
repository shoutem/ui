import React from 'react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import { connectStyle } from '@shoutem/theme';
import _ from 'lodash';

import { ElementPropTypes, combineMappers, mapElementProps } from '../Html';
import { isImg } from '../elements/Img';
import { Inline } from './Inline';

class A extends React.Component {
  static propTypes = {
    ...ElementPropTypes,
    handleLinkPress: PropTypes.func,
    href: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);
    this.onPress = this.onPress.bind(this);
    this.renderElement = this.renderElement.bind(this);
  }

  onPress() {
    const { href, handleLinkPress } = this.props;

    if (!handleLinkPress) {
      console.log('No "handleLinkPress" handle defined on the anchor element.');
      return;
    }

    handleLinkPress(href);
  }

  renderElement(element, style) {
    const { renderElement } = this.props;

    if (isImg(element)) {
      // In the A element image can not be previewed because it opens a link.
      const inlineImage = _.merge({}, element, { attributes: { lightbox: false } });
      return renderElement(inlineImage, style, renderElement);
    }

    return renderElement(element, style, renderElement);
  }

  render() {
    // Because the anchor has dynamic display nature
    // it can not use the TouchableOpacity component to wrap the children.
    // The TouchableOpacity component can not be nested within the "Text" component.
    return <Inline {...this.props} onPress={this.onPress} renderElement={this.renderElement} />;
  }
}

function openLinkPress(Component) {
  return function (props) {
    function handleLinkPress(href) {
      Linking.openURL(href)
        .catch(err => console.log('An error occurred', err));
    }

    return <Component {...props} handleLinkPress={handleLinkPress} />;
  }
}

// Named export to customize Anchor
const Anchor = combineMappers(mapElementProps)(A);
export {
  Anchor as A,
}

// Default export with added link press handle
const EnhancedA = openLinkPress(A);
export default connectStyle('shoutem.ui.Html.a')(combineMappers(mapElementProps)(EnhancedA));
