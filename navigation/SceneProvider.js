import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Provides the current navigation scene to child components.
 */
export class SceneProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
    scene: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    getScene: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.getScene = this.getScene.bind(this);
  }

  getChildContext() {
    return {
      getScene: this.getScene,
    };
  }

  getScene() {
    return this.props.scene;
  }

  render() {
    const { children } = this.props;
    return children && Children.only(children);
  }
}
