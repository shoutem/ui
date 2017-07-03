import htmlparser2 from 'htmlparser2';

/**
 * Decode HTML "entities" (special characters)
 * to the human readable format.
 * For example `&gt;` to `>`.
 * @param str {String} Raw HTML
 * @returns {string}
 */
function decodeHtmlEntities(str) {
  return str.replace(/&#([0-9]{1,3});/gi, (match, numStr) => {
    const num = parseInt(numStr, 10); // read num as normal number
    return String.fromCharCode(num);
  });
}

function createElementNode(tag, attributes = {}, childElements = [], parent) {
  return {
    tag,
    attributes,
    childElements,
    parent,
  };
}

/**
 * Use to create (save) a HTML tree copy out of element nodes
 * by recursively going through the HTML tree,
 * from a root node to the last child of the tree.
 */
class HtmlTree {
  /**
   * Set a tree basic nodes.
   * @param rootElementTag {String} The root element tag is safety wrapper around a parsed HTML
   *   because the HTML can have multiple root elements which is not supported by the RN.
   */
  constructor(rootTag = 'div') {
    this.rootNode = createElementNode(rootTag);
    this.activeNode = this.rootNode;
    this.openTag = this.openTag.bind(this);
    this.appendText = this.appendText.bind(this);
    this.closeTag = this.closeTag.bind(this);
  }

  /**
   * Create new element, add it to active node, and set it as active.
   * @param tag {String} Element Tag name
   * @param attributes {Object} Element attributes
   * @param childElements {Array} Element children
   */
  openTag(tag, attributes, childElements) {
    const element = this.addChild(tag, attributes, childElements);
    this.activeNode = element;
  }

  /**
   * Create new element and add to active node.
   * @param tag {String} Element Tag name
   * @param attributes {Object} Element attributes
   * @param childElements {Array} Element children
   * @returns {Element}
   */
  addChild(tag, attributes, childElements) {
    const element = createElementNode(tag, attributes, childElements, this.activeNode);

    this.activeNode.childElements.push(element);

    return element;
  }

  /**
   * Add text element to active node.
   * @param text
   */
  appendText(text) {
    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      // Whitespace around element tags is ignored
      return;
    }
    this.addChild('text', undefined, [decodeHtmlEntities(trimmedText)]);
  }

  getParent() {
    return this.activeNode.parent;
  }

  closeTag() {
    this.activeNode = this.getParent();
  }

  getRootNode() {
    return this.rootNode;
  }
}

/**
 * Create a HtmlTree copy from a raw HTML wrapped with rootTag.
 * @param html {String} Raw HTML
 * @param rootTag {String} Root element tag
 * @returns {HtmlTree}
 */
export function parseHtml(html, rootTag = 'div') {
  const htmlTree = new HtmlTree(rootTag);

  const parser = new htmlparser2.Parser({
    onopentag: htmlTree.openTag,
    ontext: htmlTree.appendText,
    onclosetag: htmlTree.closeTag,
  });

  // The browsers ignore new lines so we are skipping them as well.
  const strippedHtml = html.replace(/\n/g, ' ').trim();

  parser.write(strippedHtml);
  parser.end();

  return htmlTree;
}
