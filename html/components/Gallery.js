import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { InlineGallery } from '../../components/InlineGallery';

/**
 * Use to render a HTML gallery component.
 * Style interface correspond to InlineGallery from @shoutem/ui.
 */
export default class Gallery extends Component {
  static propTypes = {
    ...InlineGallery.propTypes,
    handlePhotoPress: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };

    this.onIndexSelected = this.onIndexSelected.bind(this);
    this.handlePhotoPress = this.handlePhotoPress.bind(this);
  }

  onIndexSelected(selectedIndex) {
    this.setState({ selectedIndex });
  }

  handlePhotoPress() {
    const { data, handlePhotoPress } = this.props;
    const { selectedIndex } = this.state;

    if (!handlePhotoPress) {
      console.log('There is no "handlePhotoPress" handler for RichMediaGallery photo.');
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
