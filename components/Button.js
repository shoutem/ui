import React, { PureComponent } from 'react';
import { LayoutAnimation, TouchableOpacity } from 'react-native';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';
import { Spinner } from './Spinner';

class Button extends PureComponent {
  componentDidUpdate(prevProps) {
    const { inProgress: prevInProgress } = prevProps;
    const { inProgress } = this.props;

    if (prevInProgress !== inProgress) {
      LayoutAnimation.easeInEaseOut();
    }
  }

  resolveStyle() {
    const { inProgress, style } = this.props;

    if (!inProgress) {
      return style;
    }

    return {
      ...style,
      ...style?.inProgress,
      borderRadius: style?.inProgress?.borderRadius || 50,
      minWidth: style?.inProgress?.minWidth || 30,
      width: style?.inProgress?.width || 50,
      paddingLeft: style?.inProgress?.paddingLeft || 0,
      paddingRight: style?.inProgress?.paddingRight || 0,
      flex: style?.inProgress?.flex || 1,
      alignSelf: style?.inProgress?.alignSelf || 'center',
      opacity: style?.inProgress?.opacity || 0.5,
    };
  }

  render() {
    const { children, inProgress, style, ...otherProps } = this.props;

    const resolvedStyle = this.resolveStyle();

    return (
      <TouchableOpacity
        {...otherProps}
        style={resolvedStyle}
        underlayColor={style?.underlayColor}
        disabled={inProgress}
      >
        {inProgress && <Spinner />}
        {!inProgress && children}
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {
  ...TouchableOpacity.propTypes,
};

Button.defaultProps = {
  inProgress: undefined,
};

const AnimatedButton = connectAnimation(Button);
const StyledButton = connectStyle('shoutem.ui.Button')(AnimatedButton);
export { StyledButton as Button };
