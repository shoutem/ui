import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';
import { Button } from './Button';
import { Icon } from './Icon';
import { TextInput } from './TextInput';
import { View } from './View';

const ClearButton = ({ style, onPress }) => (
  <Button styleName="clear tight" onPress={onPress}>
    <Icon name="clear-text" style={style.clearIcon} />
  </Button>
);

ClearButton.propTypes = {
  style: PropTypes.object,
  onPress: PropTypes.func,
};

/**
 * A component that allows the user to enter a search query.
 * It has a search icon, placeholder and a button that clears the current query.
 *
 */
class SearchField extends PureComponent {
  static propTypes = {
    // A placeholder for input when no value is entered
    placeholder: PropTypes.string,
    // Called with the new value on text change
    onChangeText: PropTypes.func,
    // Styles for container and search icon
    style: PropTypes.shape({
      clearIcon: PropTypes.object,
      container: PropTypes.object,
      input: PropTypes.object,
      searchIcon: PropTypes.object,
    }),
    // Value to render as text in search input
    value: PropTypes.string,
  };

  render() {
    const { onChangeText, placeholder, style, value, ...rest } = this.props;

    return (
      <View
        style={style.container}
        styleName="horizontal sm-gutter-horizontal v-center"
      >
        <Icon name="search" style={style.searchIcon} />
        <TextInput
          {...rest}
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

const AnimatedSearchField = connectAnimation(SearchField);
const StyledSearchField = connectStyle('shoutem.ui.SearchField')(
  AnimatedSearchField,
);

export { StyledSearchField as SearchField };
