import React from 'react';
import _ from 'lodash';
import {
  View,
  ShareButton,
} from '../../index';

const createShareButton = navBarProps => () => {
  const { title, text, link } = navBarProps.share;
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
};

const ShareComposer = {
  canCompose(navBarProps) {
    return _.get(navBarProps, 'share.link');
  },
  compose(navBarProps) {
    return {
      renderRightComponent: createShareButton(navBarProps),
    };
  },
};

export default ShareComposer;
