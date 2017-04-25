import React, { Component } from 'react';
import { InlineGallery } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

class RichMediaGallery extends Component {
  static propTypes = {
    ...InlineGallery.propTypes,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };

    this.onIndexSelected = this.onIndexSelected.bind(this);
    this.onPhotoPress = this.onPhotoPress.bind(this);
  }

  onIndexSelected(selectedIndex) {
    this.setState({ selectedIndex });
  }

  onPhotoPress() {
    const { data, onPhotoPress } = this.props;
    const { selectedIndex } = this.state;

    if (!onPhotoPress) {
      console.log('There is no "onPhotoPress" handler for RichMediaGallery photo.');
      return;
    }

    onPhotoPress(data, selectedIndex);
  }

  render() {
    const { selectedIndex } = this.state;

    return (
      <InlineGallery
        onPress={this.onPhotoPress}
        onIndexSelected={this.onIndexSelected}
        selectedIndex={selectedIndex}
        {...this.props}
      />
    );
  }
}

export default connectStyle('shoutem.ui.RichMedia.Gallery')(RichMediaGallery);
