import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import HeaderContentCommand from './header-content-command';
/**
 * The header-Content editing.
 *
 * Introduces the `'header-Content'` command and the `'header-Content'` model element.
 *
 * @extends module:core/plugin~Plugin
 */

export default class HeaderContentEditing extends Plugin {

  /**
   * @inherit
   */

  init() {
    const editor = this.editor;
    const items = editor.config.get(('headerContent.items'));
    editor.commands.add('headerContent', new HeaderContentCommand(editor, items));
  }
}
