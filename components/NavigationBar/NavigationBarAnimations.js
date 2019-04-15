import _ from 'lodash';

class ColorAnimation {
  constructor(options) {
    _.assign(this, options);
    if (!_.isFunction(this[this.preset])) {
      throw new Error(`Color animation preset:(${options.preset})
        you tried to create doesn't exist`);
    }
    this.animatedValue = this.driver.value;
    this.style = {};
  }

  setColors(backgroundColor, textColor) {
    this.backgroundColor = backgroundColor;
    this.textColor = textColor;

    this.style = this[this.preset](this.scrollOffset);
  }

  clearToStandard(atAnimatedValue) {
    const defaultAnimatedValue = atAnimatedValue || 150;
    const standardTextColor = this.textColor || 'rgba(0,0,0,1)';
    const animatedValue = this.animatedValue;
    return {
      color: animatedValue.interpolate({
        inputRange: [0, defaultAnimatedValue],
        outputRange: ['rgba(0,0,0,0)', standardTextColor],
        extrapolate: 'clamp',
      }),
      backgroundColor: animatedValue.interpolate({
        inputRange: [0, defaultAnimatedValue],
        outputRange: ['rgba(0,0,0,0)', 'rgba(255,255,255,1)'],
        extrapolate: 'clamp',
      }),
      borderBottomColor: animatedValue.interpolate({
        inputRange: [defaultAnimatedValue / 2, defaultAnimatedValue],
        outputRange: ['rgba(0,0,0,0)', 'rgba(51, 51, 51, 0.2)'],
        extrapolate: 'clamp',
      }),
    };
  }
}

export const NavigationBarAnimations = {
  ColorAnimation,
};
