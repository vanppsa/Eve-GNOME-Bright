#!/usr/bin/env bash
set -euo pipefail

EXT_UUID="eve-gnome-bright@eve"
EXT_NAME="Eve GNOME Bright"
EXT_DIR="$HOME/.local/share/gnome-shell/extensions/$EXT_UUID"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Installing $EXT_NAME"

mkdir -p "$EXT_DIR/schemas"

cp -f "$SCRIPT_DIR/metadata.json" "$EXT_DIR/"
cp -f "$SCRIPT_DIR/extension.js" "$EXT_DIR/"
cp -f "$SCRIPT_DIR/prefs.js" "$EXT_DIR/"
cp -f "$SCRIPT_DIR/stylesheet.css" "$EXT_DIR/"
cp -f "$SCRIPT_DIR/schemas/"*.gschema.xml "$EXT_DIR/schemas/"

echo "==> Compiling schemas"
glib-compile-schemas "$EXT_DIR/schemas/"

echo "==> Enabling extension"
if gnome-extensions enable "$EXT_UUID" 2>/dev/null; then
    echo "    Enabled."
else
    echo "    Could not enable automatically. GNOME Shell must be reloaded first."
    echo
    echo "    1. Log out of your session (or restart, logout is enough)"
    echo "    2. Log back in"
    echo "    3. Run:  gnome-extensions enable $EXT_UUID"
    echo
    echo "    Or open the Extensions app and toggle Eve GNOME Bright on."
fi

echo "==> Done."
