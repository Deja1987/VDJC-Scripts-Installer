VDJC Scripts Installer for MIXXX

This installer provides the Windows setup for the scripts, controller mappings, and helper utilities required to use VDJC Virtual DJ Controller with MIXXX.

Important requirement
MIXXX must be installed before running this installer. The installer does not install MIXXX itself.

What this installer does
- Installs VDJC controller mapping files into the MIXXX controllers directory
- Installs the MIXXX JavaScript controller script
- Installs a helper PowerShell script
- Creates a Desktop shortcut to run the helper script

What the PowerShell script does
- Locates the MIXXX configuration directory
- Reads effect-related configuration files such as effects.xml
- Extracts Chain Effect Presets, Quick Effect Presets, and Available Effects
- Regenerates preset/effect lists inside the VDJC JavaScript file
- Keeps VDJC synced with the current MIXXX configuration
- Starts MIXXX after the update completes

Requirements
- Windows 10 or Windows 11
- MIXXX already installed
- PowerShell (included in Windows)

Installation
1. Make sure MIXXX is already installed.
2. Download the installer exe from the Releases section.
3. Run the installer and follow the on-screen instructions.
4. Use the Desktop shortcut (if installed) to update presets and start MIXXX.
5. In MIXXX, select the VDJC controller mapping from the controller settings.

Uninstallation
Uninstalling will remove VDJC mappings, helper files, shortcuts, and VDJC runtime data.
It will not remove MIXXX or personal MIXXX configuration.

License
This project is released under the MIT License.

Trademark Notice
"VDJC", "VDJC Project", and related names, logos, and visual identities are trademarks of the VDJC Project.
The MIT License applies only to the source code in this repository and does not grant permission to use the VDJC name, branding, or logos in derivative works, commercial products, or redistributions without prior written consent.
