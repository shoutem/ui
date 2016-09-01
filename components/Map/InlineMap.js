import React, {
  PropTypes,
} from 'react';
import { connectStyle } from '@shoutem/theme';
import { MapView } from './MapView';
import MapViewBase from './MapViewBase';
import { View } from '../View';

/**
 * Renders an Inline Map containing the Map as a background and child
 * components in the foreground.
 *
 * It accepts initialRegion and markers as props. Initial region is
 * an area which will be displayed on the map and the markers represent
 * locations of the pins pinpointing the exact points of interest.
 *
 * If shoutem/ui components are nested within the InlineMap they will
 * be styled in a similar fashion as if they were nested within a
 * shoutem/ui Image component.
 *
 * example:
 *
 * ```
 * <InlineMap
 *   initialRegion={{
 *     latitude: 48.83367,
 *     longitude: 2.39423,
 *     latitudeDelta: 0.01,
 *     longitudeDelta: 0.01,
 *   }}
 *   markers={
 *     [
 *       {
 *         latitude: 48.83367,
 *         longitude: 2.39423,
 *       }
 *     ]
 *   }
 *   style={{
 *     height: 160,
 *   }}
 * >
 *   <Overlay>
 *     <Subtitle>
 *       {'5 Minutes, Zagreb'}
 *     </Subtitle>
 *     <Caption>
 *       {'Heinzelova 33, 32093-5186'}
 *     </Caption>
 *   </Overlay>
 * </InlineMap>
 * ```
 *
 * @param props
 * @returns rendered InlineMap
 */
function InlineMap({
  style,
  markers,
  children,
  scrollEnabled,
  rotateEnabled,
  pitchEnabled,
  initialRegion,
  markerImage,
  selectedMarker,
}) {
  const mapProps = {
    initialRegion,
    markers,
    scrollEnabled,
    rotateEnabled,
    pitchEnabled,
    markerImage,
    selectedMarker,
  };

  return (
    <View style={style}>
      <MapView {...mapProps} />
      <View>
        {children}
      </View>
    </View>
  );
}

InlineMap.defaultProps = {
  scrollEnabled: false,
  rotateEnabled: false,
  pitchEnabled: false,
};

InlineMap.propTypes = {
  ...View.propTypes,
  ...MapViewBase.propTypes,
  children: PropTypes.element,
};

const StyledInlineMap = connectStyle('shoutem.ui.InlineMap')(InlineMap);

export {
  StyledInlineMap as InlineMap,
};
