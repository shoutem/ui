import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'auto-bind/react';

import { InlineGallery } from '../../components/InlineGallery';

/**
 * Use to render a HTML gallery component.
 * Style interface correspond to InlineGallery from @shoutem/ui.
 */
export default class Gallery extends PureComponent {
  static propTypes = {
    ...InlineGallery.propTypes,
    handlePhotoPress: PropTypes.func,
  };

  static defaultProps = {
    handlePhotoPress: undefined,
  };

  constructor(props) {
    super(props);

    autoBind(this);

    this.state = {
      selectedIndex: 0,
    };
  }

  onIndexSelected(selectedIndex) {
    this.setState({ selectedIndex });
  }

  handlePhotoPress() {
    const { data, handlePhotoPress } = this.props;
    const { selectedIndex } = this.state;

    if (!handlePhotoPress) {
      console.log('There is no "handlePhotoPress" handler for Gallery photo.');
      return;
    }

    handlePhotoPress(data, selectedIndex);
  }

  render() {
    const { selectedIndex } = this.state;

    return (
      <InlineGallery
        onPress={this.handlePhotoPress}
        onIndexSelected={this.onIndexSelected}
        selectedIndex={selectedIndex}
        {...this.props}
      />
    );
  }
}
