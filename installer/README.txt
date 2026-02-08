# VDJC Scripts Installer for MIXXX

This repository contains the **Windows installer** for the scripts, controller mappings, and helper utilities required to use the **VDJC Virtual DJ Controller** with **MIXXX**.

The installer automates the setup process and keeps the VDJC controller synchronized with the user’s MIXXX configuration.

---

## ⚠️ Important requirement

**MIXXX must be installed before running this installer.**

The installer does **not** install MIXXX itself.  
It relies on MIXXX’s existing configuration files.

---

## What this installer does

The installer will:

- Install the **VDJC controller mapping files** into the MIXXX controllers directory
- Install the associated **MIXXX JavaScript controller script**
- Install a helper **PowerShell script**
- Create a **Desktop shortcut** to run the helper script

---

## What the PowerShell script does

The included PowerShell script:

- Locates the MIXXX configuration directory
- Reads effect-related configuration files (such as `effects.xml`)
- Extracts:
  - Chain Effect Presets
  - Quick Effect Presets
  - Available Effects
- Automatically regenerates the corresponding preset and effect lists inside the VDJC controller JavaScript file
- Ensures that the VDJC controller always reflects the **current MIXXX configuration**
- Starts MIXXX after the update process completes

This allows effect selectors and controls on the VDJC controller to stay perfectly synchronized with MIXXX, without manual editing.

The script runs in a **safe, non-invasive way** and does not permanently modify system security settings.

---

## Requirements

- **Windows 10 or Windows 11**
- **MIXXX (pre-installed)**
- PowerShell (included in Windows)

---

## Installation

1. Make sure **MIXXX is already installed**.
2. Download the installer `.exe` from the **Releases** section.
3. Run the installer and follow the on-screen instructions.
4. Use the Desktop shortcut (if installed) to update presets and start MIXXX.
5. In MIXXX, select the **VDJC controller mapping** from the controller settings.

---

## Uninstallation

The installer includes a standard uninstaller.

Uninstalling will:
- Remove VDJC controller mappings and scripts
- Remove VDJC helper files and shortcuts
- Remove VDJC-generated runtime data

It will **not** remove MIXXX or any personal MIXXX configuration or presets.

---

## Project status

This project is under active development.  
Feedback, bug reports, and suggestions are welcome.

---

## Related projects

- https://mixxx.org  
- VDJC – Virtual DJ Controller (Android app)

---

## License

This project is released under the **MIT License**.

---

## Trademark Notice

"VDJC", "VDJC Project", and related names, logos, and visual identities  
are trademarks of the **VDJC Project**.

The MIT License applies only to the source code contained in this repository  
and does not grant permission to use the VDJC name, branding, or logos  
in derivative works, commercial products, or redistributions  
without prior written consent.
