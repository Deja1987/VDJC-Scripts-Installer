# UpdatePresetsAndStartMixxx.ps1
# Script per aggiornare automaticamente i preset degli effetti e avviare Mixxx

param(
    [switch]$HiddenRun,
    [switch]$Interactive,
    [string]$ControllersDir,
    [string]$MixxxExePath,
    [string]$LogPath
)

# Rilancia lo script in finestra nascosta (evita console visibile)
if (-not $HiddenRun) {
    $psExe = (Get-Command powershell.exe).Source
    $args = @(
        "-ExecutionPolicy", "Bypass",
        "-File", "$PSCommandPath",
        "-HiddenRun"
    )
    if ($ControllersDir) {
        $args += @("-ControllersDir", "$ControllersDir")
    }
    if ($MixxxExePath) {
        $args += @("-MixxxExePath", "$MixxxExePath")
    }
    if ($LogPath) {
        $args += @("-LogPath", "$LogPath")
    }
    if ($Interactive) {
        $args += "-Interactive"
    }
    Start-Process -FilePath $psExe -ArgumentList $args -WindowStyle Hidden
    exit 0
}

$isInteractive = $Interactive.IsPresent

if (-not $LogPath) {
    $logDir = Join-Path $env:LOCALAPPDATA "VDJC\logs"
    if (-not (Test-Path $logDir)) {
        New-Item -Path $logDir -ItemType Directory -Force | Out-Null
    }
    $LogPath = Join-Path $logDir "UpdatePresetsAndStartMixxx.log"
}

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $LogPath -Value "$timestamp $Message"
}

$ErrorActionPreference = "Stop"

function Resolve-MixxxConfigDir {
    $localConfig = Join-Path $env:LOCALAPPDATA "Mixxx"
    if (Test-Path $localConfig) {
        return $localConfig
    }

    $roamingConfig = Join-Path $env:APPDATA "Mixxx"
    if (Test-Path $roamingConfig) {
        return $roamingConfig
    }

    return $localConfig
}

function Resolve-ControllersDir {
    if ($ControllersDir -and (Test-Path $ControllersDir)) {
        return $ControllersDir
    }

    $candidates = @(
        Join-Path $env:LOCALAPPDATA "Mixxx\controllers",
        Join-Path $env:APPDATA "Mixxx\controllers"
    )

    foreach ($candidate in $candidates) {
        if (Test-Path $candidate) {
            return $candidate
        }
    }

    return $candidates[0]
}

function Resolve-MixxxExePath {
    if ($MixxxExePath -and (Test-Path $MixxxExePath)) {
        return $MixxxExePath
    }

    $candidates = @(
        "C:\Program Files\Mixxx\mixxx.exe",
        "C:\Program Files (x86)\Mixxx\mixxx.exe"
    )

    foreach ($candidate in $candidates) {
        if (Test-Path $candidate) {
            return $candidate
        }
    }

    return "mixxx.exe"
}

$scriptVersion = "1.1.0"
Write-Log "--- Start UpdatePresetsAndStartMixxx v$scriptVersion ---"

# Configurazione percorsi
$mixxxConfigDir = Resolve-MixxxConfigDir
$effectsXmlPath = Join-Path $mixxxConfigDir "effects.xml"
$resolvedControllersDir = Resolve-ControllersDir
$scriptJsPath = Join-Path $resolvedControllersDir "VDJC_1.0.0-script.js"
$resolvedMixxxExePath = Resolve-MixxxExePath
Write-Log "ConfigDir=$mixxxConfigDir"
Write-Log "EffectsXml=$effectsXmlPath"
Write-Log "ControllersDir=$resolvedControllersDir"
Write-Log "ScriptJs=$scriptJsPath"
Write-Log "MixxxExe=$resolvedMixxxExePath"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Aggiornamento Preset Effetti Mixxx" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# STEP 1: Verifica file
Write-Host "[1/4] Verifica file..." -ForegroundColor Yellow

if (-not (Test-Path $effectsXmlPath)) {
    Write-Host "ERRORE: File effects.xml non trovato" -ForegroundColor Red
    Write-Log "ERROR: effects.xml not found"
    if ($isInteractive) {
        Read-Host "Premi INVIO per uscire"
    }
    exit 1
}

if (-not (Test-Path $scriptJsPath)) {
    Write-Host "ERRORE: File script.js non trovato" -ForegroundColor Red
    Write-Log "ERROR: VDJC_1.0.0-script.js not found"
    if ($isInteractive) {
        Read-Host "Premi INVIO per uscire"
    }
    exit 1
}

Write-Host "  OK - File trovati" -ForegroundColor Green
Write-Host ""

# STEP 2: Lettura effects.xml
Write-Host "[2/4] Lettura effects.xml..." -ForegroundColor Yellow

$effectsXml = [xml](Get-Content $effectsXmlPath -Encoding UTF8)

$chainPresetNames = @()
$chainNodes = $effectsXml.SelectNodes("//ChainPresetList/ChainPresetName")
foreach ($node in $chainNodes) {
    $chainPresetNames += $node.InnerText
}

$quickEffectPresetNames = @()
$quickNodes = $effectsXml.SelectNodes("//QuickEffectPresetList/ChainPresetName")
foreach ($node in $quickNodes) {
    $quickEffectPresetNames += $node.InnerText
}

# Estrai VisibleEffects
$visibleEffectIds = @()
$visibleNodes = $effectsXml.SelectNodes("//VisibleEffects/Effect/Id")
foreach ($node in $visibleNodes) {
    # Estrae solo il nome dell'effetto da "org.mixxx.effects.glitch" -> "glitch"
    $fullId = $node.InnerText
    if ($fullId -match '\.([^.]+)$') {
        $visibleEffectIds += $matches[1]
    }
}

