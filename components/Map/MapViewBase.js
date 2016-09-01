import {
  MapView,
  Image,
  InteractionManager,
} from 'react-native';

import {
  Component,
  PropTypes,
} from 'react';

import _ from 'lodash';

const DEFAULT_ZOOM_SETTINGS = {
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

// ShoutEm HQ location
const DEFAULT_REGION = {
  longitude: 15.9994209,
  latitude: 45.8109446,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

function getUserLocation(success, error) {
  navigator.geolocation.getCurrentPosition(success, error);
}

function isLocatedAt(coordinates) {
  return marker => marker.latitude === coordinates.latitude
  && marker.longitude === coordinates.longitude;
}

/**
 * A base class which needs to be subclassed by the OS-specific implementations.
 * Tracks state of the map regions and selected markers.
 *
 * @returns {null}
 */
export default class MapViewBase extends Component {
  constructor(props) {
    super(props);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.onMarkerPress = this.onMarkerPress.bind(this);
    this.state = {
      markerCoordinates: null,
      selectedMarker: props.selectedMarker || null,
      region: null,
      initialRegion: null,
      isReady: false,
    };
  }

  componentWillMount() {
    this.resolveInitialRegion();
  }

  onMarkerPress(pressEvent) {
    const {
      markers,
      onMarkerPressed,
    } = this.props;

    const selectedCoordinates = this.getCoordinatesFromNativeEvent(pressEvent);
    const selectedMarker = markers.find(isLocatedAt(selectedCoordinates));

    this.setState({
      markerCoordinates: selectedCoordinates,
      selectedMarker,
      ...DEFAULT_ZOOM_SETTINGS,
    });

    if (onMarkerPressed) {
      onMarkerPressed(selectedMarker);
    }
  }

  onRegionChange(region) {
    this.setState({ region });
    const {
      onRegionChanged,
    } = this.props;

    if (onRegionChanged) {
      onRegionChanged(region);
    }
  }

  getInitialRegion() {
    return this.state.initialRegion;
  }

  getMarkerImage(marker) {
    const { selectedMarkerImage, markerImage } = this.props;
    const { selectedMarker } = this.state;

    return selectedMarker && _.isEqual(marker, selectedMarker) ? selectedMarkerImage : markerImage;
  }

  resolveInitialRegion() {
    const { initialRegion, markers, focusUserLocation } = this.props;

    let region = DEFAULT_REGION;
    if (focusUserLocation) {
      getUserLocation(
        (location) => this.updateInitialRegion(location.coords),
        () => this.updateInitialRegion(region)
      );
      return;
    } else if (initialRegion) {
      region = initialRegion;
    } else if (markers.length > 0) {
      region = markers[0];
    }
    this.updateInitialRegion(region);
  }

  isMapReadyToRender() {
    return this.state.isReady;
  }

  updateInitialRegion(region) {
    this.setState({
      initialRegion: {
        ...DEFAULT_ZOOM_SETTINGS,
        ...region,
      },
    });
    InteractionManager.runAfterInteractions(() => this.setState({ isReady: true }));
  }

  // Override in subclass
  render() {
    return null;
  }
}

MapViewBase.propTypes = {
  ...MapView.propTypes,
  markerImage: Image.propTypes.source,
  selectedMarkerImage: Image.propTypes.source,
  selectedMarker: MapView.propTypes.region,
  style: PropTypes.object,
  initialRegion: MapView.propTypes.region,
  markers: MapView.propTypes.annotations,
  onMarkerPressed: PropTypes.func,
  onRegionChanged: PropTypes.func,
  focusUserLocation: PropTypes.bool,
};

MapViewBase.defaultProps = {
  markerImage: require('../../assets/images/pin-light@3x.png'),
  selectedMarkerImage: require('../../assets/images/pin-dark@3x.png'),
};
