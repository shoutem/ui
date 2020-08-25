import React from 'react';
import PropTypes from 'prop-types';

import { ElementPropTypes } from '../../../Html';
import { Text } from '../../../../components/Text';

export default function Number({ element, style }) {
  const { index } = element.attributes;

  return (
    <Text style={style}>
      {`${index}. `}
    </Text>
  );
}

Number.propTypes = {
  element: PropTypes.shape({ ...ElementPropTypes }),
  style: PropTypes.object,
};

Number.defaultProps = {
  element: { attributes: 0 },
  style: {},
};
