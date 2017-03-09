import React, { Component } from 'react';

import { View } from '../../index';

/**
 * A HorizontalPager page. This component is used in
 * HorizontalPager in order to prevent unnecessary
 * rendering of pages that are not currently visible.
 */
export class Page extends Component {
  static propTypes = {
    isActive: React.PropTypes.bool.isRequired,
    width: React.PropTypes.number.isRequired,
    style: React.PropTypes.object,
    children: React.PropTypes.node,
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.isActive;
  }

  render() {
    const {
      width,
      style,
      children,
    } = this.props;

    return (
      <View
        virtual
        style={{ ...style, width }}
      >
        {children}
      </View>
    );
  }
}
