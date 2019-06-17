import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

import { Icon } from './Icon';
import { View } from './View';
import { Button } from './Button';
import { TextInput } from './TextInput';

const { func, object, shape, string } = PropTypes;

const ClearButton = ({ style, onPress }) => (
  <Button
    styleName="clear tight"
    onPress={onPress}
  >
    <Icon
      name="clear-text"
      style={style.clearIcon}
    />
  </Button>
);

ClearButton.propTypes = {
  style: object,
  onPress: func,
};

/**
 * A component that allows the user to enter a search query.
 * It has a search icon, placeholder and a button that clears the current query.
 *
 */
class SearchField extends PureComponent {
  static propTypes = {
    // A placeholder for input when no value is entered
    placeholder: string,
    // Called with the new value on text change
    onChangeText: func,
    // Styles for container and search icon
    style: shape({
      clearIcon: object,
      container: object,
      input: object,
      searchIcon: object,
    }),
    // Value to render as text in search input
    value: string,
  };

  render() {
    const { onChangeText, placeholder, style, value, ...rest } = this.props;

    return (
      <View
        style={style.container}
        styleName="horizontal sm-gutter-horizontal v-center"
      >
        <Icon
          name="search"
          style={style.searchIcon}
        />
        <TextInput
          {...rest}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={onChangeText}
          placeholder={placeholder}
          style={style.input}
          value={value}
        />
        {value && (
          <ClearButton
            onPress={() => onChangeText('')}
            style={style}
          />
        )}
      </View>
    );
  }
}

const AnimatedSearchField = connectAnimation(SearchField);
const StyledSearchField = connectStyle('shoutem.ui.SearchField')(AnimatedSearchField);

export {
  StyledSearchField as SearchField,
};
