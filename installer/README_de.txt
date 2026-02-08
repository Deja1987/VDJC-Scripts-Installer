VDJC Skript-Installer fuer MIXXX

Dieser Installer liefert die Windows-Einrichtung fuer Skripte, Controller-Mappings und Hilfsprogramme, die fuer VDJC Virtual DJ Controller mit MIXXX erforderlich sind.

Wichtige Voraussetzung
MIXXX muss vor der Installation installiert sein. Dieser Installer installiert MIXXX nicht.

Was dieser Installer macht
- Installiert VDJC Mapping-Dateien in den MIXXX-controllers-Ordner
- Installiert das MIXXX JavaScript-Controller-Skript
- Installiert ein PowerShell-Hilfsskript
- Erstellt eine Desktop-Verknuepfung zum Ausfuehren des Skripts

Was das PowerShell-Skript macht
- Findet das MIXXX-Konfigurationsverzeichnis
- Liest Effekt-Konfigurationsdateien wie effects.xml
- Extrahiert Chain Effect Presets, Quick Effect Presets und Available Effects
- Erzeugt die Preset/Effekt-Listen im VDJC-JavaScript neu
- Haelt VDJC mit der aktuellen MIXXX-Konfiguration synchron
- Startet MIXXX nach Abschluss der Aktualisierung

Voraussetzungen
- Windows 10 oder Windows 11
- MIXXX bereits installiert
- PowerShell (in Windows enthalten)

Installation
1. Stelle sicher, dass MIXXX bereits installiert ist.
2. Lade den Installer exe aus dem Releases-Bereich herunter.
3. Starte den Installer und folge den Anweisungen.
4. Nutze die Desktop-Verknuepfung (falls installiert), um Presets zu aktualisieren und MIXXX zu starten.
5. Waehle in MIXXX das VDJC Mapping in den Controller-Einstellungen.

Deinstallation
Die Deinstallation entfernt VDJC-Mappings, Hilfsdateien, Verknuepfungen und VDJC-Runtime-Daten.
MIXXX und persoenliche Einstellungen bleiben erhalten.

Lizenz
Dieses Projekt steht unter der MIT-Lizenz.

Trademark Notice
"VDJC", "VDJC Project" und zugehoerige Namen, Logos und visuelle Identitaeten sind Marken des VDJC Project.
Die MIT-Lizenz gilt nur fuer den Quellcode dieses Repositories und erlaubt nicht die Nutzung des VDJC-Namens, Brandings oder der Logos in abgeleiteten Werken, kommerziellen Produkten oder Weiterverteilungen ohne schriftliche Zustimmung.
