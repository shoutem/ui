import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { InlineGallery } from '../../components/InlineGallery';

/**
 * Use to render a HTML gallery component.
 * Style interface correspond to InlineGallery from @shoutem/ui.
 */
export default class Gallery extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

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
      // eslint-disable-next-line no-console
      console.warn('There is no "handlePhotoPress" handler for Gallery photo.');
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

Gallery.propTypes = {
  ...InlineGallery.propTypes,
  handlePhotoPress: PropTypes.func,
};

Gallery.defaultProps = {
  handlePhotoPress: undefined,
};
