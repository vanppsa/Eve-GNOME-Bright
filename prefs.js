import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class EveGnomeBrightPreferences extends ExtensionPreferences {
    getPreferencesWidget() {
        const settings = this.getSettings();

        const page = new Adw.PreferencesPage({
            title: 'Brightness',
            icon_name: 'display-brightness-symbolic',
        });

        const group = new Adw.PreferencesGroup({
            title: 'Brightness Floor',
            description: 'Set the lower bound of the slider. The screen will never dim below this value.',
        });
        page.add(group);

        const minInputRow = new Adw.SpinRow({
            title: 'Input Minimum',
            subtitle: 'Lower bound of the brightness field',
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 100,
                step_increment: 1,
                value: settings.get_int('min-input'),
            }),
        });
        group.add(minInputRow);
        settings.bind('min-input', minInputRow, 'value', Gio.SettingsBindFlags.DEFAULT);

        const maxInputRow = new Adw.SpinRow({
            title: 'Input Maximum',
            subtitle: 'Upper bound of the brightness field',
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 100,
                step_increment: 1,
                value: settings.get_int('max-input'),
            }),
        });
        group.add(maxInputRow);
        settings.bind('max-input', maxInputRow, 'value', Gio.SettingsBindFlags.DEFAULT);

        const minBrAdjustment = new Gtk.Adjustment({
            lower: settings.get_int('min-input'),
            upper: settings.get_int('max-input'),
            step_increment: 1,
            value: settings.get_int('min-brightness'),
        });
        const minBrRow = new Adw.SpinRow({
            title: 'Brightness Floor (%)',
            subtitle: 'Minimum brightness allowed by the slider',
            adjustment: minBrAdjustment,
        });
        group.add(minBrRow);
        settings.bind('min-brightness', minBrRow, 'value', Gio.SettingsBindFlags.DEFAULT);

        minInputRow.connect('changed', () => {
            minBrAdjustment.lower = minInputRow.value;
        });
        maxInputRow.connect('changed', () => {
            minBrAdjustment.upper = maxInputRow.value;
        });

        return page;
    }
}
