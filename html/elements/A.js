import React, { PureComponent } from 'react';
import { Linking } from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { combineMappers, ElementPropTypes, mapElementProps } from '../Html';
import { isImg } from './Img';
import { Inline } from './Inline';

class A extends PureComponent {
  constructor(props, context) {
    super(props, context);

    autoBindReact(this);
  }

  onPress() {
    const { href, handleLinkPress } = this.props;

    if (!handleLinkPress) {
      // eslint-disable-next-line no-console
      console.warn(
        'No "handleLinkPress" handle defined on the anchor element.',
      );
      return;
    }

    handleLinkPress(href);
  }

  renderElement(element, style) {
    const { renderElement } = this.props;

    if (isImg(element)) {
      // In the A element image can not be previewed because it opens a link.
      const inlineImage = _.merge({}, element, {
        attributes: { lightbox: false },
      });
      return renderElement(inlineImage, style, renderElement);
    }

    return renderElement(element, style, renderElement);
  }

  render() {
    // Because the anchor has dynamic display nature
    // it can not use the TouchableOpacity component to wrap the children.
    // The TouchableOpacity component can not be nested within the "Text" component.
    return (
      <Inline
        {...this.props}
        onPress={this.onPress}
        renderElement={this.renderElement}
      />
    );
  }
}

A.propTypes = {
  ...ElementPropTypes,
  handleLinkPress: PropTypes.func,
  href: PropTypes.string,
};

A.defaultProps = {
  handleLinkPress: undefined,
  href: undefined,
};

function openLinkPress(Component) {
  return function(props) {
    function handleLinkPress(href) {
      Linking.openURL(href).catch(err =>
        // eslint-disable-next-line no-console
        console.error('An error occurred while opening URL', err),
      );
    }

    return <Component {...props} handleLinkPress={handleLinkPress} />;
  };
}

// Named export to customize Anchor
const Anchor = combineMappers(mapElementProps)(A);
export { Anchor as A };

// Default export with added link press handle
const EnhancedA = openLinkPress(A);
export default connectStyle('shoutem.ui.Html.a')(
  combineMappers(mapElementProps)(EnhancedA),
);
