import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

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
  title: PropTypes.string,
  children: PropTypes.node,
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
