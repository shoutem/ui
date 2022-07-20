import React, { PureComponent } from 'react';
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
class SearchField extends PureComponent {
  render() {
    const {
      onChangeText,
      placeholder,
      style,
      value,
      ...otherProps
    } = this.props;

    return (
      <View
        style={style.container}
        styleName="horizontal sm-gutter-horizontal v-center"
      >
        <Icon name="search" style={style.searchIcon} />
        <TextInput
          {...otherProps}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={onChangeText}
          placeholder={placeholder}
          style={style.input}
          value={value}
        />
        {!!value && (
          <ClearButton onPress={() => onChangeText('')} style={style} />
        )}
      </View>
    );
  }
}

SearchField.propTypes = {
  // Styles for container and search icon
  style: PropTypes.shape({
    clearIcon: PropTypes.object,
    container: PropTypes.object,
    input: PropTypes.object,
    searchIcon: PropTypes.object,
  }).isRequired,
  // A placeholder for input when no value is entered
  placeholder: PropTypes.string,
  // Value to render as text in search input
  value: PropTypes.string,
  // Called with the new value on text change
  onChangeText: PropTypes.func,
};

SearchField.defaultProps = {
  placeholder: undefined,
  value: undefined,
  onChangeText: undefined,
};

const AnimatedSearchField = connectAnimation(SearchField);
const StyledSearchField = connectStyle('shoutem.ui.SearchField')(
  AnimatedSearchField,
);

export { StyledSearchField as SearchField };
