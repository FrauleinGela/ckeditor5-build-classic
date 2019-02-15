
/**
 * @module header-content/headercontent
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import HeaderContentEditing from './header-content-editing';
import HeaderContentUI from './header-content-ui';

/**
 * The header content plugin
 * @extends module:core/plugin~Plugin
 */

// TODO: Create plugin as a new npm package
// TODO: If any of the widgets is removed, the other widgets (header-collapse/content-collapse still exists)
// if some of them is removed, should the others be removed too

export default class HeaderContent extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [HeaderContentEditing, HeaderContentUI];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'HeaderContent';
	}
}
