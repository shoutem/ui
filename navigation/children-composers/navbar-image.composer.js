import React from 'react';
import {
  NavigationExperimental,
  Dimensions,
} from 'react-native';
import { NavigationBar } from '../../navigation/NavigationBar';
import { Image } from '../../index';

const {
  Header: NavigationHeader,
} = NavigationExperimental;

const navigationHeaderBackgroundImageStyle = {
  flex: 1,
  flexGrow: 1,
  left: 0,
  height: NavigationHeader.HEIGHT,
  position: 'absolute',
  right: 0,
  top: 0,
  width: Dimensions.get('window').width,
};

const NavBarComposer = {
  canCompose() {
    return (!!NavigationBar.globalNavigationBarImage);
  },
  compose() {
    return { renderBackgroundImage() {
      return (
        <Image
          source={{ uri: NavigationBar.globalNavigationBarImage }}
          style={navigationHeaderBackgroundImageStyle}
          resizeMode="cover"
          resizeMethod="resize"
        />
      );
    } };
  },
};

export default NavBarComposer;
