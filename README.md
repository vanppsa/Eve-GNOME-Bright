# Eve GNOME Bright

A brightness slider in the GNOME Quick Settings panel. Uses a transparent black overlay — works on **any monitor**, no backlight, DDC/CI, or special hardware required.

## What it does

- Brightness icon in the top panel (Quick Settings)
- Click the icon: toggle dimmer on/off
- Click the arrow: open the slider
- Drag the slider: adjust brightness in real time
- Configurable floor: slider never goes below X%
- Brightness persists across sessions

## Requirements

- GNOME Shell 50
- Wayland (`gnome-shell --version` to check)

## Installation

```bash
git clone https://github.com/vanppsa/Eve-GNOME-Bright.git
cd eve-gnome-bright
chmod +x install.sh   # makes the script executable
./install.sh
```

Or without `chmod` (just run with bash directly):

```bash
git clone https://github.com/vanppsa/Eve-GNOME-Bright.git
cd eve-gnome-bright
bash install.sh
```

The script copies the files to `~/.local/share/gnome-shell/extensions/`, compiles the GSettings schema, and enables the extension.

**Note:** On Wayland, GNOME Shell only scans for new extensions at session start. If `gnome-extensions enable` fails with "Could not enable automatically", reboot your session and enable it manually:

```bash
gnome-extensions enable eve-gnome-bright@eve
```

Or open the **Extensions** app and toggle **Eve GNOME Bright** on.

## Usage

| Action | Result |
| --- | --- |
| Click the icon | Toggle dimmer on/off |
| Click the arrow | Open slider menu |
| Drag the slider | Change brightness |
| Release below floor | Snaps back to floor |

The floor is configurable in **Extensions → Eve GNOME Bright → gear icon**. Set min/max bounds and the floor value.

## Project structure

```
eve-gnome-bright/
├── extension.js      # toggle + slider + overlay
├── prefs.js          # preferences (Adw)
├── stylesheet.css    # black overlay background
├── metadata.json     # manifest
├── schemas/          # GSettings schema
├── install.sh        # installer
└── README.md
```

## Uninstall

```bash
gnome-extensions disable eve-gnome-bright@eve
rm -rf ~/.local/share/gnome-shell/extensions/eve-gnome-bright@eve
```

Reboot to finish.

## Changelog

### v1.0.1

- **Fix:** overlay no longer blocks drag-and-drop between workspaces
- **Fix:** replace removed `overlayGroup` API with `uiGroup` for GNOME 50
- **Add:** `monitors-changed` listener — overlay resizes on hotplug
- **Meta:** corrected metadata version

### v1.0.0

- Initial release

## Tested on

- Fedora Workstation · GNOME Shell 50 · Wayland