Write-Host "  OK - Trovati $($chainPresetNames.Count) Chain Presets" -ForegroundColor Green
Write-Host "  OK - Trovati $($quickEffectPresetNames.Count) Quick Effect Presets" -ForegroundColor Green
Write-Host "  OK - Trovati $($visibleEffectIds.Count) Visible Effects" -ForegroundColor Green
Write-Host ""

# STEP 3: Aggiornamento script.js
Write-Host "[3/4] Aggiornamento script.js..." -ForegroundColor Yellow

$scriptContent = Get-Content $scriptJsPath -Raw -Encoding UTF8

# Crea ChainPresetList
# IMPORTANTE: l'indice 0 in Mixxx e sempre il preset vuoto/passthrough
# I preset reali iniziano dall'indice 1
$chainLines = @("const ChainPresetList = {")
$chainLines += "    0: { effectString: 'Empty'},"
for ($i = 0; $i -lt $chainPresetNames.Count; $i++) {
    $name = $chainPresetNames[$i] -replace "'", "\'"
    $jsIndex = $i + 1  # Offset di +1 perche l'indice 0 e 'Empty'
    $line = "    $jsIndex" + ": { effectString: '$name'}"
    if ($i -lt $chainPresetNames.Count - 1) {
        $line += ","
    }
    $chainLines += $line
}
$chainLines += "};"
$chainPresetListContent = $chainLines -join "`r`n"

# Crea QuickEffectPresetList
# IMPORTANTE: l'indice 0 e sempre il preset vuoto/passthrough
$quickLines = @("const QuickEffectPresetList = {")
$quickLines += "    0: { effectString: 'Empty'},"
for ($i = 0; $i -lt $quickEffectPresetNames.Count; $i++) {
    $name = $quickEffectPresetNames[$i] -replace "'", "\'"
    $jsIndex = $i + 1  # Offset di +1 perche l'indice 0 e 'Empty'
    $line = "    $jsIndex" + ": { effectString: '$name'}"
    if ($i -lt $quickEffectPresetNames.Count - 1) {
        $line += ","
    }
    $quickLines += $line
}
$quickLines += "};"
$quickEffectPresetListContent = $quickLines -join "`r`n"

# Crea VisibleEffectsList
# Lista di tutti gli effetti disponibili per i selettori Effect1, Effect2, Effect3
$effectLines = @("const VisibleEffectsList = {")
for ($i = 0; $i -lt $visibleEffectIds.Count; $i++) {
    $name = $visibleEffectIds[$i]
    $line = "    $i" + ": { effectString: '$name'}"
    if ($i -lt $visibleEffectIds.Count - 1) {
        $line += ","
    }
    $effectLines += $line
}
$effectLines += "};"
$visibleEffectsListContent = $effectLines -join "`r`n"

# Sostituisci nel file (regex che include tutto fino alla riga dopo)
Write-Host "  DEBUG: ChainPresetList generato:" -ForegroundColor Cyan
Write-Host $chainPresetListContent.Substring(0, [Math]::Min(200, $chainPresetListContent.Length)) -ForegroundColor Gray
Write-Host ""

# Regex piu robusto che matcha il blocco completo inclusi commenti e newline dopo
$scriptContent = $scriptContent -replace '(?ms)const ChainPresetList = \{.*?\};[^\n]*\n', ($chainPresetListContent + [Environment]::NewLine)
$scriptContent = $scriptContent -replace '(?ms)const QuickEffectPresetList = \{.*?\};[^\n]*\n', ($quickEffectPresetListContent + [Environment]::NewLine)
$scriptContent = $scriptContent -replace '(?ms)const VisibleEffectsList = \{.*?\};[^\n]*\n', ($visibleEffectsListContent + [Environment]::NewLine)

# Salva il file
try {
    [System.IO.File]::WriteAllText($scriptJsPath, $scriptContent, [System.Text.Encoding]::UTF8)
    Write-Host "  OK - File aggiornato" -ForegroundColor Green
    Write-Log "Script JS updated"
} catch {
    Write-Host "  ERRORE - Impossibile scrivere il file!" -ForegroundColor Red
    Write-Host "  Il file potrebbe essere aperto in un altro programma (VS Code?)" -ForegroundColor Yellow
    Write-Host "  Errore: $($_.Exception.Message)" -ForegroundColor Red
    Write-Log "ERROR: Failed to write script JS - $($_.Exception.Message)"
    if ($isInteractive) {
        Read-Host "Premi INVIO per continuare comunque"
    }
}
Write-Host ""

# STEP 4: Avvio Mixxx
Write-Host "[4/4] Avvio Mixxx..." -ForegroundColor Yellow

if (Test-Path $resolvedMixxxExePath) {
    Start-Process $resolvedMixxxExePath
    Write-Host "  OK - Mixxx avviato" -ForegroundColor Green
    Write-Log "Mixxx launched: $resolvedMixxxExePath"
} else {
    try {
        Start-Process $resolvedMixxxExePath
        Write-Host "  OK - Mixxx avviato" -ForegroundColor Green
        Write-Log "Mixxx launched via PATH: $resolvedMixxxExePath"
    } catch {
        Write-Host "ATTENZIONE: Mixxx non trovato in: $resolvedMixxxExePath" -ForegroundColor Yellow
        Write-Log "ERROR: Mixxx not found at $resolvedMixxxExePath"
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Operazione completata!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

if ($isInteractive) {
    Read-Host "Premi INVIO per chiudere"
}

Write-Log "--- End UpdatePresetsAndStartMixxx ---"
