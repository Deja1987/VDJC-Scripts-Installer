; VDJC Mixxx Controller Installer (Inno Setup)
; Build with Inno Setup 6+

#define MyAppVersion "1.0.0"

[Setup]
AppName=VDJC Mixxx Controller
AppVersion={#MyAppVersion}
AppPublisher=Virtual DJ Console (VDJC)
AppPublisherURL=https://github.com/Deja1987/VDJC-Scripts-Installer
AppVerName=VDJC Mixxx Controller {#MyAppVersion}
LicenseFile=..\LICENSE
DefaultDirName={localappdata}\VDJC
DisableDirPage=yes
DisableWelcomePage=yes
OutputBaseFilename=VDJC_Mixxx_Controller_Setup
Compression=lzma
SolidCompression=yes
ArchitecturesAllowed=x64compatible x86
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequired=lowest
WizardStyle=modern
SetupIconFile=VDJC_Setup.ico
LanguageDetectionMethod=locale
WizardImageFile=VDJC_WizardImage.bmp
WizardSmallImageFile=VDJC_WizardSmall.bmp

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "italian"; MessagesFile: "compiler:Languages\Italian.isl"
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"
Name: "french"; MessagesFile: "compiler:Languages\French.isl"
Name: "german"; MessagesFile: "compiler:Languages\German.isl"

[CustomMessages]
english.InfoText=This installer sets up the scripts, controller mappings, and helper utilities required to use VDJC Virtual DJ Controller with MIXXX.#13#10#13#10Important requirement:#13#10MIXXX must be installed before running this installer. The installer does not install MIXXX itself.#13#10#13#10What this installer does:#13#10- Installs VDJC mapping files into the MIXXX controllers directory#13#10- Installs the MIXXX JavaScript controller script#13#10- Installs a helper PowerShell script#13#10- Creates a Desktop shortcut to run the helper script#13#10#13#10What the PowerShell script does:#13#10- Reads effects.xml and regenerates preset/effect lists#13#10- Keeps VDJC synced with the current MIXXX configuration#13#10- Starts MIXXX after the update completes#13#10#13#10Uninstalling will remove VDJC mappings, helper files, shortcuts, and VDJC runtime data. It will not remove MIXXX or personal MIXXX settings.
italian.InfoText=Questo installer configura gli script, le mappature del controller e le utilita' necessarie per usare VDJC Virtual DJ Controller con MIXXX.#13#10#13#10Requisito importante:#13#10MIXXX deve essere installato prima di eseguire questo installer. L'installer non installa MIXXX.#13#10#13#10Cosa fa questo installer:#13#10- Installa i file di mapping VDJC nella cartella controllers di MIXXX#13#10- Installa lo script JavaScript del controller MIXXX#13#10- Installa uno script PowerShell di supporto#13#10- Crea un collegamento sul desktop per eseguire lo script#13#10#13#10Cosa fa lo script PowerShell:#13#10- Legge effects.xml e rigenera le liste preset/effetti#13#10- Mantiene VDJC sincronizzato con la configurazione MIXXX#13#10- Avvia MIXXX al termine dell'aggiornamento#13#10#13#10La disinstallazione rimuove mapping, file di supporto, collegamenti e dati runtime di VDJC. Non rimuove MIXXX o impostazioni personali.
spanish.InfoText=Este instalador configura los scripts, mapeos del controlador y utilidades necesarias para usar VDJC Virtual DJ Controller con MIXXX.#13#10#13#10Requisito importante:#13#10MIXXX debe estar instalado antes de ejecutar este instalador. El instalador no instala MIXXX.#13#10#13#10Que hace este instalador:#13#10- Instala los archivos de mapeo VDJC en la carpeta controllers de MIXXX#13#10- Instala el script JavaScript del controlador de MIXXX#13#10- Instala un script PowerShell de apoyo#13#10- Crea un acceso directo en el escritorio para ejecutar el script#13#10#13#10Que hace el script PowerShell:#13#10- Lee effects.xml y regenera listas de presets/efectos#13#10- Mantiene VDJC sincronizado con la configuracion de MIXXX#13#10- Inicia MIXXX al finalizar la actualizacion#13#10#13#10La desinstalacion elimina mappings, archivos de apoyo, accesos directos y datos runtime de VDJC. No elimina MIXXX ni configuraciones personales.
french.InfoText=Cet installateur configure les scripts, les mappages du controleur et les utilitaires necessaires pour utiliser VDJC Virtual DJ Controller avec MIXXX.#13#10#13#10Exigence importante:#13#10MIXXX doit etre installe avant d'executer cet installateur. L'installateur n'installe pas MIXXX.#13#10#13#10Ce que fait cet installateur:#13#10- Installe les fichiers de mappage VDJC dans le dossier controllers de MIXXX#13#10- Installe le script JavaScript du controleur MIXXX#13#10- Installe un script PowerShell de support#13#10- Cree un raccourci sur le bureau pour executer le script#13#10#13#10Ce que fait le script PowerShell:#13#10- Lit effects.xml et regenere les listes preset/effets#13#10- Maintient VDJC synchronise avec la configuration MIXXX#13#10- Lance MIXXX a la fin de la mise a jour#13#10#13#10La desinstallation supprime mappings, fichiers de support, raccourcis et donnees runtime VDJC. Elle ne supprime pas MIXXX ni les reglages personnels.
german.InfoText=Dieser Installer richtet die Skripte, Controller-Mappings und Hilfsprogramme ein, die fuer VDJC Virtual DJ Controller mit MIXXX erforderlich sind.#13#10#13#10Wichtige Voraussetzung:#13#10MIXXX muss vor der Installation installiert sein. Dieser Installer installiert MIXXX nicht.#13#10#13#10Was dieser Installer macht:#13#10- Installiert VDJC Mapping-Dateien in den MIXXX-controllers-Ordner#13#10- Installiert das MIXXX JavaScript-Controller-Skript#13#10- Installiert ein PowerShell-Hilfsskript#13#10- Erstellt eine Desktop-Verknuepfung zum Ausfuehren des Skripts#13#10#13#10Was das PowerShell-Skript macht:#13#10- Liest effects.xml und erzeugt Preset/Effekt-Listen neu#13#10- Haelt VDJC mit der aktuellen MIXXX-Konfiguration synchron#13#10- Startet MIXXX nach der Aktualisierung#13#10#13#10Die Deinstallation entfernt Mappings, Hilfsdateien, Verknuepfungen und VDJC-Runtime-Daten. MIXXX und persoenliche Einstellungen bleiben erhalten.

english.RequirementsTitle=Requirements
english.RequirementsSubTitle=Confirm requirements
english.RequirementsDesc=MIXXX must be installed before running this installer. Please confirm to continue.
english.RequirementsCheckbox=I confirm that MIXXX is installed.
english.ControllersTitle=Mixxx Controllers Folder
english.ControllersSubTitle=Select your Mixxx controllers folder
english.ControllersDesc=Choose the folder where Mixxx stores controller mappings. The installer will copy the VDJC mapping files here.
english.ControllersLabel=Controllers folder:
english.ScriptTitle=VDJC Script Location
english.ScriptSubTitle=Select where to install the PowerShell script
english.ScriptDesc=Choose a location for UpdatePresetsAndStartMixxx.ps1. Default is ProgramData, but you can change it.
english.ScriptLabel=Script folder:
english.ErrControllers=Please select the Mixxx controllers folder.
english.ErrRequirements=Please confirm that MIXXX is installed to continue.
english.ErrScript=Please select the script installation folder.

italian.RequirementsTitle=Requisiti
italian.RequirementsSubTitle=Conferma requisiti
italian.RequirementsDesc=MIXXX deve essere installato prima di eseguire questo installer. Conferma per continuare.
italian.RequirementsCheckbox=Confermo che MIXXX e' installato.
italian.ControllersTitle=Cartella controllers di Mixxx
italian.ControllersSubTitle=Seleziona la cartella controllers di Mixxx
italian.ControllersDesc=Scegli la cartella in cui Mixxx salva i mapping dei controller. L'installer copiera' i file VDJC qui.
italian.ControllersLabel=Cartella controllers:
italian.ScriptTitle=Posizione script VDJC
italian.ScriptSubTitle=Seleziona dove installare lo script PowerShell
italian.ScriptDesc=Scegli una posizione per UpdatePresetsAndStartMixxx.ps1. Il valore predefinito e' ProgramData, ma puoi cambiarlo.
italian.ScriptLabel=Cartella script:
italian.ErrControllers=Seleziona la cartella controllers di Mixxx.
italian.ErrRequirements=Conferma che MIXXX e' installato per continuare.
italian.ErrScript=Seleziona la cartella di installazione dello script.

spanish.RequirementsTitle=Requisitos
spanish.RequirementsSubTitle=Confirmar requisitos
spanish.RequirementsDesc=MIXXX debe estar instalado antes de ejecutar este instalador. Confirma para continuar.
spanish.RequirementsCheckbox=Confirmo que MIXXX esta instalado.
spanish.ControllersTitle=Carpeta controllers de Mixxx
spanish.ControllersSubTitle=Selecciona la carpeta controllers de Mixxx
spanish.ControllersDesc=Elige la carpeta donde Mixxx guarda los mapeos del controlador. El instalador copiara los archivos VDJC aqui.
spanish.ControllersLabel=Carpeta controllers:
spanish.ScriptTitle=Ubicacion del script VDJC
spanish.ScriptSubTitle=Selecciona donde instalar el script de PowerShell
spanish.ScriptDesc=Elige una ubicacion para UpdatePresetsAndStartMixxx.ps1. El valor predeterminado es ProgramData, pero puedes cambiarlo.
spanish.ScriptLabel=Carpeta del script:
spanish.ErrControllers=Selecciona la carpeta controllers de Mixxx.
spanish.ErrRequirements=Confirma que MIXXX esta instalado para continuar.
spanish.ErrScript=Selecciona la carpeta de instalacion del script.

french.RequirementsTitle=Exigences
french.RequirementsSubTitle=Confirmer les exigences
french.RequirementsDesc=MIXXX doit etre installe avant d'executer cet installateur. Confirmez pour continuer.
french.RequirementsCheckbox=Je confirme que MIXXX est installe.
french.ControllersTitle=Dossier controllers de Mixxx
french.ControllersSubTitle=Selectionnez le dossier controllers de Mixxx
french.ControllersDesc=Choisissez le dossier ou Mixxx stocke les mappages du controleur. L'installateur copiera les fichiers VDJC ici.
french.ControllersLabel=Dossier controllers:
french.ScriptTitle=Emplacement du script VDJC
french.ScriptSubTitle=Selectionnez ou installer le script PowerShell
french.ScriptDesc=Choisissez un emplacement pour UpdatePresetsAndStartMixxx.ps1. La valeur par defaut est ProgramData, mais vous pouvez la changer.
french.ScriptLabel=Dossier du script:
french.ErrControllers=Selectionnez le dossier controllers de Mixxx.
french.ErrRequirements=Confirmez que MIXXX est installe pour continuer.
french.ErrScript=Selectionnez le dossier d'installation du script.

german.RequirementsTitle=Voraussetzungen
german.RequirementsSubTitle=Voraussetzungen bestaetigen
german.RequirementsDesc=MIXXX muss vor der Installation installiert sein. Bitte bestaetigen Sie, um fortzufahren.
german.RequirementsCheckbox=Ich bestaetige, dass MIXXX installiert ist.
german.ControllersTitle=Mixxx Controllers-Ordner
german.ControllersSubTitle=Waehlen Sie den Mixxx Controllers-Ordner
german.ControllersDesc=Waehlen Sie den Ordner, in dem Mixxx Controller-Mappings speichert. Der Installer kopiert die VDJC-Dateien hierher.
german.ControllersLabel=Controllers-Ordner:
german.ScriptTitle=VDJC Skript-Speicherort
german.ScriptSubTitle=Waehlen Sie, wo das PowerShell-Skript installiert wird
german.ScriptDesc=Waehlen Sie einen Speicherort fuer UpdatePresetsAndStartMixxx.ps1. Standard ist ProgramData, kann aber geaendert werden.
german.ScriptLabel=Skript-Ordner:
german.ErrControllers=Bitte den Mixxx Controllers-Ordner auswaehlen.
german.ErrRequirements=Bitte bestaetigen, dass MIXXX installiert ist, um fortzufahren.
german.ErrScript=Bitte den Ordner fuer die Skriptinstallation auswaehlen.

[Files]
Source: "..\mixxx_midi_mapping\VDJC_1.0.0-script.js"; DestDir: "{code:GetControllersDir}"; Flags: ignoreversion
Source: "..\mixxx_midi_mapping\VDJC_1.0.0.midi.xml"; DestDir: "{code:GetControllersDir}"; Flags: ignoreversion
Source: "..\mixxx_midi_mapping\InitShutFunctions.js"; DestDir: "{code:GetControllersDir}"; Flags: ignoreversion
Source: "..\mixxx_midi_mapping\midi-components-0.2.js"; DestDir: "{code:GetControllersDir}"; Flags: ignoreversion
Source: "..\mixxx_midi_mapping\UpdatePresetsAndStartMixxx.ps1"; DestDir: "{code:GetScriptDir}"; Flags: ignoreversion

[UninstallDelete]
Type: filesandordirs; Name: "{localappdata}\VDJC\logs"
Type: files; Name: "{code:GetControllersDir}\VDJC_1.0.0-script.js"
Type: files; Name: "{code:GetControllersDir}\VDJC_1.0.0.midi.xml"
Type: files; Name: "{code:GetControllersDir}\InitShutFunctions.js"
Type: files; Name: "{code:GetControllersDir}\midi-components-0.2.js"
Type: files; Name: "{code:GetScriptDir}\UpdatePresetsAndStartMixxx.ps1"

[Icons]
Name: "{userdesktop}\VDJC - Update Presets and Start Mixxx"; Filename: "{sys}\WindowsPowerShell\v1.0\powershell.exe"; Parameters: "-ExecutionPolicy Bypass -WindowStyle Hidden -File ""{code:GetScriptDir}\UpdatePresetsAndStartMixxx.ps1"" -ControllersDir ""{code:GetControllersDir}"""; WorkingDir: "{code:GetControllersDir}"

[Code]
var
  ControllersDirPage: TInputDirWizardPage;
  ScriptDirPage: TInputDirWizardPage;
  InfoPage: TOutputMsgWizardPage;
  RequirementsPage: TInputOptionWizardPage;

function DefaultControllersDir(): string;
begin
  Result := ExpandConstant('{localappdata}\Mixxx\controllers');
  if DirExists(Result) then
    exit;

  Result := ExpandConstant('{appdata}\Mixxx\controllers');
end;

function DefaultScriptDir(): string;
begin
  Result := ExpandConstant('{commonappdata}\VDJC');
end;

function NormalizeInfoText(const Text: string): string;
begin
  Result := Text;
  StringChangeEx(Result, '#13#10', #13#10, True);
end;

procedure InitializeWizard();
begin
  InfoPage := CreateOutputMsgPage(
    wpSelectDir,
    SetupMessage(msgInformationTitle),
    '',
    NormalizeInfoText(CustomMessage('InfoText'))
  );

  RequirementsPage := CreateInputOptionPage(
    InfoPage.ID,
    CustomMessage('RequirementsTitle'),
    CustomMessage('RequirementsSubTitle'),
    CustomMessage('RequirementsDesc'),
    False,
    False
  );
  RequirementsPage.Add(CustomMessage('RequirementsCheckbox'));
  RequirementsPage.Values[0] := False;

  ControllersDirPage := CreateInputDirPage(
    RequirementsPage.ID,
    CustomMessage('ControllersTitle'),
    CustomMessage('ControllersSubTitle'),
    CustomMessage('ControllersDesc'),
    False, ''
  );
  ControllersDirPage.Add(CustomMessage('ControllersLabel'));
  ControllersDirPage.Values[0] := DefaultControllersDir();

  ScriptDirPage := CreateInputDirPage(
    ControllersDirPage.ID,
    CustomMessage('ScriptTitle'),
    CustomMessage('ScriptSubTitle'),
    CustomMessage('ScriptDesc'),
    False, ''
  );
  ScriptDirPage.Add(CustomMessage('ScriptLabel'));
  ScriptDirPage.Values[0] := DefaultScriptDir();
end;

function GetControllersDir(Param: string): string;
begin
  Result := ControllersDirPage.Values[0];
end;

function GetScriptDir(Param: string): string;
begin
  Result := ScriptDirPage.Values[0];
end;


function NextButtonClick(CurPageID: Integer): Boolean;
var
  DirValue: string;
begin
  Result := True;

  if CurPageID = ControllersDirPage.ID then
  begin
    DirValue := ControllersDirPage.Values[0];
    if DirValue = '' then
    begin
      MsgBox(CustomMessage('ErrControllers'), mbError, MB_OK);
      Result := False;
      exit;
    end;
  end;

  if CurPageID = RequirementsPage.ID then
  begin
    if not RequirementsPage.Values[0] then
    begin
      MsgBox(CustomMessage('ErrRequirements'), mbError, MB_OK);
      Result := False;
      exit;
    end;
  end;

  if CurPageID = ScriptDirPage.ID then
  begin
    DirValue := ScriptDirPage.Values[0];
    if DirValue = '' then
    begin
      MsgBox(CustomMessage('ErrScript'), mbError, MB_OK);
      Result := False;
      exit;
    end;
  end;
end;
