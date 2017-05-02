import React from 'react';
import _ from 'lodash';

export default function renderItems(Component, childElements, renderElement, prefix) {
  return _.reduce(childElements, (items, element, index) => {
    const resolvedPrefix = _.isFunction(prefix) ? prefix(element, index) : undefined;
    items.push(
      <Component
        {...element}
        prefix={resolvedPrefix}
        renderElement={renderElement}
        key={`rich_media_li_${index}`}
      />
    );
    return items;
  }, []);
}
