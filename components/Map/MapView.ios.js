import {
  MapView,
} from 'react-native';

import React from 'react';

import MapViewBase from './MapViewBase';
import { connectStyle } from '@shoutem/theme';

function getMarkerLatLong(marker) {
  return {
    latitude: marker.latitude,
    longitude: marker.longitude,
  };
}
/**
 * Renders an MapView using an iOS-specific MapView implementation
 *
 * It accepts the following props:
 *
 * initialRegion - intial region to be displayed on the map
 *               - eg.
 *                 {
 *                   latitude: 48.83367,
 *                   longitude: 2.39423,
 *                   latitudeDelta: 0.01,
 *                   longitudeDelta: 0.01,
 *                 }
 *                 where latitude and longitude represent the center
 *                 and deltas represent the max distance from the
 *                 center to be displayed.
 *
 * markers - array of objects containing latitude and longitude of
 *           pins to be displayed on the map
 *
 * onMarkerPressed - callback executed when a marker on the map is pressed
 *                   with the selected as an argument
 *
 * onRegionChanged - callback executed when the region on the map is changed
 *                   with the region coordinates as an argument
 *
 * zoomEnabled - is zooming enabled, default true
 *
 * rotateEnabled - is rotate enabled, default true
 *
 * scrollEnabled - is scroll enabled, default true
 *
 * markerImage - a local image asset to be shown instead of the default pin
 *               eg. require('./../../assets/images/pin_dark@3x.png')
 *
 * Example:
 *
 * ```
        <MapView
          initialRegion={initialRegion}
          markers={markers}
          onMarkerPressed={marker => console.warn(marker.title)}
          onRegionChanged={region => console.warn(region.latitude)}
        />
 * ```
 */
class MapViewIOS extends MapViewBase {
  getCoordinatesFromNativeEvent(coordinates) {
    return coordinates;
  }

  createAnnotations() {
    const { markers } = this.props;

    return markers.map(marker => ({
      ...marker,
      onFocus: () => this.onMarkerPress(getMarkerLatLong(marker)),
      image: this.getMarkerImage(marker),
    }));
  }

  render() {
    if (!this.isMapReadyToRender()) {
      return null;
    }
    return (
      <MapView
        region={this.getInitialRegion()}
        annotations={this.createAnnotations()}
        onRegionChange={this.onRegionChange}
        onMarkerPress={this.onMarkerPress}
        {...this.props}
      />
    );
  }
}

MapViewIOS.propTypes = {
  ...MapViewBase.propTypes,
};

const StyledMapView = connectStyle('shoutem.ui.MapView')(MapViewIOS);

export {
  StyledMapView as MapView,
};

