/* eslint-disable react/no-multi-comp */
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';
import { Button } from './Button';
import { Icon } from './Icon';
import { TextInput } from './TextInput';
import { View } from './View';

const ClearButton = ({ style, onPress }) => (
  <Button onPress={onPress} style={style.clearButton} styleName="clear tight">
    <Icon name="clear-text" style={style.clearIcon} />
  </Button>
);

ClearButton.propTypes = {
  style: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};

/**
 * A component that allows the user to enter a search query.
 * It has a search icon, placeholder and a button that clears the current query.
 *
 */
const SearchField = ({ onChangeText, loading, style, ...otherProps }) => {
  const [text, setText] = useState(otherProps.defaultValue);

  useEffect(() => {
    onChangeText(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <View
      style={style.container}
      styleName="horizontal sm-gutter-horizontal v-center"
    >
      <Icon name="search" style={style.searchIcon} />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        value={text}
        style={style.input}
        {...otherProps}
        onChangeText={setText}
      />
      {!!text && !loading && (
        <ClearButton onPress={() => setText('')} style={style} />
      )}
      {loading && <ActivityIndicator style={style.clearButton} />}
    </View>
  );
};

SearchField.propTypes = {
  style: PropTypes.object.isRequired,
  defaultValue: PropTypes.string,
  loading: PropTypes.bool,
  onChangeText: PropTypes.func,
};

SearchField.defaultProps = {
  loading: false,
  onChangeText: undefined,
  defaultValue: '',
};

const AnimatedSearchField = connectAnimation(SearchField);
const StyledSearchField = connectStyle('shoutem.ui.SearchField')(
  AnimatedSearchField,
);

export { StyledSearchField as SearchField };
