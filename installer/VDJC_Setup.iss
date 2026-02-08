; VDJC Mixxx Controller Installer (Inno Setup)
; Build with Inno Setup 6+

[Setup]
AppName=VDJC Mixxx Controller
AppVersion=1.0.0
AppPublisher=Virtual DJ Console (VDJC)
AppPublisherURL=https://github.com/Deja1987/VDJC
AppVerName=VDJC Mixxx Controller 1.0.0
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

[Files]
Source: "..\mixxx_midi_mapping\VDJC_1.0.0-script.js"; DestDir: "{code:GetControllersDir}"; Flags: ignoreversion
Source: "..\mixxx_midi_mapping\VDJC_1.0.0.midi.xml"; DestDir: "{code:GetControllersDir}"; Flags: ignoreversion
Source: "..\mixxx_midi_mapping\InitShutFunctions.js"; DestDir: "{code:GetControllersDir}"; Flags: ignoreversion
Source: "..\mixxx_midi_mapping\midi-components-0.2.js"; DestDir: "{code:GetControllersDir}"; Flags: ignoreversion
Source: "..\mixxx_midi_mapping\UpdatePresetsAndStartMixxx.ps1"; DestDir: "{code:GetScriptDir}"; Flags: ignoreversion

[UninstallDelete]
Type: filesandordirs; Name: "{localappdata}\VDJC\logs"

[Icons]
Name: "{userdesktop}\VDJC - Update Presets and Start Mixxx"; Filename: "{sys}\WindowsPowerShell\v1.0\powershell.exe"; Parameters: "-ExecutionPolicy Bypass -WindowStyle Hidden -File ""{code:GetScriptDir}\UpdatePresetsAndStartMixxx.ps1"" -ControllersDir ""{code:GetControllersDir}"""; WorkingDir: "{code:GetControllersDir}"

[Code]
var
  ControllersDirPage: TInputDirWizardPage;
  ScriptDirPage: TInputDirWizardPage;
  InfoPage: TOutputMsgWizardPage;

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

procedure InitializeWizard();
begin
  InfoPage := CreateOutputMsgPage(
    wpSelectDir,
    SetupMessage(msgInformationTitle),
    '',
    CustomMessage('InfoText')
  );

  ControllersDirPage := CreateInputDirPage(
    InfoPage.ID,
    'Mixxx Controllers Folder',
    'Select your Mixxx controllers folder',
    'Choose the folder where Mixxx stores controller mappings. ' +
    'The installer will copy the VDJC mapping files here.',
    False, ''
  );
  ControllersDirPage.Add('Controllers folder:');
  ControllersDirPage.Values[0] := DefaultControllersDir();

  ScriptDirPage := CreateInputDirPage(
    ControllersDirPage.ID,
    'VDJC Script Location',
    'Select where to install the PowerShell script',
    'Choose a location for UpdatePresetsAndStartMixxx.ps1. ' +
    'Default is ProgramData, but you can change it.',
    False, ''
  );
  ScriptDirPage.Add('Script folder:');
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
      MsgBox('Please select the Mixxx controllers folder.', mbError, MB_OK);
      Result := False;
      exit;
    end;
  end;

  if CurPageID = ScriptDirPage.ID then
  begin
    DirValue := ScriptDirPage.Values[0];
    if DirValue = '' then
    begin
      MsgBox('Please select the script installation folder.', mbError, MB_OK);
      Result := False;
      exit;
    end;
  end;
end;
