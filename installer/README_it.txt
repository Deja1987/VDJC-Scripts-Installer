VDJC Scripts Installer per MIXXX

Questo installer fornisce la configurazione Windows per script, mapping e utilita' necessarie a usare VDJC Virtual DJ Controller con MIXXX.

Requisito importante
MIXXX deve essere installato prima di eseguire questo installer. L'installer non installa MIXXX.

Cosa fa questo installer
- Installa i file di mapping VDJC nella cartella controllers di MIXXX
- Installa lo script JavaScript del controller MIXXX
- Installa uno script PowerShell di supporto
- Crea un collegamento sul desktop per eseguire lo script

Cosa fa lo script PowerShell
- Trova la directory di configurazione di MIXXX
- Legge file di configurazione effetti come effects.xml
- Estrae Chain Effect Presets, Quick Effect Presets e Available Effects
- Rigenera le liste preset/effetti nel file JavaScript di VDJC
- Mantiene VDJC sincronizzato con la configurazione MIXXX
- Avvia MIXXX al termine dell'aggiornamento

Requisiti
- Windows 10 o Windows 11
- MIXXX gia' installato
- PowerShell (incluso in Windows)

Installazione
1. Assicurati che MIXXX sia gia' installato.
2. Scarica l'installer exe dalla sezione Releases.
3. Avvia l'installer e segui le istruzioni a schermo.
4. Usa il collegamento sul desktop (se installato) per aggiornare i preset e avviare MIXXX.
5. In MIXXX, seleziona la mappatura VDJC dalle impostazioni controller.

Disinstallazione
La disinstallazione rimuove mapping VDJC, file di supporto, collegamenti e dati runtime di VDJC.
Non rimuove MIXXX o le configurazioni personali.

Licenza
Questo progetto e' rilasciato sotto licenza MIT.

Trademark Notice
"VDJC", "VDJC Project" e nomi correlati, loghi e identita' visive sono marchi di VDJC Project.
La licenza MIT si applica solo al codice sorgente di questo repository e non concede il permesso di usare il nome VDJC, il branding o i loghi in opere derivate, prodotti commerciali o redistribuzioni senza consenso scritto.
