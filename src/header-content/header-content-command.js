import Command from "@ckeditor/ckeditor5-core/src/command";
import first from '@ckeditor/ckeditor5-utils/src/first';
import { findOptimalInsertionPosition } from '@ckeditor/ckeditor5-widget/src/utils';

export default class HeaderContentCommand extends Command {

  constructor(editor, items) {
    super(editor);
    this.tagsItems = items;
  }

  /**
   * @inheritDoc
   */
  refresh() {
    this.value = this._getValue();
    this.isEnabled = this._checkEnabled();
  }
  /**
	 * Checks the command's {@link #value}
	 * @private
	 * @returns {Boolean} The current value.
	 */
  _getValue() {
    const blocks = this.editor.model.document.selection.getSelectedBlocks();
    const firstBlock = first(blocks);
    return !!(firstBlock && findHeaderContent(firstBlock));
  }

  /**
   * Checks wether the command can be enabled in the current content
   * if returns false, current icon is disabled
   */
  _checkEnabled() {
    const selectedBlocks = this.editor.model.document.selection.getSelectedBlocks();
    const firstBlock = first(selectedBlocks);
    return !!firstBlock && firstBlock.isEmpty ? true : false;
  }

  /**
   * Creates a number of DOM elements
   * @param {*} writer 
   * @param {*} elementTags, elements that will be created within the DOM
   */
  _createElements(writer, elementTags) {
    return elementTags.map((item) => {
      const element = writer.createElement(item.tag);
      writer.appendText(item.tagText, element);
      return element;
    });
  }

  /**
   * Add elements to writer using a document fragment to be able to add more than one tag at once
   */
  _addElementToWriter(writer, element, docFrag, lastItem) {
    addEmptyParagraph(writer, docFrag);
    // add element to document fragment
    writer.append(element, docFrag);
    if (lastItem) { addEmptyParagraph(writer, docFrag); }
  }

  /**
   * Executes the command. When the command {@link #value is on}, 
   * 2 headers Elements and 1/2 content Elements will be created
   * @fires execute
   */
  execute() {
    const model = this.editor.model;
    model.change(writer => {
      const elementsCreated = this._createElements(writer, this.tagsItems);
      const docFrag = writer.createDocumentFragment();
      const insertAtSelection = findOptimalInsertionPosition(model.document.selection, model);
      elementsCreated.map((element, index) => {
        let lastItem = false;
        if (index === elementsCreated.length - 1) {
          lastItem = true;
        }
        this._addElementToWriter(writer, element, docFrag, lastItem);
      });
      model.insertContent(docFrag, insertAtSelection);
    });
  }
}

/**
 * whether headerContent tag is found
 */
function findHeaderContent(element) {
  return element.parent.name == 'headerContent' ? element.parent : null;
}

// if break line is needed within elements
function addEmptyParagraph(writer, docFrag) {
  const p1 = writer.createElement('paragraph');
  writer.append(p1, docFrag);
}
