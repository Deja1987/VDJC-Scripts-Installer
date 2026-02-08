# Installer/Uninstaller Completion Notes

## Scope
This document summarizes remaining work and decisions needed to finalize the VDJC Scripts Installer for MIXXX.

## Current Status
- Inno Setup script: installer/VDJC_Setup.iss
- Multilingual wizard (EN/IT/ES/FR/DE)
- Custom wizard images
- Info page with localized text
- Installs mappings, scripts, PowerShell helper
- Desktop shortcut created (hidden PowerShell launch)
- Uninstall removes VDJC logs in %LOCALAPPDATA%\VDJC\logs

## Remaining Items
### 1) Repo hygiene
- Confirm the installer repo should be standalone and remove any leftover references to the old repo path.
- Add .gitignore for installer/Output (done).
- Remove existing build outputs from installer/Output (done).

### 2) Versioning
- Policy: installer version aligned to script/mapping version.
- Single source: AppVersion/AppVerName driven by one variable in VDJC_Setup.iss (done).
- Update MyAppVersion when releasing.

### 3) Metadata polish
- SupportURL/HelpURL: pending (no public support page yet).
- Publisher URL: set to installer repo (https://github.com/Deja1987/VDJC-Scripts-Installer).

### 4) License/EULA
- EULA page: yes, use LICENSE.
- LicenseFile added to VDJC_Setup.iss (done).

### 5) Signing
- Status: TODO (no certificate yet).
- Obtain a code signing certificate.
- Add signing step to release pipeline (signtool) to avoid Windows SmartScreen warnings.

### 6) Localization review
- Reviewed README_* and wizard InfoText; no wording changes needed.
- Minor punctuation tweak in README_* (.exe).
- Consider using a single source and regenerating localized strings to avoid drift.

### 7) Uninstall behavior
- Logs: remove on uninstall (kept).
- Script install folder: do not delete if empty.
- Remove VDJC mapping/script files from MIXXX controllers and helper script on uninstall (done).

### 8) Installer UX
- Requirements page: added (MIXXX must be installed).
- Final page checkboxes: not requested.

## Build Steps (Current)
1) Open a PowerShell terminal.
2) Run:
   - "C:\Users\lucad\AppData\Local\Programs\Inno Setup 6\ISCC.exe" "installer\VDJC_Setup.iss"
3) Output:
   - installer\Output\VDJC_Mixxx_Controller_Setup.exe

## Key Files
- installer/VDJC_Setup.iss
- installer/VDJC_WizardImage.bmp
- installer/VDJC_WizardSmall.bmp
- installer/README_en.txt
- installer/README_it.txt
- installer/README_es.txt
- installer/README_fr.txt
- installer/README_de.txt
- mixxx_midi_mapping/UpdatePresetsAndStartMixxx.ps1

## Notes
- PowerShell script supports hidden execution, logging, and controller path override.
- Desktop shortcut passes ControllersDir to avoid wrong path issues on custom Mixxx installs.
