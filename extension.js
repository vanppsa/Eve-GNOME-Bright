import St from 'gi://St';
import Shell from 'gi://Shell';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as QuickSettings from 'resource:///org/gnome/shell/ui/quickSettings.js';
import {Slider} from 'resource:///org/gnome/shell/ui/slider.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

const ICON_NAME = 'display-brightness-symbolic';

class Overlay {
    constructor() {
        this._actor = new St.Widget({
            style_class: 'eve-gnome-bright-overlay',
            x: 0,
            y: 0,
            width: global.stage.get_width(),
            height: global.stage.get_height(),
            reactive: false,
            opacity: 0,
        });
        Shell.util_set_hidden_from_pick(this._actor, true);
        Main.layoutManager.uiGroup.add_child(this._actor);
        Main.layoutManager.uiGroup.set_child_below_sibling(this._actor, Main.layoutManager.modalDialogGroup);

        this._monitorsChangedId = global.backend.get_monitor_manager().connect('monitors-changed', () => {
            this._actor.set_width(global.stage.get_width());
            this._actor.set_height(global.stage.get_height());
        });
    }

    setBrightness(value) {
        const opacity = Math.max(0, Math.min(255, Math.round((1 - value) * 255)));
        this._actor.set_opacity(opacity);
    }

    destroy() {
        if (this._monitorsChangedId) {
            global.backend.get_monitor_manager().disconnect(this._monitorsChangedId);
            this._monitorsChangedId = null;
        }
        if (this._actor) {
            this._actor.get_parent()?.remove_child(this._actor);
            this._actor.destroy();
            this._actor = null;
        }
    }
}

export default class EveGnomeBrightExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._overlay = new Overlay();

        this._toggle = new QuickSettings.QuickMenuToggle({
            title: 'Brightness',
            iconName: ICON_NAME,
            toggleMode: true,
            menuEnabled: true,
        });

        this._toggle.menu.setHeader(ICON_NAME, 'Brightness');

        const initialValue = Math.max(
            this._settings.get_int('min-brightness') / 100,
            this._settings.get_double('brightness') / 100);

        this._slider = new Slider(initialValue);
        this._toggle.menu.box.add_child(this._slider);

        this._slider.connect('notify::value', () => {
            const v = this._slider.value;
            const floor = this._settings.get_int('min-brightness') / 100;
            this._settings.set_double('brightness', v * 100);
            if (this._toggle.checked)
                this._overlay.setBrightness(Math.max(floor, v));
        });

        this._slider.connect('drag-end', () => {
            const floor = this._settings.get_int('min-brightness') / 100;
            if (this._slider.value < floor)
                this._slider.value = floor;
        });

        this._toggle.checked = this._settings.get_boolean('enabled');
        this._toggle.connect('notify::checked', () => {
            const checked = this._toggle.checked;
            this._settings.set_boolean('enabled', checked);
            if (checked)
                this._overlay.setBrightness(this._slider.value);
            else
                this._overlay.setBrightness(1.0);
        });

        this._indicator = new QuickSettings.SystemIndicator();
        this._indicator.quickSettingsItems.push(this._toggle);
        Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);

        this._settingsChangedId = this._settings.connect('changed::min-brightness', () => {
            const floor = this._settings.get_int('min-brightness') / 100;
            if (this._slider.value < floor)
                this._slider.value = floor;
        });

        if (this._toggle.checked)
            this._overlay.setBrightness(this._slider.value);
    }

    disable() {
        if (this._settingsChangedId && this._settings) {
            this._settings.disconnect(this._settingsChangedId);
            this._settingsChangedId = null;
        }
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
        if (this._overlay) {
            this._overlay.destroy();
            this._overlay = null;
        }
        this._settings = null;
    }
}
