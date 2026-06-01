# Eve GNOME Bright

A brightness slider in the GNOME Quick Settings panel. Uses a transparent black overlay — works on **any monitor**, no backlight, DDC/CI, or special hardware required.

## What it does

- Brightness icon in the top panel (Quick Settings)
- Click the icon: toggle dimmer on/off
- Click the arrow: open the slider
- Drag the slider: adjust brightness in real time
- Configurable floor: slider never goes below X%
- Brightness persists across sessions

<img width="416" height="188" alt="Image" src="https://github.com/user-attachments/assets/c51bd7bd-86f7-48d8-bd0c-6089c46a0508" />
<img width="631" height="319" alt="Image" src="https://github.com/user-attachments/assets/ece2a6a2-9843-4cca-90ba-4d39e4629330" />

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

## Tested on

- Fedora Workstation · GNOME Shell 50 · Wayland
