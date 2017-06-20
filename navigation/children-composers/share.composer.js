import React from 'react';
import _ from 'lodash';
import {
  View,
  ShareButton,
} from '../../index';

const ShareComposer = {
  canCompose(navBarProps) {
    return _.get(navBarProps, 'share.link');
  },
  compose(navBarProps) {
    const { title, text, link } = navBarProps.share;

    return { renderRightComponent() {
      return (
        <View virtual styleName="container">
          <ShareButton
            animationName={navBarProps.animationName}
            title={title || navBarProps.title}
            message={text}
            url={link}
          />
        </View>
      );
    } };
  },
};

export default ShareComposer;
