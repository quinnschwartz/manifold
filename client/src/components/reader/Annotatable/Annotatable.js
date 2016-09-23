import React, { Children, Component, PropTypes } from 'react';
import has from 'lodash/has';
import AnnotationPopup from './AnnotationPopup';

class Annotatable extends Component {

  static propTypes = {
    children: React.PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    createAnnotation: React.PropTypes.func,
    sectionId: React.PropTypes.string
  }

  constructor() {
    super();
    this.updateSelection = this.updateSelection.bind(this);
    this.startSelection = this.startSelection.bind(this);
    this.updateStateSelection = this.updateStateSelection.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.highlightSelection = this.highlightSelection.bind(this);
    this.annotateSelection = this.annotateSelection.bind(this);
    this.shareSelection = this.shareSelection.bind(this);
    this.closestTextNode = this.closestTextNode.bind(this);
    this.setDefaultState();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.startSelection, false);
    document.addEventListener('keydown', this.handleKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.startSelection, false);
    document.removeEventListener('mouseup', this.updateSelection, false);
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }

  setDefaultState() {
    this.state = {
      selection: null
    };
  }

  // This method handles shift + arrow selection modification
  handleKeyDown(event) {
    const key = event.keyCode;
    const isShift = event.shiftKey;
    if (isShift && (key >= 37 && key <= 40)) {
      this.updateSelection(event);
    }
  }

  // The native selection is read only, so we'll map it to a similar selection object
  // that we have more control over.
  updateStateSelection(nativeSelection) {
    let selection = null;
    if (nativeSelection) {
      selection = this.mapSelectionToState(nativeSelection);
    }
    if (this.compareSelections(selection, this.state.selection) === true) return;
    this.setState({ selection });
  }

  // Maps the browser selection object to component state
  mapSelectionToState(selection) {
    return {
      anchorNode: selection.anchorNode,
      anchorOffset: selection.anchorOffset,
      focusNode: selection.focusNode,
      focusOffset: selection.focusOffset,
      text: selection.toString(),
      range: this.mapSelectionToRange(selection)
    };
  }

  // Maps selection to an annotation data structure
  mapSelectionToAnnotation(selection, format) {

    const range = selection.range;

    // 1. Find the closest element with a data-node-uuid attribute
    const startNode = this.closestTextNode(range.startContainer);

    // 2. Create a new range that ends with the start point of our existing range
    const startRange = document.createRange();
    startRange.setStart(startNode, 0);
    startRange.setEnd(range.startContainer, range.startOffset + 1);

    // 3. Find the offset from the data-node-uuid start element
    const startChar = startRange.toString().length;

    // 4. Do the same for the end node
    const endNode = this.closestTextNode(range.endContainer);
    const endRange = document.createRange();
    endRange.setStart(endNode, 0);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endChar = endRange.toString().length;

    const annotation = {
      startNode: startNode.dataset.nodeUuid,
      startChar,
      endNode: endNode.dataset.nodeUuid,
      endChar,
      subject: selection.text,
      format
    };
    return annotation;
  }

  // Maps the browser selection to a range object.
  mapSelectionToRange(selection) {
    console.log(selection, 'selection');
    console.log(selection.getRangeAt(0), 'range');
    return selection.getRangeAt(0);
  }

  // Find the closest element tagged as a text node.
  closestTextNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentElement;
      if (has(parent.dataset, 'nodeUuid')) {
        return parent;
      }
      const ancestorNode = this.closest(parent, '[data-node-uuid]');
      return ancestorNode;
    }
    const ancestorNode = this.closest(node, '[data-node-uuid]');
    return ancestorNode;
  }

  // Utility method should probably be put elsewhere.
  closest(el, selector) {
    let element = el;
    const matchesSelector = element.matches || element.webkitMatchesSelector ||
      element.mozMatchesSelector || element.msMatchesSelector;
    while (element) {
      if (matchesSelector.call(element, selector)) {
        break;
      }
      element = element.parentElement;
    }
    return element;
  }

  // Returnst true if selection a and b should be considered the same selection.
  compareSelections(a, b) {
    if (a === null && b === null) return true;
    if (a === null && b !== null) return false;
    if (b === null && a !== null) return false;
    return a.text === b.text;
  }

  // A valid selection is any selection that's not empty.
  validateSelection(nativeSelection) {
    if (nativeSelection.isCollapsed === true) return null;
    if (nativeSelection.anchorNode === null) return null;
    return nativeSelection;
  }

  updateSelection(event) {
    // We can now remove the one-time event listener that was setup when selection
    // started.
    document.removeEventListener('mouseup', this.updateSelection, false);
    // Selection events still only have varied support, so we need to depend on mouse
    // events. In the case of deselection, the mouseUp event is fired before the previous
    // selection has been cleared. We need to delay grabbing the selection until the
    // default handlers for the mouseup event have fired, and and selected text has been
    // deselected.
    setTimeout(() => {
      this.updateStateSelection(this.validateSelection(window.getSelection()));
    }, 0);
  }

  startSelection(event) {
    // Once we start the selection, we'll wait for the mouseup to happen.
    document.addEventListener('mouseup', this.updateSelection, false);
  }

  annotateSelection(event) {
    event.stopPropagation();
    const annotation = this.mapSelectionToAnnotation(this.state.selection, 'annotation');
    console.log(this.state.selection, 'selection');
    console.log(annotation, 'annotation');
    this.props.createAnnotation(this.props.sectionId, annotation);
    setTimeout(() => {
      this.updateStateSelection(null);
      window.getSelection().removeAllRanges();
    }, 0);
  }

  highlightSelection(event) {
    event.stopPropagation();
    const annotation = this.mapSelectionToAnnotation(this.state.selection, 'highlight');
    this.props.createAnnotation(this.props.sectionId, annotation);
    setTimeout(() => {
      this.updateStateSelection(null);
      window.getSelection().removeAllRanges();
    }, 0);
  }

  shareSelection() {
    console.log(this.state.selection.text);
  }

  render() {
    return (
      <div className="annotatable" >
        <AnnotationPopup
          share={this.shareSelection}
          highlight={this.highlightSelection}
          annotate={this.annotateSelection}
          selection={this.state.selection}
        />
        { this.props.children ? Children.only(this.props.children) : null }
      </div>
    );
  }

}

export default Annotatable;