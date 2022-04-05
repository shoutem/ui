import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

function Stage({ title, children }) {
  // eslint-disable-next-line no-use-before-define
  const { container, stage, titleStyle } = styles;

  return (
    <View style={container}>
      <Text style={titleStyle}>{title}</Text>
      <View style={stage}>{children}</View>
    </View>
  );
}

Stage.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

Stage.defaultProps = {
  children: undefined,
  title: undefined,
};

const styles = {
  container: {
    marginVertical: 24,
    flexDirection: 'column',
  },
  titleStyle: {
    fontSize: 18,
    color: '#444f6c',
    margin: 8,
  },
  stage: {
    paddingVertical: 40,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f6f7',
  },
};

export { Stage };
