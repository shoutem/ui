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
    getScene: React.PropTypes.func.isRequired,
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
