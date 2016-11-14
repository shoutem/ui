import React, { Children, Component } from 'react';

/**
 * Provides the current navigation scene to child components.
 */
export class SceneProvider extends Component {
  static propTypes = {
    children: React.PropTypes.node,
    scene: React.PropTypes.object.isRequired,
  };

  static childContextTypes = {
    scene: React.PropTypes.object.isRequired,
  };

  getChildContext() {
    return {
      scene: this.props.scene,
    };
  }

  render() {
    const { children } = this.props;
    return children && Children.only(children);
  }
}
