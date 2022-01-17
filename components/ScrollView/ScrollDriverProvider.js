import { PureComponent, Children } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { DriverShape, ScrollDriver } from '@shoutem/animation';

/**
 * Use this component if you want to share animation driver between unreachable siblings.
 * Just wrap their parent component with it. We use it to share an instance of ScrollDriver
 * between Screen and NavigationBar automatically. ScrollView from @shoutem/ui uses it to
 * register its driver.
 */
export class ScrollDriverProvider extends PureComponent {
  static childContextTypes = {
    driverProvider: PropTypes.object,
    animationDriver: DriverShape,
  };

  static contextTypes = {
    animationDriver: DriverShape,
  };

  static propTypes = {
    children: PropTypes.node,
    driver: DriverShape,
    // Used to propagate animation driver changes to components who aren't
    // children of ScrollDriver, recieves driver as argument.
    onAnimationDriverChange: PropTypes.func,
    onScroll: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    this.setupAnimationDriver(props, context);
  }

  getChildContext() {
    return {
      driverProvider: this,
      animationDriver: this.animationDriver,
    };
  }

  componentDidUpdate() {
    this.setupAnimationDriver(this.props, this.context);
  }

  setupAnimationDriver(props, context) {
    const { onAnimationDriverChange } = this.props;

    if (props.driver) {
      this.animationDriver = props.driver;
    } else if (context.driverProvider) {
      this.animationDriver = context.animationDriver;
    } else if (!this.animationDriver) {
      this.animationDriver = new ScrollDriver(
        { useNativeDriver: true, nativeScrollEventThrottle: 20 },
        props.onScroll,
      );
    }

    if (onAnimationDriverChange) {
      onAnimationDriverChange(this.animationDriver);
    }
  }

  setAnimationDriver(driver, primaryScrollView) {
    if (driver || !this.animationDriver || primaryScrollView) {
      const { onAnimationDriverChange } = this.props;
      const { driverProvider } = this.context;

      _.assign(this.animationDriver, driver);
      if (onAnimationDriverChange) {
        onAnimationDriverChange(driver);
      }

      if (driverProvider) {
        driverProvider.setAnimationDriver(driver, primaryScrollView);
      }
    }
  }

  render() {
    const { children } = this.props;

    return children && Children.only(children);
  }
}
