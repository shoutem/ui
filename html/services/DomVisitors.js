import _ from 'lodash';

// Shoutem RTE component wraps any video attachment (hosted inside iframe or video) with <figure>
// element. That element contains style that breaks the SimpleHtml UI - enormous blank
// space below attachment.
// This function removes height and padding-bottom styles from figure to fix this UI issue.
export const removeShoutemRteVideoAttachmentWrapper = element => {
  if (
    (element.name === 'figure' || element.name === 'video') &&
    element.children.length > 0 &&
    // <figure> can have multiple generated children too - type:text. Probably caused by empty space between
    // figure and iframe elements in generated HTML.
    _.some(
      element.children,
      ({ name }) => name === 'iframe' || name === 'video',
    )
  ) {
    // Remove height and padding-bottom styles because they break the UI
    element.attribs.style = element.attribs.style
      ? element.attribs.style
          .replace(/height:[^;]+;?/, '')
          .replace(/padding-bottom:[^;]+;?/, '')
      : '';
  }

  return element;
};

/**
 * Collection of node (HTML element) alteration callbacks. Define any html element
 * manipulations inside.
 * @param {*} element - HTML element to check against and manipulate if necessary
 * @returns Manipulated HTML element
 */
export const onElement = element => {
  return removeShoutemRteVideoAttachmentWrapper(element);
};
