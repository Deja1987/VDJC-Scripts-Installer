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
UninstallDisplayIcon={app}\VDJC_Setup.ico
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
Name: "arabic"; MessagesFile: "compiler:Languages\Arabic.isl"
Name: "armenian"; MessagesFile: "compiler:Languages\Armenian.isl"
Name: "brazilianportuguese"; MessagesFile: "compiler:Languages\BrazilianPortuguese.isl"
Name: "bulgarian"; MessagesFile: "compiler:Languages\Bulgarian.isl"
Name: "catalan"; MessagesFile: "compiler:Languages\Catalan.isl"
Name: "corsican"; MessagesFile: "compiler:Languages\Corsican.isl"
Name: "czech"; MessagesFile: "compiler:Languages\Czech.isl"
Name: "danish"; MessagesFile: "compiler:Languages\Danish.isl"
Name: "dutch"; MessagesFile: "compiler:Languages\Dutch.isl"
Name: "finnish"; MessagesFile: "compiler:Languages\Finnish.isl"
Name: "italian"; MessagesFile: "compiler:Languages\Italian.isl"
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"
Name: "french"; MessagesFile: "compiler:Languages\French.isl"
Name: "german"; MessagesFile: "compiler:Languages\German.isl"
Name: "hebrew"; MessagesFile: "compiler:Languages\Hebrew.isl"
Name: "hungarian"; MessagesFile: "compiler:Languages\Hungarian.isl"
Name: "japanese"; MessagesFile: "compiler:Languages\Japanese.isl"
Name: "korean"; MessagesFile: "compiler:Languages\Korean.isl"
Name: "norwegian"; MessagesFile: "compiler:Languages\Norwegian.isl"
Name: "polish"; MessagesFile: "compiler:Languages\Polish.isl"
Name: "portuguese"; MessagesFile: "compiler:Languages\Portuguese.isl"
Name: "russian"; MessagesFile: "compiler:Languages\Russian.isl"
Name: "slovak"; MessagesFile: "compiler:Languages\Slovak.isl"
Name: "slovenian"; MessagesFile: "compiler:Languages\Slovenian.isl"
Name: "swedish"; MessagesFile: "compiler:Languages\Swedish.isl"
Name: "tamil"; MessagesFile: "compiler:Languages\Tamil.isl"
Name: "turkish"; MessagesFile: "compiler:Languages\Turkish.isl"
Name: "ukrainian"; MessagesFile: "compiler:Languages\Ukrainian.isl"

#include "i18n\VDJC_CustomMessages.isl"

[Files]
Source: "VDJC_Setup.ico"; DestDir: "{app}"; Flags: ignoreversion
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

