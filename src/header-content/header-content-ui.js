import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { downcastElementToElement } from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import { upcastElementToElement } from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import agendaIcon from './theme/icons/baseline-view_agenda-24px.svg';

export default class HeaderContentUI extends Plugin {

  init() {
    // Create toolbar button
    const editor = this.editor;
    const items = editor.config.get(('headerContent.items'));
    items.map((item) => {
      // register tag
      editor.model.schema.register(item.tag, {
        allowIn: '$root',
        isObject: true,
        isBlock: true,
      });
      // Create element as a widget
      editor.conversion.for('editingDowncast').add(
        downcastElementToElement({
          model: item.tag,
          view: (modelItem, viewWriter) => {
            const widgetElement = viewWriter.createContainerElement(item.tag);
            return toWidget(widgetElement, viewWriter);
          }
        })
      );
      // converters for writing from writer to model
      editor.conversion.for('dataDowncast').add(
        downcastElementToElement({
          model: item.tag,
          view: item.tag
        })
      );

      // converters for writing from model to writer
      editor.conversion.for('upcast').add(
        upcastElementToElement({
          view: item.tag,
          model: item.tag
        })
      );
    });

    this.createToolbarButton(editor);
  }

  createToolbarButton(editor) {
    const tLocale = editor.t;
    editor.ui.componentFactory.add('headerContent', locale => {
      const command = editor.commands.get('headerContent');
      const view = new ButtonView(locale);
      view.set({
        label: tLocale('Insert header and content'),
        icon: agendaIcon,
        tooltip: true
      });
      view.bind('isEnabled').to(command);

      view.on('execute', () => {
        editor.execute('headerContent');
      });
      return view;
    });
  }
}
