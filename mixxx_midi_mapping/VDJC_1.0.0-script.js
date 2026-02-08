/**
 * VDJC_1.0.0-script.js
 * Script associato al controller VDJC MIDI Controller
 * per Mixxx 2.4.0 e successive.
 * 
 * Per aggiornare automaticamente le liste degli effetti usati nella UI di MIXXX,
 * create uno script Python per estrarre i dati dal file effects.xml dalla cartella di 
 * installazione di Mixxx e sovrascrivere le liste nello script.
 * Eseguite lo script ogni volta che aggiornate Mixxx per mantenere le liste aggiornate.
 * 
 * Oppure usate questo già pronto: (Todo: link allo script PowerShell su GitHub)
 * Questo metodo crea un'icona desktop tipo collegamento desktop che esegue automaticamente lo script estraendo i dati, 
 * sovrascrive le liste qui sotto con i dati aggiornati e avvia Mixxx.
 * 
 * Autori: Deja1987 & Claude
 */
var VDJC = {};

//***** ChainPresetList - Lista degli effetti disponibili per [EffectRack1_EffectUnitN] da cui estrarre la stringa per inviare il Sysex *****//
// l'integro associato alla stringa correisponde all' indice del preset,
// leggibile tramite il metodo engine getValue/engine.makeConnection([EffectRack1_EffectUnitN], loaded_chain_preset)
/** [EffectRack1_EffectUnitN], loaded_chain_preset:
 * 0-based index of the currently loaded EffectChain preset. 0 is the empty/passthrough preset, -1 indicates an unsaved preset (default state of [EffectRack1_EffectUnitN]).
 * Range: integer, -1 .. [num_chain_presets - 1]
 */
const ChainPresetList = {
    0: { effectString: 'Empty'},
    1: { effectString: 'MetroPanEcho'},
    2: { effectString: 'Loudness'},
    3: { effectString: 'test Area 51'},
    4: { effectString: 'Autopan Echo Riverb'},
    5: { effectString: 'Piantolo'},
    6: { effectString: 'Echo - Autopan'},
    7: { effectString: 'Autopan - Tremolo - Volume'},
    8: { effectString: 'Echoverb HP'},
    9: { effectString: 'Filter Echo'},
    10: { effectString: 'Mid/Side'},
    11: { effectString: 'Side Reverb HP'},
    12: { effectString: 'Smooth Growl'},
    13: { effectString: 'Rumore Bianco'},
    14: { effectString: 'Sposta Pitch'},
    15: { effectString: 'Autopan'},
    16: { effectString: 'Bilanciamento'},
    17: { effectString: 'Flanger'},
    18: { effectString: 'EQ-Echo-Tremolo'}
};


//***** QuickEffectPresetList - Lista degli effetti rapidi disponibili per [QuickEffectRack1_[ChannelI]] da cui estrarre la stringa per inviare il Sysex  *****// 
// l'integro associato alla stringa correisponde all' indice del preset,
// leggibile tramite il metodo engine getValue/engine.makeConnection([QuickEffectRack1_[ChannelI]], loaded_chain_preset)
/** [QuickEffectRack1_[ChannelI]], loaded_chain_preset:
 * 0-based index of the currently loaded EffectChain preset. 0 is the empty/passthrough preset, -1 indicates an unsaved preset (default state of [EffectRack1_EffectUnitN]).
 * Range: integer, -1 .. [num_chain_presets - 1]
 */
const QuickEffectPresetList = {
    0: { effectString: 'Empty'},
    1: { effectString: 'Loudness'},
    2: { effectString: 'Autopan Echo Riverb'},
    3: { effectString: 'Piantolo'},
    4: { effectString: 'Echo - Autopan'},
    5: { effectString: 'Autopan - Tremolo - Volume'},
    6: { effectString: 'Echoverb HP'},
    7: { effectString: 'Filter Echo'},
    8: { effectString: 'Mid/Side'},
    9: { effectString: 'Side Reverb HP'},
    10: { effectString: 'Smooth Growl'},
    11: { effectString: 'Autopan'},
    12: { effectString: 'Bilanciamento'},
    13: { effectString: 'Bitcrusher'},
    14: { effectString: 'Distorsione'},
    15: { effectString: 'Echo'},
    16: { effectString: 'Filtro'},
    17: { effectString: 'Filtro Moog'},
    18: { effectString: 'Flanger'},
    19: { effectString: 'Phaser'},
    20: { effectString: 'Riverbero'},
    21: { effectString: 'Rumore Bianco'},
    22: { effectString: 'Sposta Pitch'},
    23: { effectString: 'Tremolo'},
    24: { effectString: 'Volume'},
    25: { effectString: 'EQ-Echo-Tremolo'}
};

//***** VisibleEffectsList - Lista degli effetti disponibili per Effect1, Effect2, Effect3 *****//
// L'indice corrisponde alla posizione nell'elenco degli effetti visibili
// Estratto automaticamente da effects.xml > VisibleEffects
const VisibleEffectsList = {
    0: { effectString: 'autopan'},
    1: { effectString: 'bessel4lvmixeq'},
    2: { effectString: 'bessel8lvmixeq'},
    3: { effectString: 'balance'},
    4: { effectString: 'bitcrusher'},
    5: { effectString: 'threebandbiquadeq'},
    6: { effectString: 'biquadfullkilleq'},
    7: { effectString: 'compressor'},
    8: { effectString: 'distortion'},
    9: { effectString: 'echo'},
    10: { effectString: 'graphiceq'},
    11: { effectString: 'filter'},
    12: { effectString: 'moogladder4filter'},
    13: { effectString: 'flanger'},
    14: { effectString: 'glitch'},
    15: { effectString: 'linkwitzrileyeq'},
    16: { effectString: 'metronome'},
    17: { effectString: 'parametriceq'},
    18: { effectString: 'phaser'},
    19: { effectString: 'reverb'},
    20: { effectString: 'whitenoise'},
    21: { effectString: 'pitchshift'},
    22: { effectString: 'tremolo'},
    23: { effectString: 'loudnesscontour'}
};

///////////////////////////////////////////////////////////////
//                       USER OPTIONS                        //
///////////////////////////////////////////////////////////////

VDJC.debugging = true; 
// Abilita il debug se impostato a true

VDJC.reverseRollOnShiftCue = true; // true = Enables reverse and slip mode while held, false = jump to start and stop playback
// If true, pressing shift + cue will play the track in reverse and enable slip mode,
// which can be used like a censor effect. If false, pressing shift + cue jumps to
// the beginning of the track and stops playback.


components.Component.prototype.midiLoopProtectionEnabled = true; // Set to true to enable MIDI loop protection
//Add the boolean variable to avoid MIDI loops when using MIDI feedback if necessary.
/* End of USER OPTIONS */

const NO_TIMER = components.NO_TIMER;

///////////////////////////////////////////////////////////////
//          Sampler Effect Assignment Feedback System        //
///////////////////////////////////////////////////////////////

/**
 * Sistema di feedback per assegnazione Effect Unit ai Sampler 1-64
 * Usa Note On 0x99 0x0C, data2 mapping:
 * - Sampler N off: data2 = (N-1)*2 (valori pari: 0x00, 0x02, 0x04...)
 * - Sampler N on:  data2 = (N-1)*2+1 (valori dispari: 0x01, 0x03, 0x05...)
 * 
 * Esempio:
 * - Sampler 1 off: Note On 0x99 0x0C 0x00
 * - Sampler 1 on:  Note On 0x99 0x0C 0x01
 * - Sampler 2 off: Note On 0x99 0x0C 0x02
 * - Sampler 2 on:  Note On 0x99 0x0C 0x03
 * ...
 * - Sampler 64 off: Note On 0x99 0x0C 0x7E (126)
 * - Sampler 64 on:  Note On 0x99 0x0C 0x7F (127)
 */

///////////////////////////////////////////////////////////////
//                    VDJC SysEx Protocol                    //
///////////////////////////////////////////////////////////////

/**
 * Modulo per encoding messaggi SysEx VDJC Protocol v1.0
 * Header: F0 7D 56 44 4A 43 00 (VDJC manufacturer ID)
 */
VDJC.SysEx = {
    // Header VDJC: F0 7D 56 44 4A 43 00
    HEADER: [0xF0, 0x7D, 0x56, 0x44, 0x4A, 0x43, 0x00],
    
    // Target devices
    TARGET_BROADCAST: 0x7F,
    TARGET_DECK_A: 0x40,
    TARGET_DECK_B: 0x41,
    
    // Commands
    CMD_SET_TEXT: 0x00,
    CMD_METADATA: 0x01,
    CMD_END_MARKER: 0x02,
    CMD_SET_COLOR: 0x08,
    CMD_SHUTDOWN: 0x7F,      // System: Notifica shutdown Mixxx → Android
    
    // Effect Table IDs
    TABLE_CHAIN_PRESET: 0x01,
    TABLE_QUICK_EFFECT: 0x02,
    TABLE_VISIBLE_EFFECTS: 0x03,
    
    /**
     * Invia alias per un effect table entry
     * @param {number} tableId - ID tabella (0x01=ChainPreset, 0x02=QuickEffect, 0x03=VisibleEffects)
     * @param {number} index - Indice 0-based nella tabella
     * @param {string} name - Nome dell'effetto
     */
    sendEffectAlias: function(tableId, index, name) {
        const nameChunks = components.stringToSysExChunks(name);
        const nameBytes = [].concat(...nameChunks); // Flatten array of arrays
        
        const message = [].concat(
            this.HEADER,
            [this.CMD_SET_TEXT],     // Command: SET_TEXT (0x00)
            [tableId],               // Table ID
            [index],                 // Index in table
            nameBytes,               // Effect name (Unicode-aware)
            [0x00],                  // Null terminator
            [0xF7]                   // End SysEx
        );
        
        midi.sendSysexMsg(message, message.length);
        
        if (VDJC.debugging) {
            console.log(`[VDJC SysEx] Sent alias: table=${tableId} index=${index} name="${name}"`);
        }
    },
    
    // ========================================
    // PROTOCOL v1.2: METADATA + Sequence + CRC-16
    // ========================================
    
    /**
     * Calcola CRC-16 CCITT per validazione alias table
     * @param {Array} entries - Array di oggetti {index, name}
     * @returns {number} CRC-16 (0x0000-0xFFFF)
     */
    computeCrc16: function(entries) {
        let crc = 0xFFFF;
        
        // Sort entries by index per matching con Kotlin validator
        const sortedEntries = entries.slice().sort((a, b) => a.index - b.index);
        
        // Update CRC per ogni entry (index + name UTF-8 bytes)
        for (const entry of sortedEntries) {
            // CRC update per index byte
            crc = this.updateCrc16(crc, entry.index & 0xFF);
            
            // CRC update per name UTF-8 bytes
            const nameChunks = components.stringToSysExChunks(entry.name);
            const nameBytes = [].concat(...nameChunks);
            for (const byte of nameBytes) {
                crc = this.updateCrc16(crc, byte);
            }
        }
        
        return crc & 0xFFFF;
    },
    
    /**
     * Aggiorna CRC-16 con un singolo byte (polynomial 0x1021)
     * @param {number} crc - CRC corrente
     * @param {number} byte - Byte da processare
     * @returns {number} CRC aggiornato
     */
    updateCrc16: function(crc, byte) {
        crc ^= (byte << 8);
        for (let i = 0; i < 8; i++) {
            if (crc & 0x8000) {
                crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
            } else {
                crc = (crc << 1) & 0xFFFF;
            }
        }
        return crc;
    },
    
    /**
     * Invia METADATA packet (count + CRC-16)
     * Format: F0 7D 56 44 4A 43 00 01 [TABLE_ID] [COUNT_HI] [COUNT_LO] [CRC_HI] [CRC_LO] F7
     * @param {number} tableId - ID tabella
     * @param {number} count - Numero totale di entries
     * @param {number} crc16 - CRC-16 checksum
     */
    sendMetadata: function(tableId, count, crc16) {
        // Encode 14-bit values (count e CRC) in 7-bit SysEx bytes
        const countHi = (count >> 7) & 0x7F;
        const countLo = count & 0x7F;
        const crcHi = (crc16 >> 7) & 0x7F;
        const crcLo = crc16 & 0x7F;
        
        const message = [].concat(
            this.HEADER,
            [0x01],                  // Command: METADATA
            [tableId],               // Table ID
            [countHi, countLo],      // Count (14-bit)
            [crcHi, crcLo],          // CRC-16 (14-bit)
            [0xF7]                   // End SysEx
        );
        
        midi.sendSysexMsg(message, message.length);
        
        if (VDJC.debugging) {
            console.log(`[VDJC SysEx v1.2] Sent METADATA: table=${tableId} count=${count} crc16=0x${crc16.toString(16).toUpperCase()}`);
        }
    },
    
    /**
     * Invia alias entry con sequence number (v1.2 protocol)
     * Format: F0 7D 56 44 4A 43 00 00 [TABLE_ID] [SEQ] [INDEX] [NAME...] 00 F7
     * @param {number} tableId - ID tabella
     * @param {number} sequence - Numero di sequenza (0-based)
     * @param {number} index - Indice nella tabella
     * @param {string} name - Nome dell'effetto
     */
    sendAliasWithSequence: function(tableId, sequence, index, name) {
        const nameChunks = components.stringToSysExChunks(name);
        const nameBytes = [].concat(...nameChunks);

        const safeTableId = (Number(tableId) & 0x7F) || 0x00;
        const safeSeq = (Number.isFinite(sequence) ? sequence : 0) & 0x7F;
        const safeIndex = (Number.isFinite(index) ? index : safeSeq) & 0x7F;
        
        const message = [].concat(
            this.HEADER,
            [this.CMD_SET_TEXT],     // Command: SET_TEXT (0x00)
            [safeTableId],           // Table ID
            [safeSeq],               // Sequence number (NEW in v1.2)
            [safeIndex],             // Index in table
            nameBytes,               // Effect name
            [0x00],                  // Null terminator
            [0xF7]                   // End SysEx
        );
        
        midi.sendSysexMsg(message, message.length);
        
        if (VDJC.debugging) {
            console.log(`[VDJC SysEx v1.2] Sent alias: table=${tableId} seq=${sequence} index=${index} name="${name}"`);
        }
    },
    
    /**
     * Invia END_MARKER packet (optional - per logging)
     * Format: F0 7D 56 44 4A 43 00 02 [TABLE_ID] [COUNT_HI] [COUNT_LO] [CRC_HI] [CRC_LO] F7
     * @param {number} tableId - ID tabella
     * @param {number} count - Numero totale di entries
     * @param {number} crc16 - CRC-16 checksum
     */
    sendEndMarker: function(tableId, count, crc16) {
        const countHi = (count >> 7) & 0x7F;
        const countLo = count & 0x7F;
        const crcHi = (crc16 >> 7) & 0x7F;
        const crcLo = crc16 & 0x7F;
        
        const message = [].concat(
            this.HEADER,
            [0x02],                  // Command: END_MARKER
            [tableId],               // Table ID
            [countHi, countLo],      // Count (14-bit)
            [crcHi, crcLo],          // CRC-16 (14-bit)
            [0xF7]                   // End SysEx
        );
        
        midi.sendSysexMsg(message, message.length);
        
        if (VDJC.debugging) {
            console.log(`[VDJC SysEx v1.2] Sent END_MARKER: table=${tableId} count=${count} crc16=0x${crc16.toString(16).toUpperCase()}`);
        }
    },
    
    /**
     * Invia alias table con v1.2 validation (METADATA + Sequence + CRC-16)
     * @param {number} tableId - ID tabella
     * @param {Array} entries - Array di oggetti {index, name}
     */
    sendAliasTableWithValidation: function(tableId, entries) {
        // 1. Compute CRC-16 checksum
        const sortedEntries = entries.slice().sort((a, b) => a.index - b.index);
        const crc16 = this.computeCrc16(sortedEntries);
        
        // 2. Send METADATA packet
        this.sendMetadata(tableId, sortedEntries.length, crc16);
        
        // 3. Send entries with sequence numbers
        for (let seq = 0; seq < sortedEntries.length; seq++) {
            this.sendAliasWithSequence(tableId, seq, sortedEntries[seq].index, sortedEntries[seq].name);
        }
        
        // 4. Send END_MARKER (optional - for Android logging)
        this.sendEndMarker(tableId, sortedEntries.length, crc16);
    },
    
    /**
     * Invia SHUTDOWN notification a VDJC Android
     * Format: F0 7D 56 44 4A 43 00 7F F7
     * 
     * Android reaction:
     * - Reset tutti gli stati visivi a default
     * - Spegne LED buttons/hotcues/transport
     * - Cancella Alias Tables (ChainPreset, VisibleEffects)
     * - Reset UI a stato "disconnesso"
     * - Libera memoria
     */
    sendShutdownNotification: function() {
        const message = [].concat(
            this.HEADER,
            [this.CMD_SHUTDOWN],     // Command: SHUTDOWN (0x7F)
            [0xF7]                   // End SysEx
        );
        
        midi.sendSysexMsg(message, message.length);
        
        if (VDJC.debugging) {
            console.log('[VDJC SysEx] 🔴 Sent SHUTDOWN notification to Android');
        }
    }
};

/**
 * Invia tutte le alias tables degli effetti ad Android
 * Chiamato durante init() e resync()
 * PROTOCOL v1.2: METADATA + Sequence + CRC-16 validation
 */
VDJC.sendEffectAliasTables = function() {
    if (VDJC.debugging) {
        console.log('[VDJC] Scheduling effect alias tables transmission (v1.2) with 200ms delay...');
    }
    
    // Ritarda l'invio di 200ms per dare tempo ad Android di essere pronto
    // Questo previene la perdita dei primi messaggi SysEx quando Mixxx si avvia rapidamente
    engine.beginTimer(200, function() {
        if (VDJC.debugging) {
            console.log('[VDJC] Sending effect alias tables (v1.2 with validation)...');
        }
        
        let tablesSent = 0;
        
        // === Invia ChainPresetList con v1.2 validation ===
        if (typeof ChainPresetList !== 'undefined' && ChainPresetList !== null) {
            const chainEntries = [];
            for (let idx in ChainPresetList) {
                if (ChainPresetList.hasOwnProperty(idx) && 
                    ChainPresetList[idx] && 
                    ChainPresetList[idx].effectString) {
                    chainEntries.push({
                        index: parseInt(idx),
                        name: ChainPresetList[idx].effectString
                    });
                }
            }
            
            if (chainEntries.length > 0) {
                VDJC.SysEx.sendAliasTableWithValidation(VDJC.SysEx.TABLE_CHAIN_PRESET, chainEntries);
                tablesSent++;
                if (VDJC.debugging) {
                    console.log('[VDJC]   ✓ ChainPresetList sent (' + chainEntries.length + ' entries)');
                }
            } else {
                // Invia METADATA con count=0 per segnalare tabella vuota
                VDJC.SysEx.sendMetadata(VDJC.SysEx.TABLE_CHAIN_PRESET, 0, 0);
                console.warn('[VDJC] ⚠️  ChainPresetList is empty - sent empty table notification');
            }
        } else {
            // Invia METADATA con count=0 per segnalare tabella non disponibile
            VDJC.SysEx.sendMetadata(VDJC.SysEx.TABLE_CHAIN_PRESET, 0, 0);
            console.warn('[VDJC] ⚠️  ChainPresetList not defined - sent unavailable notification');
        }
        
        // === Invia VisibleEffectsList con v1.2 validation ===
        if (typeof VisibleEffectsList !== 'undefined' && VisibleEffectsList !== null) {
            const visibleEntries = [];
            for (let idx in VisibleEffectsList) {
                if (VisibleEffectsList.hasOwnProperty(idx) && 
                    VisibleEffectsList[idx] && 
                    VisibleEffectsList[idx].effectString) {
                    visibleEntries.push({
                        index: parseInt(idx),
                        name: VisibleEffectsList[idx].effectString
                    });
                }
            }
            
            if (visibleEntries.length > 0) {
                VDJC.SysEx.sendAliasTableWithValidation(VDJC.SysEx.TABLE_VISIBLE_EFFECTS, visibleEntries);
                tablesSent++;
                if (VDJC.debugging) {
                    console.log('[VDJC]   ✓ VisibleEffectsList sent (' + visibleEntries.length + ' entries)');
                }
            } else {
                // Invia METADATA con count=0 per segnalare tabella vuota
                VDJC.SysEx.sendMetadata(VDJC.SysEx.TABLE_VISIBLE_EFFECTS, 0, 0);
                console.warn('[VDJC] ⚠️  VisibleEffectsList is empty - sent empty table notification');
            }
        } else {
            // Invia METADATA con count=0 per segnalare tabella non disponibile
            VDJC.SysEx.sendMetadata(VDJC.SysEx.TABLE_VISIBLE_EFFECTS, 0, 0);
            console.warn('[VDJC] ⚠️  VisibleEffectsList not defined - sent unavailable notification');
        }
        
        // === Invia QuickEffectPresetList con v1.2 validation ===
        if (typeof QuickEffectPresetList !== 'undefined' && QuickEffectPresetList !== null) {
            const quickEntries = [];
            for (let idx in QuickEffectPresetList) {
                if (QuickEffectPresetList.hasOwnProperty(idx) && 
                    QuickEffectPresetList[idx] && 
                    QuickEffectPresetList[idx].effectString) {
                    quickEntries.push({
                        index: parseInt(idx),
                        name: QuickEffectPresetList[idx].effectString
                    });
                }
            }
            
            if (quickEntries.length > 0) {
                VDJC.SysEx.sendAliasTableWithValidation(VDJC.SysEx.TABLE_QUICK_EFFECT, quickEntries);
                tablesSent++;
                if (VDJC.debugging) {
                    console.log('[VDJC]   ✓ QuickEffectPresetList sent (' + quickEntries.length + ' entries)');
                }
            } else {
                // Invia METADATA con count=0 per segnalare tabella vuota
                VDJC.SysEx.sendMetadata(VDJC.SysEx.TABLE_QUICK_EFFECT, 0, 0);
                console.warn('[VDJC] ⚠️  QuickEffectPresetList is empty - sent empty table notification');
            }
        } else {
            // Invia METADATA con count=0 per segnalare tabella non disponibile
            VDJC.SysEx.sendMetadata(VDJC.SysEx.TABLE_QUICK_EFFECT, 0, 0);
            console.warn('[VDJC] ⚠️  QuickEffectPresetList not defined - sent unavailable notification');
        }
        
        if (tablesSent > 0) {
            if (VDJC.debugging) {
                console.log('[VDJC] ✅ Effect alias tables sent successfully (' + tablesSent + ' tables, v1.2 - validated)');
            }
        } else {
            // Anche se nessuna tabella con dati è stata inviata, 
            // le notifiche di tabella vuota (METADATA count=0) sono state comunicate
            if (VDJC.debugging) {
                console.log('[VDJC] ⚠️  No alias tables with data - empty table notifications sent to Android');
            }
        }
    }, true); // true = one-shot timer
};

////////////////////////////////////////////////////////////////////////////
/*                       [ Function init ]                                */
////////////////////////////////////////////////////////////////////////////
VDJC.init = function(id, debugging) {
    VDJC.id = id;

    if (debugging) {
        console.log('[VDJC] ========== INITIALIZATION STARTED ==========');
    }

    // ===== 1. Invia Alias Tables per gli effetti (SysEx Protocol v1.2) =====
    VDJC.sendEffectAliasTables();
    
    // ===== 2. Inizializza componenti tramite funzioni modulari (InitShutFunctions.js) =====
    initDecks();              // Left Deck (Ch1/3) + Right Deck (Ch2/4)
    initSamplerBanks();       // Sampler Bank A (ch5) + B (ch6)
    initEffectUnit();         // Effect Unit 1-4 con sampler grid
    initSamplerPads();        // 16 trigger pads con feedback
    initXYPads();             // 8 pots per Effect Unit mix/super1
    initSkinViewButtons();    // 3 toggle buttons (effectrack, samplers, vinylcontrol)
    initMasterControls();     // Master FX assignment buttons + encoders
    initVuMeter();            // VU Meters (Main + Deck 1-4)

    if (debugging) {
        console.log('[VDJC] ========== INITIALIZATION COMPLETED ==========');
    }
};

////////////////////////////////////////////////////////////////////////////
/*                      [ Function shutdown ]                             */
////////////////////////////////////////////////////////////////////////////
VDJC.shutdown = function() {
    if (VDJC.debugging) {
        console.log('[VDJC] ========== SHUTDOWN STARTED ==========');
    }
    
    // 1. Invia SysEx SHUTDOWN notification ad Android
    //    Android reagisce autonomamente: reset stati, spegne LED, cancella Alias Tables
    VDJC.SysEx.sendShutdownNotification();
    
    // 2. Delay breve per garantire invio SysEx prima del disconnect
    engine.beginTimer(50, function() {
        // 3. Chiama tutte le funzioni di shutdown modulari (InitShutFunctions.js)
        shutdownVuMeter();
        shutdownMasterControls();
        shutdownSkinViewButtons();
        shutdownXYPads();
        shutdownSamplerPads();
        shutdownEffectUnit();
        shutdownSamplerBanks();
        shutdownDecks();
        
        // 4. Cleanup variabili globali
        VDJC.leftDeck = null;
        VDJC.rightDeck = null;
        VDJC.samplerBankA = null;
        VDJC.samplerBankB = null;
        VDJC.effectUnit = null;
        VDJC.samplerPads = null;
        
        if (VDJC.debugging) {
            console.log('[VDJC] ========== SHUTDOWN COMPLETED ==========');
        }
    }, true); // true = one-shot timer
};
/**
 * ============================================================================
 * VDJC Resync Protocol v2.0 - Multi-level State Synchronization
 * ============================================================================
 * Handler per richieste di resync differenziato da VDJC Android
 * MIDI: Note 0x9F 0x00 [velocity]
 * 
 * Chiamato quando VDJC invia Note 0x9F 0x00 con velocity specifica:
 * - velocity 0x7F → FULL resync (all + Alias Tables) - ~500-900ms
 * - velocity 0x01 → CONSOLE layout partial resync - ~50-150ms  
 * - velocity 0x02 → EFFECTS layout partial resync - ~30-100ms
 * - velocity 0x03 → SAMPLERS layout partial resync - ~30-100ms
 * 
 * Trigger automatici:
 * - USB/WiFi connect → 0x7F (FULL con Alias Tables)
 * 
 * Trigger manuali:
 * - Tap su pulsante 🔄 → 0x01/0x02/0x03 (partial per layout corrente)
 * - Long press ≥5s su 🔄 → 0x7F (FULL rebuild)
 * 
 * FILTRO: Ignora velocity=0 per evitare trigger duplicati su note-off
 */
VDJC.resyncAllComponents = function(channel, control, value, status, group) {
    // Ignora note-off (value = 0) per evitare doppi trigger
    if (value === 0) {
        if (VDJC.debugging) {
            console.log('[VDJC] resyncAllComponents ignorato - note-off (value=0)');
        }
        return;
    }
    
    if (VDJC.debugging) {
        console.log('[VDJC] ✅ RESYNC REQUEST ricevuto (velocity=' + value + ', 0x' + value.toString(16).toUpperCase() + ')');
    }
    
    // Dispatcher basato su velocity (resync type)
    switch (value) {
        case 0x7F:
            // FULL RESYNC (all layouts + Alias Tables)
            if (VDJC.debugging) {
                console.log('[VDJC]   → FULL resync (all + Alias Tables)');
            }
            VDJC.resyncFull();
            break;
            
        case 0x01:
            // CONSOLE LAYOUT partial resync
            if (VDJC.debugging) {
                console.log('[VDJC]   → CONSOLE layout partial resync');
            }
            VDJC.resyncLayoutConsole();
            break;
            
        case 0x02:
            // EFFECTS LAYOUT partial resync
            if (VDJC.debugging) {
                console.log('[VDJC]   → EFFECTS layout partial resync');
            }
            VDJC.resyncLayoutEffects();
            break;
            
        case 0x03:
            // SAMPLERS LAYOUT partial resync
            if (VDJC.debugging) {
                console.log('[VDJC]   → SAMPLERS layout partial resync');
            }
            VDJC.resyncLayoutSamplers();
            break;
            
        case 0x04:
            // ALIAS TABLES ONLY resync (recovery dopo burst senza tables)
            if (VDJC.debugging) {
                console.log('[VDJC]   → Alias Tables ONLY resync');
            }
            VDJC.resyncAliasTablesOnly();
            break;
            
        default:
            // Unknown resync type - fallback to FULL
            console.warn('[VDJC] ⚠️  Unknown resync type: ' + value + ' - fallback to FULL resync');
            VDJC.resyncFull();
            break;
    }
};

/**
 * FULL RESYNC (0x7F)
 * Sincronizza tutti i layout + invia Alias Tables SysEx
 * Uso: Connection startup (auto), long press manuale (≥5s)
 * Performance: ~500-900ms
 */
VDJC.resyncFull = function() {
    if (VDJC.debugging) {
        console.log('[VDJC] 🔄 Full resync started...');
    }
    
    // 1. Resync tutti i layout
    VDJC.resyncLayoutConsole();
    VDJC.resyncLayoutEffects();
    VDJC.resyncLayoutSamplers();
    
    // 2. Invia Alias Tables SysEx (heavy operation)
    VDJC.sendEffectAliasTables();
    
    if (VDJC.debugging) {
        console.log('[VDJC] ✅ Full resync completato (all + Alias Tables)');
    }
};

/**
 * CONSOLE LAYOUT PARTIAL RESYNC (0x01)
 * Sincronizza: Deck A/B, Mixer, Master
 * NO Effect Units details, NO Alias Tables
 * Performance: ~50-150ms
 */
VDJC.resyncLayoutConsole = function() {
    if (VDJC.debugging) {
        console.log('[VDJC] 🎚️  Resyncing CONSOLE layout...');
    }
    
    let triggeredCount = 0;
    
    // Master Controls
    const masterControls = [
        VDJC.crossF,
        VDJC.cueVolume,
        VDJC.cueMix,
        VDJC.masterVolume,
        VDJC.masterBalance
    ];
    
    masterControls.forEach(function(control) {
        if (control && typeof control.trigger === 'function') {
            control.trigger();
            triggeredCount++;
        }
    });
    
    // Skin View Toggle Buttons
    const skinViewButtons = [
        VDJC.skinEffectRackButton,
        VDJC.skinSamplersButton,
        VDJC.skinVinylControlButton
    ];
    
    skinViewButtons.forEach(function(btn) {
        if (btn && typeof btn.trigger === 'function') {
            btn.trigger();
            triggeredCount++;
        }
    });
    
    // Master FX Assignment Buttons (buttons only, NO unit states)
    if (VDJC.masterFxAssignButtons) {
        VDJC.masterFxAssignButtons.forEach(function(btn) {
            if (btn && typeof btn.trigger === 'function') {
                btn.trigger();
                triggeredCount++;
            }
        });
    }
    
    // Left Deck (all components)
    if (VDJC.leftDeck && typeof VDJC.leftDeck.reconnectComponents === 'function') {
        VDJC.leftDeck.reconnectComponents(function(component) {
            if (typeof component.trigger === 'function') {
                component.trigger();
                triggeredCount++;
            }
        });
    }
    
    // Right Deck (all components)
    if (VDJC.rightDeck && typeof VDJC.rightDeck.reconnectComponents === 'function') {
        VDJC.rightDeck.reconnectComponents(function(component) {
            if (typeof component.trigger === 'function') {
                component.trigger();
                triggeredCount++;
            }
        });
    }
    
    // Send active deck info
    if (VDJC.leftDeck && typeof VDJC.leftDeck.sendActiveDeckInfo === 'function') {
        VDJC.leftDeck.sendActiveDeckInfo();
    }
    if (VDJC.rightDeck && typeof VDJC.rightDeck.sendActiveDeckInfo === 'function') {
        VDJC.rightDeck.sendActiveDeckInfo();
    }
    
    if (VDJC.debugging) {
        console.log('[VDJC] ✅ CONSOLE layout resync complete (' + triggeredCount + ' components)');
    }
};

/**
 * EFFECTS LAYOUT PARTIAL RESYNC (0x02)
 * Sincronizza: EffectUnit 1-4 states (knobs, buttons, parameters)
 * NO Effect names, NO Chain preset names (usa Alias Tables precedenti)
 * Performance: ~30-100ms
 */
VDJC.resyncLayoutEffects = function() {
    console.log('[VDJC] 🎛️  resyncLayoutEffects() called - debugging=' + VDJC.debugging + ', effectUnit=' + (VDJC.effectUnit ? 'exists' : 'NULL') + ', currentUnitNumber=' + (VDJC.effectUnit ? VDJC.effectUnit.currentUnitNumber : 'N/A'));
    
    if (VDJC.debugging) {
        console.log('[VDJC] 🎛️  Resyncing EFFECTS layout...');
    }
    
    // ⚠️ CRITICAL ORDER: Invia PRIMA il messaggio di unit number (0x99 0x0E)
    // per sincronizzare Android con l'unit selezionata PRIMA del burst di parametri
    if (VDJC.effectUnit && VDJC.effectUnit.currentUnitNumber) {
        if (VDJC.debugging) {
            console.log('[VDJC] Sending EffectUnit number FIRST: ' + VDJC.effectUnit.currentUnitNumber + ' (0x99 0x0E)');
        }
        midi.sendShortMsg(0x99, 0x0E, VDJC.effectUnit.currentUnitNumber);
        
        // FIX UDP BUFFER OVERFLOW: Separa l'invio dei messaggi Sampler (64) dai messaggi Invert/LinkType
        // Sampler burst → 50ms delay → Invert/LinkType burst
        // Questo permette al buffer UDP Android di svuotarsi tra i burst
        let samplerComponents = [];
        let otherComponents = [];
        
        // Separa i component in due gruppi
        if (VDJC.effectUnit && typeof VDJC.effectUnit.reconnectComponents === 'function') {
            VDJC.effectUnit.reconnectComponents(function(component) {
                // Sampler assignment components usano group: '[Sampler<N>]', key include 'Effect'
                if (component.group && component.group.indexOf('[Sampler') === 0) {
                    samplerComponents.push(component);
                } else {
                    otherComponents.push(component);
                }
            });
        }
        
        if (VDJC.debugging) {
            console.log('[VDJC] 📦 Split components: ' + samplerComponents.length + ' Sampler, ' + otherComponents.length + ' Others');
        }
        
        // FASE 1: Invia IMMEDIATAMENTE i messaggi Sampler (64 burst)
        samplerComponents.forEach(function(component) {
            if (typeof component.trigger === 'function') {
                component.trigger();
            }
        });
        
        if (VDJC.debugging) {
            console.log('[VDJC] 📤 Phase 1: Sent ' + samplerComponents.length + ' Sampler assignments');
        }
        
        // FASE 2: Attendi 50ms per svuotare UDP buffer, POI invia Invert/LinkType
        engine.beginTimer(50, function() {
            otherComponents.forEach(function(component) {
                if (typeof component.trigger === 'function') {
                    component.trigger();
                }
            });
            
            if (VDJC.debugging) {
                console.log('[VDJC] 📤 Phase 2: Sent ' + otherComponents.length + ' Invert/LinkType labels');
                console.log('[VDJC] ✅ EFFECTS layout resync complete (' + (samplerComponents.length + otherComponents.length) + ' components, NO Alias Tables)');
            }
        }, true); // oneShot=true
        
        return;
    }
    
    // Fallback se effectUnit non esiste (non dovrebbe mai succedere)
    let triggeredCount = 0;
    
    // Trigghera Effect Unit components (se presente)
    if (VDJC.effectUnit && typeof VDJC.effectUnit.reconnectComponents === 'function') {
        VDJC.effectUnit.reconnectComponents(function(component) {
            if (typeof component.trigger === 'function') {
                component.trigger();
                triggeredCount++;
            }
        });
    }
    
    // Note: Alias Tables NON vengono inviate (usa quelle del FULL resync precedente)
    
    if (VDJC.debugging) {
        console.log('[VDJC] ✅ EFFECTS layout resync complete (' + triggeredCount + ' components, NO Alias Tables)');
    }
};

/**
 * SAMPLERS LAYOUT PARTIAL RESYNC (0x03)
 * Sincronizza: SamplerBank A/B (all controls, hotcues, loop, transport)
 * Invia anche i target attuali di entrambe le banks
 * Performance: ~30-100ms
 */
VDJC.resyncLayoutSamplers = function() {
    if (VDJC.debugging) {
        console.log('[VDJC] 🎵 Resyncing SAMPLERS layout...');
    }
    
    let triggeredCount = 0;
    
    // Invia target attuale di Bank A (CC 0xB4 0x7F [target])
    if (VDJC.samplerBankA) {
        midi.sendShortMsg(0xB0 | VDJC.samplerBankA.channel, 0x7F, VDJC.samplerBankA.currentTarget);
        triggeredCount++;
    }
    
    // Invia target attuale di Bank B (CC 0xB5 0x7F [target])
    if (VDJC.samplerBankB) {
        midi.sendShortMsg(0xB0 | VDJC.samplerBankB.channel, 0x7F, VDJC.samplerBankB.currentTarget);
        triggeredCount++;
    }
    
    // Trigghera tutti i componenti di Bank A
    if (VDJC.samplerBankA && typeof VDJC.samplerBankA.reconnectComponents === 'function') {
        VDJC.samplerBankA.reconnectComponents(function(component) {
            if (typeof component.trigger === 'function') {
                component.trigger();
                triggeredCount++;
            }
        });
    }
    
    // Trigghera tutti i componenti di Bank B
    if (VDJC.samplerBankB && typeof VDJC.samplerBankB.reconnectComponents === 'function') {
        VDJC.samplerBankB.reconnectComponents(function(component) {
            if (typeof component.trigger === 'function') {
                component.trigger();
                triggeredCount++;
            }
        });
    }
    
    if (VDJC.debugging) {
        console.log('[VDJC] ✅ SAMPLERS layout resync complete (' + triggeredCount + ' components)');
    }
};

/**
 * ALIAS TABLES ONLY RESYNC (0x04)
 * Invia SOLO le Alias Tables SysEx (NO state sync)
 * Uso: Recovery quando tables non ricevute durante FULL resync
 * Performance: ~200-300ms
 */
VDJC.resyncAliasTablesOnly = function() {
    if (VDJC.debugging) {
        console.log('[VDJC] 📋 Alias Tables only resync started...');
    }
    
    // Invia solo le Alias Tables (con delay di 200ms come in init/resyncFull)
    VDJC.sendEffectAliasTables();
    
    if (VDJC.debugging) {
        console.log('[VDJC] ✅ Alias Tables only resync completed');
    }
};



/////////////////////////////////////////////////////////////////////////
// Master Controls                                                   //
////////////////////////////////////////////////////////////////////////
//Crossfader
VDJC.crossF = new components.Encoder({
    midi: [0xBF, 0x00],
    group: '[Master]',
    key: 'crossfader',
    outConnect: true,
    outTrigger: true,
});
//Encoder per volume cuffie
VDJC.cueVolume = new components.Encoder({
    midi: [0xBF, 0x03],
    group: '[Master]',
    key: 'headGain',
    outConnect: true,
    outTrigger: true,
});
//Encoder per il mix cuffie
VDJC.cueMix = new components.Encoder({
    midi: [0xBF, 0x04],
    group: '[Master]',
    key: 'headMix',
    outConnect: true,
    outTrigger: true,
});
//Potenziometro per volume master
VDJC.masterVolume = new components.Encoder({
    midi: [0xBF, 0x01],
    group: '[Master]',
    key: 'gain',
    outConnect: true,
    outTrigger: true,
});
//Encoder per balance su Master
VDJC.masterBalance = new components.Encoder({
    midi: [0xBF, 0x02],
    group: '[Master]',
    key: 'balance',
    outConnect: true,
    outTrigger: true,
});

// Effect Unit Assignment Buttons per Master
VDJC.masterFxAssignButtons = [];
for (var u = 1; u <= 4; u++) {
    VDJC.masterFxAssignButtons[u] = new components.EffectUnitAssignmentButton({
        midi: [0x9F, 0x50 + u],
        group: '[EffectRack1_EffectUnit' + u + ']',
        xmlGroup: 'group_[Master]_enable',
    });
}

/**
 * Gestione deckSwitchButton con logica momentary
 * usando toggle su deckNumbers() del Component Deck
 */
VDJC.deckSwitchButton = function(_channel, control, value, status, _group) {
    if (status == 0x9f && control === 0x01) {
        if (value == 0x7f) {
            VDJC.leftDeck.toggle();
            VDJC.leftDeck.updateFXAssignmentKeys();
            // Invia info sul deck attivo all'app
            VDJC.leftDeck.sendActiveDeckInfo();
        }
    } else if (status == 0x9f && control === 0x02) {
        if (value == 0x7f) {
            VDJC.rightDeck.toggle();
            VDJC.rightDeck.updateFXAssignmentKeys();
            // Invia info sul deck attivo all'app
            VDJC.rightDeck.sendActiveDeckInfo();
        }
    }
};

/**
 * Sampler Pads - 16 pulsanti per trigger sampler 1-16
 * MIDI: 0x9F 0x2B [velocity 1-16]
 * Feedback bidirezionale: monitora play state di ogni sampler
 */
VDJC.samplerPads = function() {
    components.ComponentContainer.call(this);
    
    // Crea 16 pulsanti sampler
    for (let i = 1; i <= 16; i++) {
        this[i] = new components.Button({
            midi: [0x9F, 0x2B],
            group: `[Sampler${i}]`,
            samplerNumber: i,
            key: 'play',
            type: components.Button.prototype.types.toggle,
            
            // Input: toggle play con velocity = sampler number
            input: function(_channel, _control, value, _status, _group) {
                // Velocity 0 = release (ignora), 1-16 = sampler number
                if (value === 0) return;
                
                // Verifica che il velocity corrisponda a questo sampler
                if (value === this.samplerNumber) {
                    // Toggle play state
                    script.toggleControl(this.group, this.key);
                }
            },
            
            // Output: feedback play state with bidirectional velocity encoding
            // Formula: velocity = (samplerNumber * 2) - 2 + (isPlaying ? 1 : 0)
            // Sampler 1: OFF=0, ON=1; Sampler 2: OFF=2, ON=3; etc.
            output: function(value, _group, _key) {
                const isPlaying = value > 0;
                const velocity = (this.samplerNumber * 2) - 2 + (isPlaying ? 1 : 0);
                midi.sendShortMsg(this.midi[0], this.midi[1], velocity);
            },
        });
    }
};
VDJC.samplerPads.prototype = new components.ComponentContainer();

/**
 * Handler MIDI per Sampler Pads - Dispatcher per ComponentContainer
 * Riceve messaggi 0x9F 0x2B e distribuisce al Button corretto in base al velocity
 */
VDJC.samplerPadsHandler = function(channel, control, value, status, _group) {
    // Ignora note-off (velocity 0)
    if (value === 0) return;
    
    // Verifica che il velocity sia valido (1-16)
    if (value >= 1 && value <= 16) {
        // Chiama l'input del Button corrispondente
        if (VDJC.samplerPads[value] && typeof VDJC.samplerPads[value].input === 'function') {
            VDJC.samplerPads[value].input(channel, control, value, status, VDJC.samplerPads[value].group);
        }
    }
};

////////////////////////////////////////////////////////////////////////
// XY Pads per EffectUnit (FX Area in DeckCueStrip)                  //
////////////////////////////////////////////////////////////////////////
// 8 Pot per controllare mix (wet/dry) e super1 delle 4 EffectUnit
// Group fisso (non cambia quando si switcha unit nell'EFFECTS layout)
// Usati dagli XY Pad nei tab FX di DeckCueStrip

// EffectUnit 1
VDJC.xyPadUnit1Mix = new components.Pot({
    midi: [0xBF, 0x50],
    group: '[EffectRack1_EffectUnit1]',
    key: 'mix',
});

VDJC.xyPadUnit1Super = new components.Pot({
    midi: [0xBF, 0x51],
    group: '[EffectRack1_EffectUnit1]',
    key: 'super1',
});

// EffectUnit 2
VDJC.xyPadUnit2Mix = new components.Pot({
    midi: [0xBF, 0x52],
    group: '[EffectRack1_EffectUnit2]',
    key: 'mix',
});

VDJC.xyPadUnit2Super = new components.Pot({
    midi: [0xBF, 0x53],
    group: '[EffectRack1_EffectUnit2]',
    key: 'super1',
});

// EffectUnit 3
VDJC.xyPadUnit3Mix = new components.Pot({
    midi: [0xBF, 0x54],
    group: '[EffectRack1_EffectUnit3]',
    key: 'mix',
});

VDJC.xyPadUnit3Super = new components.Pot({
    midi: [0xBF, 0x55],
    group: '[EffectRack1_EffectUnit3]',
    key: 'super1',
});

// EffectUnit 4
VDJC.xyPadUnit4Mix = new components.Pot({
    midi: [0xBF, 0x56],
    group: '[EffectRack1_EffectUnit4]',
    key: 'mix',
});

VDJC.xyPadUnit4Super = new components.Pot({
    midi: [0xBF, 0x57],
    group: '[EffectRack1_EffectUnit4]',
    key: 'super1',
});

////////////////////////////////////////////////////////////////////////
// Decks New                                                          //
////////////////////////////////////////////////////////////////////////
VDJC.Deck = function(deckNumbers, channel) {
    components.Deck.call(this, deckNumbers);
    this.deckNumbers = deckNumbers;
    this.currentDeck = `[Channel` + deckNumbers[0] + `]`;
    this.deckNum = script.deckFromGroup(this.currentDeck);

    //Buttons

    this.playButton = new components.PlayButton({
        midi: [0x90 | channel, 0x01],
        group: this.currentDeck,
        // Velocity encoding per play state + direction:
        // Anello esterno: play_stutter, Simbolo interno: play_indicator
        // 0x00 = Both OFF + Forward
        // 0x10 = Both OFF + Backward
        // 0x40 = Stutter ON, Indicator OFF + Forward
        // 0x50 = Stutter ON, Indicator OFF + Backward
        // 0x7F = Both ON + Forward
        // 0x60 = Both ON + Backward
        outConnect: true,
        outTrigger: false, // Disabilita trigger automatico all'avvio per evitare LED acceso
        connections: [], // Array per salvare le connessioni
        output: function(value, group, _key) {
            const playStutter = engine.getValue(group, 'play_stutter') > 0;
            const playIndicator = engine.getValue(group, 'play_indicator') > 0;
            const isReverse = engine.getValue(group, 'reverse') > 0;
            
            let velocity;
            if (!playStutter) {
                // Entrambi off (play_stutter=0 implica play_indicator=0)
                velocity = isReverse ? 0x10 : 0x00;
            } else if (playStutter && !playIndicator) {
                // Stutter playing ma indicator off (anello acceso, simbolo spento)
                velocity = isReverse ? 0x50 : 0x40;
            } else {
                // Entrambi on (anello e simbolo accesi)
                velocity = isReverse ? 0x60 : 0x7F;
            }
            
            midi.sendShortMsg(this.midi[0], this.midi[1], velocity);
        },
        connect: function() {
            // Connetti play_stutter, play_indicator e reverse per aggiornare il feedback
            this.connections[0] = engine.makeConnection(this.group, 'play_stutter', this.output.bind(this));
            this.connections[1] = engine.makeConnection(this.group, 'play_indicator', this.output.bind(this));
            this.connections[2] = engine.makeConnection(this.group, 'reverse', this.output.bind(this));
        },
        disconnect: function() {
            // Disconnetti tutte e tre le connessioni
            if (this.connections[0]) {
                this.connections[0].disconnect();
            }
            if (this.connections[1]) {
                this.connections[1].disconnect();
            }
            if (this.connections[2]) {
                this.connections[2].disconnect();
            }
            this.connections = [];
        },
        trigger: function() {
            // Trigger standard che itera sulle connessioni
            if (this.connections[0] !== undefined) {
                this.connections.forEach(function(conn) {
                    conn.trigger();
                });
            }
        }
    });

    this.cueButton = new components.CueButton({
        midi: [0x90 | channel, 0x02],
        group: this.currentDeck,
        reverseRollOnShift: VDJC.reverseRollOnShiftCue,
    }); 

    this.syncLeaderButton = new components.Button({
        midi: [0x90 | channel, 0x5E],
        group: this.currentDeck,
        key: 'sync_leader',
        type: components.Button.prototype.types.toggle,
    });
    
    this.syncButton = new components.Button({
        midi: [0x90 | channel, 0x5F],
        group: this.currentDeck,
        outKey: 'sync_enabled',
        type: components.Button.prototype.types.powerWindow,
        unshift: function() {
            this.input = function(channel, control, value, status, _group) {
                if (this.isPress(channel, control, value, status)) {
                    if (engine.getValue(this.group, `sync_enabled`) === 0) {
                        engine.setValue(this.group, `beatsync`, 1);
                        this.longPressTimer = engine.beginTimer(this.longPressTimeout, () => {
                            engine.setValue(this.group, `sync_enabled`, 1);
                            this.longPressTimer = NO_TIMER;
                        }, true);
                    } else {
                        engine.setValue(this.group, `sync_enabled`, 0);
                    }
                } else {
                    if (this.longPressTimer !== NO_TIMER) {
                        engine.stopTimer(this.longPressTimer);
                        this.longPressTimer = NO_TIMER;
                    }
                }
            };
        },
        shift: function() {
            this.input = function(channel, control, value, status, _group) {
                if (this.isPress(channel, control, value, status)) {
                    this.isLongPressed = false;
                    this.longPressTimer = engine.beginTimer(this.longPressTimeout, () => {
                        this.isLongPressed = true;
                        engine.setValue(this.group, `sync_mode`, 0); // long press
                        this.longPressTimer = NO_TIMER;
                    }, true);
                } else {
                    if (this.longPressTimer !== NO_TIMER) {
                        engine.stopTimer(this.longPressTimer);
                        this.longPressTimer = NO_TIMER;
                    }
                    if (!this.isLongPressed) {
                        engine.setValue(this.group, `sync_mode`, 1); // short press
                    }
                    this.isLongPressed = false;
                }
            };
        },
       
    });
    
    this.repeatButton = new components.Button({
        midi: [0x90 | channel, 0x04],
        group: this.currentDeck,
        key: 'repeat',
        type: components.Button.prototype.types.toggle,
    });
    
    this.syncKeyButton = new components.Button({
        midi: [0x90 | channel, 0x5E],
        group: this.currentDeck,
        key: 'sync_key',
        type: components.Button.prototype.types.toggle,
    }); 

    this.keylockButton = new components.Button({
        midi: [0x90 | channel, 0x5D],
        group: this.currentDeck,
        key: 'keylock',
        type: components.Button.prototype.types.toggle,
    });

    this.quantizeButton = new components.Button({
        midi: [0x90 | channel, 0x5C],
        group: this.currentDeck,
        key: 'quantize',
        type: components.Button.prototype.types.toggle,
    });

    this.slipButton = new components.Button({
        midi: [0x90 | channel, 0x5A],
        group: this.currentDeck,
        key: 'slip_enabled',
        type: components.Button.prototype.types.toggle,
    });
    // Tap Tempo Button
    this.tapButton = new components.Button({
        midi: [0x90 | channel, 0x5B],
        group: this.currentDeck,
        key: 'tempo_tap',
        outConnect: false, // Disabilita l'output automatico
        outTrigger: false, // Disabilita il trigger automatico
        // Sovrascrivi connect() per evitare che reconnectComponents() crei connessioni
        connect: function() {
            // Non fare nulla - questo pulsante è solo input
        },
        trigger: function() {
            // Non fare nulla - questo pulsante non deve triggerare output
        }
    });
    // Beat Grid Button (Adjust beatgrid so closest beat is aligned with the current playposition.)
    this.beatgridButton = new components.Button({
        midi: [0x90 | channel, 0x60],
        group: this.currentDeck,
        unshift: function() {
            this.inKey = 'beats_translate_curpos';
        },
        shift: function() {
            this.inKey = 'beats_undo_adjustment';
        },
        outKey: 'beats_translate_curpos',
    });
    // PFL Button (Pre-Fader Listen)
    this.pflButton = new components.Button({
        midi: [0x90 | channel, 0x00],
        group: this.currentDeck,
        key: 'pfl',
        type: components.Button.prototype.types.toggle,
    });
    
    // Eject Button
    this.ejectButton = new components.Button({
        midi: [0x90 | channel, 0x03],
        group: this.currentDeck,
        key: 'eject',
        type: components.Button.prototype.types.push,
    });

    // FX Chain Assignment Button - Usa EffectUnitAssignmentButton (Button toggle)
    var effectUnitAssignmentButtons = [];
    for (var u = 1; u <= 4; u++) {
        effectUnitAssignmentButtons.push(new components.EffectUnitAssignmentButton({
            midi: [0x90 | channel, 0x50 + u],
            group: '[EffectRack1_EffectUnit' + u + ']',
            xmlGroup: 'group_' + this.currentDeck + '_enable',
        }));
    }
    this.effectUnitAssignmentButtons = effectUnitAssignmentButtons;
    
    // Dopo aver creato i bottoni, aggiorna la chiave con il deck attivo
    this.effectUnitAssignmentButtons.forEach(function(btn) {
        btn.fixedKey = 'group_' + this.currentDeck + '_enable';
        btn.inKey = btn.fixedKey;
        btn.outKey = btn.fixedKey;
    }, this);

    // E ogni volta che cambi deck (es. in toggle/setCurrentDeck), aggiorna la chiave:
    VDJC.Deck.prototype.updateFXAssignmentKeys = function() {
        if (Array.isArray(this.effectUnitAssignmentButtons)) {
            this.effectUnitAssignmentButtons.forEach(function(btn) {
                // Disconnect old connections
                btn.disconnect();
                // Update keys to new deck
                btn.fixedKey = `group_` + this.currentDeck + `_enable`;
                btn.inKey = btn.fixedKey;
                btn.outKey = btn.fixedKey;
                // Reconnect with new keys
                btn.connect();
                btn.trigger();
            }, this);
        }
    };
    //Hotcues Buttons
    var hotcues = [];
    for (var i = 1; i <= 16; i++) {
        hotcues[i] = new components.HotcueButton({
            midi: [0x90 | channel, 0x0A + i],
            number: i,
            group: this.currentDeck,
            sendStatusAndType: true,  // Invia status + type combinati in velocity
            outValueScale: function(value) {
                // LED acceso (0x7F) solo se hotcue è attivo (value > 1)
                // value: 0 = spento, 1 = settato ma non attivo, 2 = attivo
                return (value > 1) ? 0x7F : 0x00;
            }
        });
    };
    this.hotcues = hotcues;

    //OrientationButton
    this.orientationButton = new components.Button({
        midi: [0x90 | channel, 0x42],
        group: this.currentDeck,
        key: 'orientation',
        type: components.Button.prototype.types.push,
        input: function(channel, control, value, status, group) {
            if (value) {
                // Recupera il valore attuale
                let currentOrientation = engine.getValue(group, this.key);
                // Toggle ciclico tra 0, 1, 2
                let next = (currentOrientation + 1) % 3;
                engine.setValue(group, this.key, next);
            }
        },
        output: function(value, group, key) {
                // Invia lo stato orientation come velocity (0=Left, 1=Center, 2=Right)
                midi.sendShortMsg(this.midi[0], this.midi[1], value);
        }
    });

    this.beatloopToggleButton = new components.BeatloopToggleButton({
        midi: [0x90 | channel, 0x33],
        group: this.currentDeck,
    });

    this.reloopToggleButton = new components.ReloopToggleButton({
        midi: [0x90 | channel, 0x37],
        group: this.currentDeck,
    });

    this.loopInButton = new components.LoopInButton({
        midi: [0x90 | channel, 0x34],
        group: this.currentDeck,
    });

    this.loopOutButton = new components.LoopOutButton({
        midi: [0x90 | channel, 0x35],
        group: this.currentDeck,
    });

    this.loopAnchorButton = new components.LoopAnchorButton({
        midi: [0x90 | channel, 0x36],
        group: this.currentDeck,
    });

    this.loopDoubleButton = new components.LoopDoubleButton({
        midi: [0x90 | channel, 0x38],
        group: this.currentDeck,
    });

    this.loopHalveButton = new components.LoopHalveButton({
        midi: [0x90 | channel, 0x39],
        group: this.currentDeck,
    });

    this.beatjumpBackwardButton = new components.BeatjumpBackwardButton({
        midi: [0x90 | channel, 0x3B],
        group: this.currentDeck,
    });

    this.beatjumpForwardButton = new components.BeatjumpForwardButton({
        midi: [0x90 | channel, 0x3A],
        group: this.currentDeck,
    });

    this.beatjumpSizeDoubleButton = new components.BeatjumpSizeDoubleButton({
        midi: [0x90 | channel, 0x3C],
        group: this.currentDeck,
    });

    this.beatjumpSizeHalveButton = new components.BeatjumpSizeHalveButton({
        midi: [0x90 | channel, 0x3D],
        group: this.currentDeck,
    });

    this.introStartButton = new components.IntroStartButton({
        midi: [0x90 | channel, 0x3E],
        group: this.currentDeck,
    });

    this.introEndButton = new components.IntroEndButton({
        midi: [0x90 | channel, 0x3F],
        group: this.currentDeck,
    });

    this.outroStartButton = new components.OutroStartButton({
        midi: [0x90 | channel, 0x40],
        group: this.currentDeck,
    });

    this.outroEndButton = new components.OutroEndButton({
        midi: [0x90 | channel, 0x41],
        group: this.currentDeck,
    });

    this.EQHighKillButton = new components.Button({
        midi: [0x90 | channel, 0x06],
        group: '[EqualizerRack1_' + this.currentDeck + '_Effect1]',
        key: 'button_parameter3',
        type: components.Button.prototype.types.powerWindow,
    });

    this.EQMidKillButton = new components.Button({
        midi: [0x90 | channel, 0x07],
        group: '[EqualizerRack1_' + this.currentDeck + '_Effect1]',
        key: 'button_parameter2',
        type: components.Button.prototype.types.powerWindow,
    });

    this.EQLowKillButton = new components.Button({
        midi: [0x90 | channel, 0x08],
        group: '[EqualizerRack1_' + this.currentDeck + '_Effect1]',
        key: 'button_parameter1',
        type: components.Button.prototype.types.powerWindow,
    });

    this.QuickEffectEnableButton = new components.Button({
        midi: [0x90 | channel, 0x09],
        group: `[QuickEffectRack1_` + this.currentDeck + `]`,
        key: 'enabled',
        type: components.Button.prototype.types.powerWindow,
    });

    this.BeatloopSizeLabel = new components.Label({
        group: this.currentDeck,
        key: 'beatloop_size',
        output: function(value, group, key) {
            // Mappa beatloop_size a byte secondo tabella di conversione
            const valueMap = {
                0.03125: 0x01,  // 1/32
                0.0625: 0x02,   // 1/16
                0.125: 0x03,    // 1/8
                0.25: 0x04,     // 1/4
                0.5: 0x05,      // 1/2
                1: 0x06,        // 1
                2: 0x07,        // 2
                4: 0x08,        // 4
                8: 0x09,        // 8
                16: 0x0A,       // 16
                32: 0x0B,       // 32
                64: 0x0C,       // 64
                128: 0x0D,      // 128
                256: 0x0E,      // 256
                512: 0x0F       // 512
            };
            
            const dataByte = valueMap[value];
            if (dataByte === undefined) return;
            
            // Determina il canale MIDI (0 per Channel1/3, 1 per Channel2/4)
            const deckGroup = this.currentDeck || group;
            const deckNum = script.deckFromGroup(deckGroup);
            const midiChannel = (deckNum === 1 || deckNum === 3) ? 0 : 1;
            
            // Invia Note On con data1=0x31, data2=valore dalla tabella
            midi.sendShortMsg(0x90 | midiChannel, 0x31, dataByte);
        }
    });

    this.BeatjumpSizeLabel = new components.Label({
        group: this.currentDeck,
        key: 'beatjump_size',
        outConnect: true,
        outTrigger: true,
        output: function(value, group, key) {
            // Mappa beatjump_size a byte secondo tabella di conversione (stessa di BeatloopSize)
            const valueMap = {
                0.03125: 0x01,  // 1/32
                0.0625: 0x02,   // 1/16
                0.125: 0x03,    // 1/8
                0.25: 0x04,     // 1/4
                0.5: 0x05,      // 1/2
                1: 0x06,        // 1
                2: 0x07,        // 2
                4: 0x08,        // 4
                8: 0x09,        // 8
                16: 0x0A,       // 16
                32: 0x0B,       // 32
                64: 0x0C,       // 64
                128: 0x0D,      // 128
                256: 0x0E,      // 256
                512: 0x0F       // 512
            };
            
            const dataByte = valueMap[value];
            if (dataByte === undefined) return;
            
            // Determina il canale MIDI (0 per Channel1/3, 1 per Channel2/4)
            const deckGroup = this.currentDeck || group;
            const deckNum = script.deckFromGroup(deckGroup);
            const midiChannel = (deckNum === 1 || deckNum === 3) ? 0 : 1;
            
            // Invia Note On con data1=0x32, data2=valore dalla tabella
            midi.sendShortMsg(0x90 | midiChannel, 0x32, dataByte);
        }
    });
    // Faders e Encoders
    this.volumeFader = new components.Encoder({
        midi: [0xB0 | channel, 0x1E],
        group: this.currentDeck,
        key: 'volume',
        outConnect: true,
        outTrigger: true,
    });

    this.tempoFader = new components.Encoder({
        midi: [0xB0 | channel, 0x1D],
        group: this.currentDeck,
        key: 'rate',
        outConnect: true,
        outTrigger: true,
        softTakeover: false,
    });

    this.pregainEncoder = new components.Encoder({
        midi: [0xB0 | channel, 0x00],
        group: this.currentDeck,
        key: 'pregain',
        outConnect: true,
        outTrigger: true,
        softTakeover: false,
    });

    this.highEncoder = new components.Encoder({
        midi: [0xB0 | channel, 0x01],
        group: `[EqualizerRack1_` + this.currentDeck + `_Effect1]`,
        key: 'parameter3',
        outConnect: true,
        outTrigger: true,
        softTakeover: false,
    });

    this.midEncoder = new components.Encoder({
        midi: [0xB0 | channel, 0x02],
        group: `[EqualizerRack1_` + this.currentDeck + `_Effect1]`,
        key: 'parameter2',
        outConnect: true,
        outTrigger: true,
        softTakeover: false,
    });

    this.lowEncoder = new components.Encoder({
        midi: [0xB0 | channel, 0x03],
        group: `[EqualizerRack1_` + this.currentDeck + `_Effect1]`,
        key: 'parameter1',
        outConnect: true,
        outTrigger: true,
        softTakeover: false,
    });

    this.super1Encoder = new components.Encoder({
        midi: [0xB0 | channel, 0x1A],
        group: `[QuickEffectRack1_` + this.currentDeck +`]`,
        key: 'super1',
        outConnect: true,
        outTrigger: true,
        softTakeover: false,
    });
    
    // QuickEffect loaded_chain_preset feedback (CC 0x04)
    this.quickEffectPreset = new components.Pot({
        midi: [0xB0 | channel, 0x04],
        group: `[QuickEffectRack1_` + this.currentDeck +`]`,
        key: 'loaded_chain_preset',
        outConnect: true,
        outTrigger: true,
        input: function(channel, control, value, status, group) {
            // Input: riceve selezione dal dropdown Android (0-N)
            // Usa this.group invece del parametro per garantire gruppo corretto
            engine.setValue(this.group, this.key, value);
        },
        output: function(value, group, key) {
            // Output: invia feedback preset corrente (0=Empty, 1-N=preset index)
            midi.sendShortMsg(this.midi[0], this.midi[1], value);
        }
    });
    ////////////////////////////////////////////////////////////
    //*         Wheels del controller VDJC                   *//
    ////////////////////////////////////////////////////////////
    // Wheels del controller VDJC come metodi dell'istanza
    const alpha = 1/8;
    this.jogWheel = new components.JogWheelBasic({
      midi: [0xB0 | channel, 0x1B || 0x0A], // MIDI CC per la jogwheel
      group: this.currentDeck,
      deck: this.deckNum, // whatever deck this jogwheel controls
      wheelResolution: 800, // how many ticks per revolution the jogwheel has
      alpha: alpha, // alpha-filter
      beta: alpha/32, // optional
      rpm: 33 + 1/3, // optional
    });
};
// Estende il prototipo di components.Deck
VDJC.Deck.prototype = Object.create(components.Deck.prototype);
VDJC.Deck.prototype.constructor = VDJC.Deck;

// Metodo per gestire il pulsante shift del deck
VDJC.Deck.prototype.handleShift = function(isShifted) {
    if (isShifted) {
        this.shift();
    } else {
        this.unshift();
    }
};

/**
 * Invia informazioni sul deck attivo all'app VDJC
 * Comunica quale Channel (1-4) è attualmente attivo su questo deck
 * Usa Note On 0x9F con:
 * - data1=0x04 per DeckA (left), 0x05 per DeckB (right)
 * - data2=0x00 per Channel1/2, 0x7F per Channel3/4
 */
VDJC.Deck.prototype.sendActiveDeckInfo = function() {
    // Determina quale channel è attivo
    const deckNum = script.deckFromGroup(this.currentDeck); // 1, 2, 3, o 4
    
    // Determina data1 in base a quale deck (left=0x04, right=0x05)
    // this.deckNumbers[0] è il primo deck: 1 o 3 per left, 2 o 4 per right
    const isLeftDeck = (this.deckNumbers[0] === 1 || this.deckNumbers[0] === 3);
    const data1 = isLeftDeck ? 0x04 : 0x05;
    
    // Determina data2 in base al channel attivo
    // Channel 1 o 2 (primary) = 0x00, Channel 3 o 4 (alternate) = 0x7F
    const data2 = (deckNum === 1 || deckNum === 2) ? 0x00 : 0x7F;
    
    // Invia Note On: status=0x9F, data1=0x04/0x05, data2=0x00/0x7F
    midi.sendShortMsg(0x9F, data1, data2);
    
    if (VDJC.debugging) {
        const deckLabel = isLeftDeck ? 'Left (DeckA)' : 'Right (DeckB)';
        console.log(`[Active Deck Info] ${deckLabel}: Channel${deckNum} active (data1=0x${data1.toString(16).toUpperCase()}, data2=0x${data2.toString(16).toUpperCase()})`);
    }
};

////////////////////////////////////////////////////////////////////////
// SamplerBank - Manages a bank of samplers with dynamic target       //
////////////////////////////////////////////////////////////////////////
/**
 * VDJC.SamplerBank component to manage sampler bank controls
 * Supports dynamic target switching between Sampler1-64 and PreviewDeck1
 * 
 * @param {number} defaultTarget - Initial target (1-64 for Sampler, 65 for PreviewDeck1)
 * @param {number} channel - MIDI channel offset (0x04 for Bank A ch5, 0x05 for Bank B ch6)
 */
VDJC.SamplerBank = function(defaultTarget, channel) {
    components.ComponentContainer.call(this);
    
    // Available targets: Sampler1-64 (1-64) + PreviewDeck1 (65)
    this.availableTargets = [];
    for (let i = 1; i <= 64; i++) {
        this.availableTargets.push(i);
    }
    this.availableTargets.push(65); // PreviewDeck1
    
    // Current state
    this.currentTarget = defaultTarget;
    this.channel = channel;
    this.currentDeck = this.getGroupFromTarget(this.currentTarget);
    
    if (VDJC.debugging) {
        console.log(`[SamplerBank] Initializing Bank on channel ${channel} with target ${this.currentTarget} (${this.currentDeck})`);
    }
    midi.sendShortMsg(0xB0 | this.channel, 0x7F, this.currentTarget); // Invia stato iniziale al controller

    //Buttons

    this.playButton = new components.PlayButton({
        midi: [0x90 | channel, 0x01],
        group: this.currentDeck,
        outConnect: true,
        outTrigger: false,
        connections: [],
        output: function(value, group, _key) {
            const playStutter = engine.getValue(group, 'play_stutter') > 0;
            const playIndicator = engine.getValue(group, 'play_indicator') > 0;
            const isReverse = engine.getValue(group, 'reverse') > 0;
            
            let velocity;
            if (!playStutter) {
                velocity = isReverse ? 0x10 : 0x00;
            } else if (playStutter && !playIndicator) {
                velocity = isReverse ? 0x50 : 0x40;
            } else {
                velocity = isReverse ? 0x60 : 0x7F;
            }
            
            midi.sendShortMsg(this.midi[0], this.midi[1], velocity);
        },
        connect: function() {
            this.connections[0] = engine.makeConnection(this.group, 'play_stutter', this.output.bind(this));
            this.connections[1] = engine.makeConnection(this.group, 'play_indicator', this.output.bind(this));
            this.connections[2] = engine.makeConnection(this.group, 'reverse', this.output.bind(this));
        },
        disconnect: function() {
            if (this.connections[0]) this.connections[0].disconnect();
            if (this.connections[1]) this.connections[1].disconnect();
            if (this.connections[2]) this.connections[2].disconnect();
            this.connections = [];
        },
        trigger: function() {
            if (this.connections[0] !== undefined) {
                this.connections.forEach(function(conn) { conn.trigger(); });
            }
        }
    });

    this.cueButton = new components.CueButton({
        midi: [0x90 | channel, 0x02],
        group: this.currentDeck,
        reverseRollOnShift: VDJC.reverseRollOnShiftCue,
    }); 

    this.syncLeaderButton = new components.Button({
        midi: [0x90 | channel, 0x5E],
        group: this.currentDeck,
        key: 'sync_leader',
        type: components.Button.prototype.types.toggle,
    });
    
    this.syncButton = new components.Button({
        midi: [0x90 | channel, 0x5F],
        group: this.currentDeck,
        outKey: 'sync_enabled',
        type: components.Button.prototype.types.powerWindow,
        unshift: function() {
            this.input = function(channel, control, value, status, _group) {
                if (this.isPress(channel, control, value, status)) {
                    if (engine.getValue(this.group, `sync_enabled`) === 0) {
                        engine.setValue(this.group, `beatsync`, 1);
                        this.longPressTimer = engine.beginTimer(this.longPressTimeout, () => {
                            engine.setValue(this.group, `sync_enabled`, 1);
                            this.longPressTimer = NO_TIMER;
                        }, true);
                    } else {
                        engine.setValue(this.group, `sync_enabled`, 0);
                    }
                } else {
                    if (this.longPressTimer !== NO_TIMER) {
                        engine.stopTimer(this.longPressTimer);
                        this.longPressTimer = NO_TIMER;
                    }
                }
            };
        },
        shift: function() {
            this.input = function(channel, control, value, status, _group) {
                if (this.isPress(channel, control, value, status)) {
                    this.isLongPressed = false;
                    this.longPressTimer = engine.beginTimer(this.longPressTimeout, () => {
                        this.isLongPressed = true;
                        engine.setValue(this.group, `sync_mode`, 0);
                        this.longPressTimer = NO_TIMER;
                    }, true);
                } else {
                    if (this.longPressTimer !== NO_TIMER) {
                        engine.stopTimer(this.longPressTimer);
                        this.longPressTimer = NO_TIMER;
                    }
                    if (!this.isLongPressed) {
                        engine.setValue(this.group, `sync_mode`, 1);
                    }
                    this.isLongPressed = false;
                }
            };
        },
    });
    
    this.repeatButton = new components.Button({
        midi: [0x90 | channel, 0x04],
        group: this.currentDeck,
        key: 'repeat',
        type: components.Button.prototype.types.toggle,
    });
    
    this.syncKeyButton = new components.Button({
        midi: [0x90 | channel, 0x5E],
        group: this.currentDeck,
        key: 'sync_key',
        type: components.Button.prototype.types.toggle,
    }); 

    this.keylockButton = new components.Button({
        midi: [0x90 | channel, 0x5D],
        group: this.currentDeck,
        key: 'keylock',
        type: components.Button.prototype.types.toggle,
    });

    this.quantizeButton = new components.Button({
        midi: [0x90 | channel, 0x5C],
        group: this.currentDeck,
        key: 'quantize',
        type: components.Button.prototype.types.toggle,
    });

    this.slipButton = new components.Button({
        midi: [0x90 | channel, 0x5A],
        group: this.currentDeck,
        key: 'slip_enabled',
        type: components.Button.prototype.types.toggle,
    });
    
    this.tapButton = new components.Button({
        midi: [0x90 | channel, 0x5B],
        group: this.currentDeck,
        key: 'tempo_tap',
        outConnect: false,
        outTrigger: false,
        connect: function() {},
        trigger: function() {}
    });
    
    this.beatgridButton = new components.Button({
        midi: [0x90 | channel, 0x60],
        group: this.currentDeck,
        unshift: function() {
            this.inKey = 'beats_translate_curpos';
        },
        shift: function() {
            this.inKey = 'beats_undo_adjustment';
        },
        outKey: 'beats_translate_curpos',
    });
    
    this.pflButton = new components.Button({
        midi: [0x90 | channel, 0x00],
        group: this.currentDeck,
        key: 'pfl',
        type: components.Button.prototype.types.toggle,
    });
    
    this.ejectButton = new components.Button({
        midi: [0x90 | channel, 0x03],
        group: this.currentDeck,
        key: 'eject',
        type: components.Button.prototype.types.push,
    });

    // NOTA: FX Assignment Buttons non disponibili per Samplers in Mixxx
    // I Samplers usano invece la griglia SamplerGrid nel Layout EFFECTS
    // per gestire manualmente l'assegnamento agli EffectUnit

    //Hotcues Buttons
    var hotcues = [];
    for (var i = 1; i <= 16; i++) {
        hotcues[i] = new components.HotcueButton({
            midi: [0x90 | channel, 0x0A + i],
            number: i,
            group: this.currentDeck,
            sendStatusAndType: true,
            outValueScale: function(value) {
                return (value > 1) ? 0x7F : 0x00;
            }
        });
    };
    this.hotcues = hotcues;

    this.orientationButton = new components.Button({
        midi: [0x90 | channel, 0x42],
        group: this.currentDeck,
        key: 'orientation',
        type: components.Button.prototype.types.push,
        input: function(channel, control, value, status, group) {
            if (value) {
                let currentOrientation = engine.getValue(group, this.key);
                let next = (currentOrientation + 1) % 3;
                engine.setValue(group, this.key, next);
            }
        },
        output: function(value, group, key) {
            midi.sendShortMsg(this.midi[0], this.midi[1], value);
        }
    });

    this.beatloopToggleButton = new components.BeatloopToggleButton({
        midi: [0x90 | channel, 0x33],
        group: this.currentDeck,
    });

    this.reloopToggleButton = new components.ReloopToggleButton({
        midi: [0x90 | channel, 0x37],
        group: this.currentDeck,
    });

    this.loopInButton = new components.LoopInButton({
        midi: [0x90 | channel, 0x34],
        group: this.currentDeck,
    });

    this.loopOutButton = new components.LoopOutButton({
        midi: [0x90 | channel, 0x35],
        group: this.currentDeck,
    });

    this.loopAnchorButton = new components.LoopAnchorButton({
        midi: [0x90 | channel, 0x36],
        group: this.currentDeck,
    });

    this.loopDoubleButton = new components.LoopDoubleButton({
        midi: [0x90 | channel, 0x38],
        group: this.currentDeck,
    });

    this.loopHalveButton = new components.LoopHalveButton({
        midi: [0x90 | channel, 0x39],
        group: this.currentDeck,
    });

    this.beatjumpBackwardButton = new components.BeatjumpBackwardButton({
        midi: [0x90 | channel, 0x3B],
        group: this.currentDeck,
    });

    this.beatjumpForwardButton = new components.BeatjumpForwardButton({
        midi: [0x90 | channel, 0x3A],
        group: this.currentDeck,
    });

    this.beatjumpSizeDoubleButton = new components.BeatjumpSizeDoubleButton({
        midi: [0x90 | channel, 0x3C],
        group: this.currentDeck,
    });

    this.beatjumpSizeHalveButton = new components.BeatjumpSizeHalveButton({
        midi: [0x90 | channel, 0x3D],
        group: this.currentDeck,
    });
    // NOTA: EQ Kill buttons e QuickEffect Enable non disponibili per Samplers in Mixxx
    // I seguenti componenti sono stati rimossi:
    // - EQHighKillButton
    // - EQMidKillButton
    // - EQLowKillButton
    // - QuickEffectEnableButton

    this.BeatloopSizeLabel = new components.Label({
        midi: [0xB0 | channel, 0x31],
        group: this.currentDeck,
        key: 'beatloop_size',
        output: function(value, group, key) {
            const valueMap = {
                0.03125: 0x01, 0.0625: 0x02, 0.125: 0x03, 0.25: 0x04,
                0.5: 0x05, 1: 0x06, 2: 0x07, 4: 0x08, 8: 0x09,
                16: 0x0A, 32: 0x0B, 64: 0x0C, 128: 0x0D, 256: 0x0E, 512: 0x0F
            };
            
            const dataByte = valueMap[value];
            if (dataByte === undefined) return;
            
            midi.sendShortMsg(this.midi[0], 0x31, dataByte);
        }
    });

    this.BeatjumpSizeLabel = new components.Label({
        midi: [0xB0 | channel, 0x32],
        group: this.currentDeck,
        key: 'beatjump_size',
        outConnect: true,
        outTrigger: true,
        output: function(value, group, key) {
            const valueMap = {
                0.03125: 0x01, 0.0625: 0x02, 0.125: 0x03, 0.25: 0x04,
                0.5: 0x05, 1: 0x06, 2: 0x07, 4: 0x08, 8: 0x09,
                16: 0x0A, 32: 0x0B, 64: 0x0C, 128: 0x0D, 256: 0x0E, 512: 0x0F
            };
            
            const dataByte = valueMap[value];
            if (dataByte === undefined) return;
            
            midi.sendShortMsg(this.midi[0], 0x32, dataByte);
        }
    });
    
    // Faders e Encoders
    this.volumeFader = new components.Encoder({
        midi: [0xB0 | channel, 0x1E],
        group: this.currentDeck,
        key: 'volume',
        outConnect: true,
        outTrigger: true,
    });

    this.tempoFader = new components.Encoder({
        midi: [0xB0 | channel, 0x1D],
        group: this.currentDeck,
        key: 'rate',
        outConnect: true,
        outTrigger: true,
        softTakeover: false,
    });

    this.pregainEncoder = new components.Encoder({
        midi: [0xB0 | channel, 0x00],
        group: this.currentDeck,
        key: 'pregain',
        outConnect: true,
        outTrigger: true,
        softTakeover: false,
    });

    // NOTA: EQ encoders e QuickEffect encoder non disponibili per Samplers in Mixxx
    // I seguenti componenti sono stati rimossi:
    // - highEncoder (EQ High)
    // - midEncoder (EQ Mid)
    // - lowEncoder (EQ Low)
    // - super1Encoder (QuickEffect)
    
    // Jogwheel
    const alpha = 1/8;
    this.jogWheel = new components.JogWheelBasic({
        midi: [0xB0 | channel, 0x1B || 0x0A],
        group: this.currentDeck,
        deck: 1, // Will be updated on target change
        wheelResolution: 800,
        alpha: alpha,
        beta: alpha/32,
        rpm: 33 + 1/3,
    });

    // VuMeter per Sampler Bank (opzionale)
    this.vuMeter = new components.Button({
        midi: [0xB0 | channel, 0x20],
        group: this.currentDeck,
        key: 'vu_meter',
        output: function(value, group, key) {
            onVuMeterChange(value, group, key)
        }
    });
};

// Estende il prototipo di components.ComponentContainer
VDJC.SamplerBank.prototype = Object.create(components.ComponentContainer.prototype);
VDJC.SamplerBank.prototype.constructor = VDJC.SamplerBank;

/**
 * Converte target number in group string Mixxx
 * @param {number} target - 1-64 per Sampler, 65 per PreviewDeck1
 * @returns {string} Group string (es. "[Sampler1]", "[PreviewDeck1]")
 */
VDJC.SamplerBank.prototype.getGroupFromTarget = function(target) {
    if (target >= 1 && target <= 64) {
        return "[Sampler" + target + "]";
    } else if (target === 65) {
        return "[PreviewDeck1]";
    }
    return "[Sampler1]"; // fallback
};

/**
 * Cambia il target del Sampler Bank
 * @param {number} newTarget - Nuovo target (1-64 per Sampler, 65 per PreviewDeck1)
 */
VDJC.SamplerBank.prototype.setTarget = function(newTarget) {
    if (this.currentTarget === newTarget) {
        if (VDJC.debugging) {
            console.log(`[SamplerBank] Target already set to ${newTarget}, skipping`);
        }
        return;
    }
    
    const oldDeck = this.currentDeck;
    const newDeck = this.getGroupFromTarget(newTarget);
    
    if (VDJC.debugging) {
        console.log(`[SamplerBank] Switching target: ${this.currentTarget} (${oldDeck}) → ${newTarget} (${newDeck})`);
    }
    
    // Disconnetti tutti i componenti dal vecchio group
    this.forEachComponent(function(component) {
        if (component.group === oldDeck) {
            component.disconnect();
        }
    });
    
    // Aggiorna target e group
    this.currentTarget = newTarget;
    this.currentDeck = newDeck;
    
    // Aggiorna group di tutti i componenti e riconnetti
    this.forEachComponent(function(component) {
        // Salta JogWheel - gestito manualmente sotto (ha un connect() speciale che non funziona con Samplers)
        if (component === this.jogWheel) {
            return;
        }
        
        // Salta componenti senza midi definito o con midi null/non-array
        // (es. Label, sub-componenti JogWheel, helper components)
        if (!component.midi || !Array.isArray(component.midi) || component.midi.length < 2) {
            return;
        }
        
        // Aggiorna group principale (tutti i componenti usano il sampler group direttamente)
        component.group = newDeck;
        
        // Riconnetti e trigger
        component.connect();
        component.trigger();
    }.bind(this));
    
    // Aggiorna JogWheel group e riconnetti (ora supporta [SamplerN] e [PreviewDeckN])
    if (this.jogWheel) {
        this.jogWheel.group = newDeck;
        this.jogWheel.connect();  // Estrae correttamente deck number da [SamplerN]/[PreviewDeckN]
    }
    
    // Riconnetti manualmente i Label (hanno midi ma potrebbero non essere iterati correttamente)
    if (this.BeatloopSizeLabel && this.BeatloopSizeLabel.midi) {
        this.BeatloopSizeLabel.group = newDeck;
        this.BeatloopSizeLabel.connect();
        this.BeatloopSizeLabel.trigger();
    }
    if (this.BeatjumpSizeLabel && this.BeatjumpSizeLabel.midi) {
        this.BeatjumpSizeLabel.group = newDeck;
        this.BeatjumpSizeLabel.connect();
        this.BeatjumpSizeLabel.trigger();
    }
    
    if (VDJC.debugging) {
        console.log(`[SamplerBank] Target switch complete, all components reconnected to ${newDeck}`);
    }
};

/**
 * Gestisce lo shift button del controller
 */
VDJC.SamplerBank.prototype.handleShift = function(isShifted) {
    this.forEachComponent(function(component) {
        if (component.shift !== undefined) {
            if (isShifted) {
                component.shift();
            } else {
                component.unshift();
            }
        }
    });
};

////////////////////////////////////////////////////////////////////////
// SamplerGrid Component - Manages sampler effect assignments        //
////////////////////////////////////////////////////////////////////////
/**
 * Component per gestire le assegnazioni Effect Unit → Sampler (griglia 8x8)
 * Invia feedback MIDI per tutti i 64 sampler via Note On 0x99 0x0C
 * Encoding: data2 = (samplerNum * 2) - 2 + (isAssigned ? 1 : 0)
 */
VDJC.SamplerGrid = function(unitNumber) {
    components.Component.call(this);
    
    this.unitNumber = unitNumber;
    this.group = `[EffectRack1_EffectUnit${unitNumber}]`;
    
    // Non ha MIDI input - è solo output
    this.midi = [0x99, 0x0C];
    
    // Array per tenere traccia delle connessioni
    this.samplerConnections = [];
};

VDJC.SamplerGrid.prototype = Object.create(components.Component.prototype);

/**
 * Invia lo stato di assegnazione per un singolo sampler
 */
VDJC.SamplerGrid.prototype.sendSamplerState = function(samplerNum, isAssigned) {
    const data2 = (samplerNum * 2) - 2 + (isAssigned ? 1 : 0);
    midi.sendShortMsg(0x99, 0x0C, data2);
    
    if (VDJC.debugging) {
        console.log(`[Sampler Grid Unit${this.unitNumber}] Sampler${samplerNum}: ${isAssigned ? 'ON' : 'OFF'} (data2=0x${data2.toString(16).toUpperCase()})`);
    }
};

/**
 * Connette il componente - crea engine connections per tutti i 64 sampler
 */
VDJC.SamplerGrid.prototype.connect = function() {
    if (this.samplerConnections.length > 0) {
        // Già connesso
        return;
    }
    
    for (let sp = 1; sp <= 64; sp++) {
        const samplerNum = sp; // Closure per catturare il valore corretto
        const connection = engine.makeConnection(
            this.group,
            `group_[Sampler${samplerNum}]_enable`,
            (value) => {
                this.sendSamplerState(samplerNum, value > 0);
            }
        );
        this.samplerConnections.push(connection);
    }
    
    if (VDJC.debugging) {
        console.log(`[Sampler Grid Unit${this.unitNumber}] Connected 64 sampler assignments`);
    }
};

/**
 * Disconnette il componente - rimuove tutte le engine connections
 */
VDJC.SamplerGrid.prototype.disconnect = function() {
    for (let i = 0; i < this.samplerConnections.length; i++) {
        this.samplerConnections[i].disconnect();
    }
    this.samplerConnections = [];
    
    if (VDJC.debugging) {
        console.log(`[Sampler Grid Unit${this.unitNumber}] Disconnected sampler assignments`);
    }
};

/**
 * Trigger manuale - invia lo stato di tutti i 64 sampler
 */
VDJC.SamplerGrid.prototype.trigger = function() {
    for (let sp = 1; sp <= 64; sp++) {
        const isAssigned = engine.getValue(this.group, `group_[Sampler${sp}]_enable`) > 0;
        this.sendSamplerState(sp, isAssigned);
    }
    
    if (VDJC.debugging) {
        console.log(`[Sampler Grid Unit${this.unitNumber}] Triggered all 64 sampler states`);
    }
};

////////////////////////////////////////////////////////////////////////
// EffectUnit New                                                    //
////////////////////////////////////////////////////////////////////////
// VDJC.EffectUnit component to manage all Effect Unit parameters 
VDJC.EffectUnit = function(unitNumbers) {
    components.EffectUnit.call(this, unitNumbers);
    this.unitNumbers = unitNumbers;
    this.currentUnitNumber = unitNumbers[0];
    this.group = "[EffectRack1_EffectUnit" + this.currentUnitNumber + "]";

    

    // ⚠️ CRITICAL ORDER: Invia PRIMA il messaggio di unit number (0x99 0x0E)
    // per sincronizzare Android con l'unit selezionata PRIMA del burst iniziale

    if (VDJC.debugging) {
        console.log(`[EffectUnit Init] Sending unit number FIRST: ${this.currentUnitNumber} via 0x99 0x0E`);
    }
    midi.sendShortMsg(0x99, 0x0E, this.currentUnitNumber);
    
/*
    // Label per mostrare l'EffectUnit attiva
    // Invia feedback MIDI su 0x99 0x0E con velocity modulata:
    // Unit 1 = 0x01, Unit 2 = 0x02, Unit 3 = 0x03, Unit 4 = 0x04
    this.effectUnitLabel = new components.Label({
        midi: [0x99, 0x0E],
        group: this.group,
        key: 'current_unit_number', // Proprietà custom che aggiorneremo manualmente
        outConnect: false, // Disabilita connessione automatica (gestito manualmente)
        outTrigger: false,  // Disabilita trigger automatico
        output: function(value, group, key) {
            // value è il numero dell'EffectUnit (1-4)
            const unitNumber = VDJC.effectUnit ? VDJC.effectUnit.currentUnitNumber : 1;
            // Invia feedback MIDI: velocity = numero unit (0x01-0x04)
            midi.sendShortMsg(0x99, 0x0E, unitNumber);
            
            if (VDJC.debugging) {
                console.log(`EffectUnit Label feedback: Unit ${unitNumber} (velocity: 0x${unitNumber.toString(16).padStart(2, '0').toUpperCase()})`);
            }
        }
    });
    */

    // Componenti per gestire num_parameters - Invia valore a VDJC via MIDI CC
    // VDJC gestirà la visibilità dinamica dei parametri nell'UI Android
    // CC 0xB9 0x30 = Effect 1 num_parameters (value 0-8)
    // CC 0xB9 0x31 = Effect 2 num_parameters (value 0-8)
    // CC 0xB9 0x32 = Effect 3 num_parameters (value 0-8)
    
    this.effect1NumParameters = new components.Pot({
        group: `[EffectRack1_EffectUnit${this.currentUnitNumber}_Effect1]`,
        key: 'num_parameters',
        input: function(channel, control, value, status, group) {
            // Non gestito - solo output
        },
        output: function(value, group, control) {
            if (VDJC.debugging) {
                console.log(`[Effect1] num_parameters = ${value} (sending CC 0xB9 0x30)`);
            }
            // Invia MIDI CC: canale 0xB9, controllo 0x30, valore 0-7
            midi.sendShortMsg(0xB9, 0x30, value);
        },
        outConnect: true,
        outTrigger: true
    });

    this.effect2NumParameters = new components.Pot({
        group: `[EffectRack1_EffectUnit${this.currentUnitNumber}_Effect2]`,
        key: 'num_parameters',
        input: function(channel, control, value, status, group) {
            // Non gestito - solo output
        },
        output: function(value, group, control) {
            if (VDJC.debugging) {
                console.log(`[Effect2] num_parameters = ${value} (sending CC 0xB9 0x31)`);
            }
            // Invia MIDI CC: canale 0xB9, controllo 0x31, valore 0-7
            midi.sendShortMsg(0xB9, 0x31, value);
        },
        outConnect: true,
        outTrigger: true
    });

    this.effect3NumParameters = new components.Pot({
        group: `[EffectRack1_EffectUnit${this.currentUnitNumber}_Effect3]`,
        key: 'num_parameters',
        input: function(channel, control, value, status, group) {
            // Non gestito - solo output
        },
        output: function(value, group, control) {
            if (VDJC.debugging) {
                console.log(`[Effect3] num_parameters = ${value} (sending CC 0xB9 0x32)`);
            }
            // Invia MIDI CC: canale 0xB9, controllo 0x32, valore 0-7
            midi.sendShortMsg(0xB9, 0x32, value);
        },
        outConnect: true,
        outTrigger: true
    });
    
    // num_button_parameters components - Invia numero di pulsanti disponibili (A/B/C)
    // CC 0xB9 0x33 = Effect 1 num_button_parameters (value 0-3)
    // CC 0xB9 0x34 = Effect 2 num_button_parameters (value 0-3)
    // CC 0xB9 0x35 = Effect 3 num_button_parameters (value 0-3)
    
    this.effect1NumButtonParameters = new components.Pot({
        group: `[EffectRack1_EffectUnit${this.currentUnitNumber}_Effect1]`,
        key: 'num_button_parameters',
        input: function(channel, control, value, status, group) {
            // Non gestito - solo output
        },
        output: function(value, group, control) {
            if (VDJC.debugging) {
                console.log(`[Effect1] num_button_parameters = ${value} (sending CC 0xB9 0x33)`);
            }
            // Invia MIDI CC: canale 0xB9, controllo 0x33, valore 0-3
            midi.sendShortMsg(0xB9, 0x33, value);
        },
        outConnect: true,
        outTrigger: true
    });

    this.effect2NumButtonParameters = new components.Pot({
        group: `[EffectRack1_EffectUnit${this.currentUnitNumber}_Effect2]`,
        key: 'num_button_parameters',
        input: function(channel, control, value, status, group) {
            // Non gestito - solo output
        },
        output: function(value, group, control) {
            if (VDJC.debugging) {
                console.log(`[Effect2] num_button_parameters = ${value} (sending CC 0xB9 0x34)`);
            }
            // Invia MIDI CC: canale 0xB9, controllo 0x34, valore 0-3
            midi.sendShortMsg(0xB9, 0x34, value);
        },
        outConnect: true,
        outTrigger: true
    });

    this.effect3NumButtonParameters = new components.Pot({
        group: `[EffectRack1_EffectUnit${this.currentUnitNumber}_Effect3]`,
        key: 'num_button_parameters',
        input: function(channel, control, value, status, group) {
            // Non gestito - solo output
        },
        output: function(value, group, control) {
            if (VDJC.debugging) {
                console.log(`[Effect3] num_button_parameters = ${value} (sending CC 0xB9 0x35)`);
            }
            // Invia MIDI CC: canale 0xB9, controllo 0x35, valore 0-3
            midi.sendShortMsg(0xB9, 0x35, value);
        },
        outConnect: true,
        outTrigger: true
    });
    // Sampler selection tracker (1-64)
    this.selectedSamplerIndex = 1;
    
    // Sampler Grid - Gestisce feedback assegnazioni Effect Unit → Sampler (8x8)
    // Eredita connect/disconnect/trigger da components.Component
    this.effectSamplerGrid = new VDJC.SamplerGrid(this.currentUnitNumber);


    // Aggiungi i pulsanti di assegnamento personalizzati
    this.unitAssignmentButtons.addButton("channel1", "group_[Channel1]_enable", [0x99, 0x0F]);
    this.unitAssignmentButtons.addButton("channel2", "group_[Channel2]_enable", [0x99, 0x10]);
    this.unitAssignmentButtons.addButton("channel3", "group_[Channel3]_enable", [0x99, 0x11]);
    this.unitAssignmentButtons.addButton("channel4", "group_[Channel4]_enable", [0x99, 0x12]);
    this.unitAssignmentButtons.addButton("master", "group_[Master]_enable", [0x99, 0x14]);
    this.unitAssignmentButtons.addButton("headphone", "group_[Headphone]_enable", [0x99, 0x15]);

    // Controlli fisici dell'EffectUnit dal controller
    // Pulsanti effetti 1-3 (enable)
    this.effect1Button = new components.Button({
        midi: [0x99, 0x06],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect1]",
        key: 'enabled',
        type: components.Button.prototype.types.toggle
    });

    this.effect2Button = new components.Button({
        midi: [0x99, 0x08],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect2]",
        key: 'enabled',
        type: components.Button.prototype.types.toggle
    });

    this.effect3Button = new components.Button({
        midi: [0x99, 0x0A],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect3]",
        key: 'enabled',
        type: components.Button.prototype.types.toggle
    });

    // Encoder per controlli effetti
    this.effect1Knob = new components.Encoder({
        midi: [0xB9, 0x08],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect1]",
        key: 'meta'
    });

    this.effect2Knob = new components.Encoder({
        midi: [0xB9, 0x0A], // Stesso CC, cambier? in base al focus
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect2]",
        key: 'meta'
    });

    this.effect3Knob = new components.Encoder({
        midi: [0xB9, 0x0C],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect3]",
        key: 'meta'
    });

    // Effect selector per ogni effetto (encoder a 3 stati con feedback)
    this.effect1Selector = new components.Encoder({
        midi: [0xB9, 0x09],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect1]",
        outKey: 'loaded_effect',
        inKey: 'effect_selector',
        outConnect: true,
        outTrigger: true,
        input: function(channel, control, value, status, group) {
            // Converti MIDI 0x7F=-1, 0x01=+1
            let delta = 0;
            if (value === 0x7F) {
                delta = -1;
            } else if (value === 0x01) {
                delta = 1;
            }
            if (delta !== 0) {
                engine.setValue(this.group, this.inKey, delta);
            }
        },
        output: function(value, group, control) {
            // loaded_effect è già un intero (0-23), invialo direttamente
            midi.sendShortMsg(this.midi[0], this.midi[1], value);
        }
    });

    this.effect2Selector = new components.Encoder({
        midi: [0xB9, 0x0B],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect2]",
        outKey: 'loaded_effect',
        inKey: 'effect_selector',
        outConnect: true,
        outTrigger: true,
        input: function(channel, control, value, status, group) {
            // Converti MIDI 0x7F=-1, 0x01=+1
            let delta = 0;
            if (value === 0x7F) {
                delta = -1;
            } else if (value === 0x01) {
                delta = 1;
            }
            if (delta !== 0) {
                engine.setValue(this.group, this.inKey, delta);
            }
        },
        output: function(value, group, control) {
            // loaded_effect è già un intero (0-23), invialo direttamente
            midi.sendShortMsg(this.midi[0], this.midi[1], value);
        }
    });

    this.effect3Selector = new components.Encoder({
        midi: [0xB9, 0x0D], // CC diverso per effect3
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect3]",
        outKey: 'loaded_effect',
        inKey: 'effect_selector',
        outConnect: true,
        outTrigger: true,
        input: function(channel, control, value, status, group) {
            // Converti MIDI 0x7F=-1, 0x01=+1
            let delta = 0;
            if (value === 0x7F) {
                delta = -1;
            } else if (value === 0x01) {
                delta = 1;
            }
            if (delta !== 0) {
                engine.setValue(this.group, this.inKey, delta);
            }
        },
        output: function(value, group, control) {
            // loaded_effect è già un intero (0-23), invialo direttamente
            midi.sendShortMsg(this.midi[0], this.midi[1], value);
        }
    });
    // Mix/DryWet knob
    this.mixKnob = new components.Encoder({
        midi: [0xB9, 0x0E],
        group: this.group,
        key: 'mix'
    });

    // Super1 knob (shift del mix)
    this.super1Knob = new components.Encoder({
        midi: [0xB9, 0x11],
        group: this.group,
        key: 'super1'
    });

    // Chain selector (encoder a 3 stati con feedback)
    this.chainSelector = new components.Encoder({
        midi: [0xB9, 0x10],
        group: this.group,
        outKey: 'loaded_chain_preset',
        inKey: 'chain_preset_selector',
        outConnect: true,
        outTrigger: true,
        input: function(channel, control, value, status, group) {
            // Converti MIDI 0x7F=-1, 0x01=+1
            let delta = 0;
            if (value === 0x7F) {
                delta = -1;
            } else if (value === 0x01) {
                delta = 1;
            }
            if (delta !== 0) {
                engine.setValue(this.group, this.inKey, delta);
            }
        },
        output: function(value, group, control) {
            // loaded_chain_preset è già un intero, invialo direttamente
            midi.sendShortMsg(this.midi[0], this.midi[1], value);
        }
    });

    // Mix mode button
    this.mixModeButton = new components.Button({
        midi: [0x99, 0x0B],
        group: this.group,
        key: 'mix_mode',
        type: components.Button.prototype.types.toggle
    });
    
    // Encoder per i parametri individuali degli effetti (parameter1-7)
    // Effect 1 Parameters
    this.effect1Parameter1 = new components.Encoder({
        midi: [0xB9, 0x12],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect1]",
        key: 'parameter1'
    });
    this.effect1Parameter2 = new components.Encoder({
        midi: [0xB9, 0x13],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect1]",
        key: 'parameter2'
    });
    this.effect1Parameter3 = new components.Encoder({
        midi: [0xB9, 0x14],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect1]",
        key: 'parameter3'
    });
    this.effect1Parameter4 = new components.Encoder({
        midi: [0xB9, 0x15],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect1]",
        key: 'parameter4'
    });
    this.effect1Parameter5 = new components.Encoder({
        midi: [0xB9, 0x16],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect1]",
        key: 'parameter5'
    });
    this.effect1Parameter6 = new components.Encoder({
        midi: [0xB9, 0x17],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect1]",
        key: 'parameter6'
    });
    this.effect1Parameter7 = new components.Encoder({
        midi: [0xB9, 0x18],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect1]",
        key: 'parameter7'
    });
    this.effect1Parameter8 = new components.Encoder({
        midi: [0xB9, 0x27],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect1]",
        key: 'parameter8'
    });

    // Effect 2 Parameters
    this.effect2Parameter1 = new components.Encoder({
        midi: [0xB9, 0x19],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect2]",
        key: 'parameter1'
    });
    this.effect2Parameter2 = new components.Encoder({
        midi: [0xB9, 0x1A],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect2]",
        key: 'parameter2'
    });
    this.effect2Parameter3 = new components.Encoder({
        midi: [0xB9, 0x1B],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect2]",
        key: 'parameter3'
    });
    this.effect2Parameter4 = new components.Encoder({
        midi: [0xB9, 0x1C],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect2]",
        key: 'parameter4'
    });
    this.effect2Parameter5 = new components.Encoder({
        midi: [0xB9, 0x1D],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect2]",
        key: 'parameter5'
    });
    this.effect2Parameter6 = new components.Encoder({
        midi: [0xB9, 0x1E],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect2]",
        key: 'parameter6'
    });
    this.effect2Parameter7 = new components.Encoder({
        midi: [0xB9, 0x1F],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect2]",
        key: 'parameter7'
    });
    this.effect2Parameter8 = new components.Encoder({
        midi: [0xB9, 0x2A],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect2]",
        key: 'parameter8'
    });

    // Effect 3 Parameters
    this.effect3Parameter1 = new components.Encoder({
        midi: [0xB9, 0x20],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect3]",
        key: 'parameter1'
    });
    this.effect3Parameter2 = new components.Encoder({
        midi: [0xB9, 0x21],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect3]",
        key: 'parameter2'
    });
    this.effect3Parameter3 = new components.Encoder({
        midi: [0xB9, 0x22],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect3]",
        key: 'parameter3'
    });
    this.effect3Parameter4 = new components.Encoder({
        midi: [0xB9, 0x23],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect3]",
        key: 'parameter4'
    });
    this.effect3Parameter5 = new components.Encoder({
        midi: [0xB9, 0x24],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect3]",
        key: 'parameter5'
    });
    this.effect3Parameter6 = new components.Encoder({
        midi: [0xB9, 0x25],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect3]",
        key: 'parameter6'
    });
    this.effect3Parameter7 = new components.Encoder({
        midi: [0xB9, 0x26],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect3]",
        key: 'parameter7'
    });
    this.effect3Parameter8 = new components.Encoder({
        midi: [0xB9, 0x2B],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect3]",
        key: 'parameter8'
    });

    // Button Parameters per gli effetti (aE1, bE1, cE1 - aE2, bE2, cE2 - aE3, bE3, cE3)
    // Effect 1 Button Parameters
    this.effect1ButtonParameter1 = new components.Button({
        midi: [0x99, 0x3A],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect1]",
        key: 'button_parameter1',
        type: components.Button.prototype.types.toggle
    });
    this.effect1ButtonParameter2 = new components.Button({
        midi: [0x99, 0x3B],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect1]",
        key: 'button_parameter2',
        type: components.Button.prototype.types.toggle
    });
    this.effect1ButtonParameter3 = new components.Button({
        midi: [0x99, 0x3C],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect1]",
        key: 'button_parameter3',
        type: components.Button.prototype.types.toggle
    });

    // Effect 2 Button Parameters
    this.effect2ButtonParameter1 = new components.Button({
        midi: [0x99, 0x60],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect2]",
        key: 'button_parameter1',
        type: components.Button.prototype.types.toggle
    });
    this.effect2ButtonParameter2 = new components.Button({
        midi: [0x99, 0x61],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect2]",
        key: 'button_parameter2',
        type: components.Button.prototype.types.toggle
    });
    this.effect2ButtonParameter3 = new components.Button({
        midi: [0x99, 0x62],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect2]",
        key: 'button_parameter3',
        type: components.Button.prototype.types.toggle
    });

    // Effect 3 Button Parameters
    this.effect3ButtonParameter1 = new components.Button({
        midi: [0x99, 0x2B],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect3]",
        key: 'button_parameter1',
        type: components.Button.prototype.types.toggle
    });
    this.effect3ButtonParameter2 = new components.Button({
        midi: [0x99, 0x30],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect3]",
        key: 'button_parameter2',
        type: components.Button.prototype.types.toggle
    });
    this.effect3ButtonParameter3 = new components.Button({
        midi: [0x99, 0x35],
        group: "[EffectRack1_EffectUnit" + this.currentUnitNumber + "_Effect3]",
        key: 'button_parameter3',
        type: components.Button.prototype.types.toggle
    });

    // Label Invert per i parametri degli effetti (iP1E1 - iP8E3)
    // Abilitato per VDJC: gestisce click su Invert box nel LinkTypeIndicator
    
    // Effect 1 Invert Labels
    this.effect1Invert1 = new VDJC.InvertLabel({
        midi: [0x99, 0x18],
        unitNumber: this.currentUnitNumber,
        effectNum: 1,
        paramNum: 1
    });
    this.effect1Invert2 = new VDJC.InvertLabel({
        midi: [0x99, 0x1D],
        unitNumber: this.currentUnitNumber,
        effectNum: 1,
        paramNum: 2
    });
    this.effect1Invert3 = new VDJC.InvertLabel({
        midi: [0x99, 0x22],
        unitNumber: this.currentUnitNumber,
        effectNum: 1,
        paramNum: 3
    });
    this.effect1Invert4 = new VDJC.InvertLabel({
        midi: [0x99, 0x27],
        unitNumber: this.currentUnitNumber,
        effectNum: 1,
        paramNum: 4
    });
    this.effect1Invert5 = new VDJC.InvertLabel({
        midi: [0x99, 0x2C],
        unitNumber: this.currentUnitNumber,
        effectNum: 1,
        paramNum: 5
    });
    this.effect1Invert6 = new VDJC.InvertLabel({
        midi: [0x99, 0x31],
        unitNumber: this.currentUnitNumber,
        effectNum: 1,
        paramNum: 6
    });
    this.effect1Invert7 = new VDJC.InvertLabel({
        midi: [0x99, 0x36],
        unitNumber: this.currentUnitNumber,
        effectNum: 1,
        paramNum: 7
    });
    this.effect1Invert8 = new VDJC.InvertLabel({
        midi: [0x99, 0x3D],
        unitNumber: this.currentUnitNumber,
        effectNum: 1,
        paramNum: 8
    });

    // Effect 2 Invert Labels
    this.effect2Invert1 = new VDJC.InvertLabel({
        midi: [0x99, 0x3E],
        unitNumber: this.currentUnitNumber,
        effectNum: 2,
        paramNum: 1
    });
    this.effect2Invert2 = new VDJC.InvertLabel({
        midi: [0x99, 0x43],
        unitNumber: this.currentUnitNumber,
        effectNum: 2,
        paramNum: 2
    });
    this.effect2Invert3 = new VDJC.InvertLabel({
        midi: [0x99, 0x48],
        unitNumber: this.currentUnitNumber,
        effectNum: 2,
        paramNum: 3
    });
    this.effect2Invert4 = new VDJC.InvertLabel({
        midi: [0x99, 0x4D],
        unitNumber: this.currentUnitNumber,
        effectNum: 2,
        paramNum: 4
    });
    this.effect2Invert5 = new VDJC.InvertLabel({
        midi: [0x99, 0x52],
        unitNumber: this.currentUnitNumber,
        effectNum: 2,
        paramNum: 5
    });
    this.effect2Invert6 = new VDJC.InvertLabel({
        midi: [0x99, 0x57],
        unitNumber: this.currentUnitNumber,
        effectNum: 2,
        paramNum: 6
    });
    this.effect2Invert7 = new VDJC.InvertLabel({
        midi: [0x99, 0x5C],
        unitNumber: this.currentUnitNumber,
        effectNum: 2,
        paramNum: 7
    });
    this.effect2Invert8 = new VDJC.InvertLabel({
        midi: [0x99, 0x63],
        unitNumber: this.currentUnitNumber,
        effectNum: 2,
        paramNum: 8
    });

    // Effect 3 Invert Labels
    this.effect3Invert1 = new VDJC.InvertLabel({
        midi: [0x99, 0x64],
        unitNumber: this.currentUnitNumber,
        effectNum: 3,
        paramNum: 1
    });
    this.effect3Invert2 = new VDJC.InvertLabel({
        midi: [0x99, 0x69],
        unitNumber: this.currentUnitNumber,
        effectNum: 3,
        paramNum: 2
    });
    this.effect3Invert3 = new VDJC.InvertLabel({
        midi: [0x99, 0x6E],
        unitNumber: this.currentUnitNumber,
        effectNum: 3,
        paramNum: 3
    });
    this.effect3Invert4 = new VDJC.InvertLabel({
        midi: [0x99, 0x73],
        unitNumber: this.currentUnitNumber,
        effectNum: 3,
        paramNum: 4
    });
    this.effect3Invert5 = new VDJC.InvertLabel({
        midi: [0x99, 0x78],
        unitNumber: this.currentUnitNumber,
        effectNum: 3,
        paramNum: 5
    });
    this.effect3Invert6 = new VDJC.InvertLabel({
        midi: [0x99, 0x05],
        unitNumber: this.currentUnitNumber,
        effectNum: 3,
        paramNum: 6
    });
    this.effect3Invert7 = new VDJC.InvertLabel({
        midi: [0x99, 0x17],
        unitNumber: this.currentUnitNumber,
        effectNum: 3,
        paramNum: 7
    });
    this.effect3Invert8 = new VDJC.InvertLabel({
        midi: [0x99, 0x7F],
        unitNumber: this.currentUnitNumber,
        effectNum: 3,
        paramNum: 8
    });

    // LinkType Labels (lP, mP, rP) - un componente gestisce tutti e 3 i label
    // Abilitato per VDJC: gestisce click su Middle box nel LinkTypeIndicator
    // VDJC gestirà la visualizzazione nell'UI Android
    
    // Effect 1 LinkType Labels (P1-P8)
    this.effect1Link1 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x1A],
        unitNumber: this.currentUnitNumber,
        effectNum: 1,
        paramNum: 1
    });
    this.effect1Link2 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x1F],
        unitNumber: this.currentUnitNumber,
        effectNum: 1,
        paramNum: 2
    });
    this.effect1Link3 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x24],
        unitNumber: this.currentUnitNumber,
        effectNum: 1,
        paramNum: 3
    });
    this.effect1Link4 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x29],
        unitNumber: this.currentUnitNumber,
        effectNum: 1,
        paramNum: 4
    });
    this.effect1Link5 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x2E],
        unitNumber: this.currentUnitNumber,
        effectNum: 1,
        paramNum: 5
    });
    this.effect1Link6 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x33],
        unitNumber: this.currentUnitNumber,
        effectNum: 1,
        paramNum: 6
    });
    this.effect1Link7 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x38],
        unitNumber: this.currentUnitNumber,
        effectNum: 1,
        paramNum: 7
    });
    this.effect1Link8 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x39],
        unitNumber: this.currentUnitNumber,
        effectNum: 1,
        paramNum: 8
    });

    // Effect 2 LinkType Labels (P1-P8)
    this.effect2Link1 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x40],
        unitNumber: this.currentUnitNumber,
        effectNum: 2,
        paramNum: 1
    });
    this.effect2Link2 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x45],
        unitNumber: this.currentUnitNumber,
        effectNum: 2,
        paramNum: 2
    });
    this.effect2Link3 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x4A],
        unitNumber: this.currentUnitNumber,
        effectNum: 2,
        paramNum: 3
    });
    this.effect2Link4 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x4F],
        unitNumber: this.currentUnitNumber,
        effectNum: 2,
        paramNum: 4
    });
    this.effect2Link5 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x54],
        unitNumber: this.currentUnitNumber,
        effectNum: 2,
        paramNum: 5
    });
    this.effect2Link6 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x59],
        unitNumber: this.currentUnitNumber,
        effectNum: 2,
        paramNum: 6
    });
    this.effect2Link7 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x5E],
        unitNumber: this.currentUnitNumber,
        effectNum: 2,
        paramNum: 7
    });
    this.effect2Link8 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x5F],
        unitNumber: this.currentUnitNumber,
        effectNum: 2,
        paramNum: 8
    });

    // Effect 3 LinkType Labels (P1-P8)
    this.effect3Link1 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x66],
        unitNumber: this.currentUnitNumber,
        effectNum: 3,
        paramNum: 1
    });
    this.effect3Link2 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x6B],
        unitNumber: this.currentUnitNumber,
        effectNum: 3,
        paramNum: 2
    });
    this.effect3Link3 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x70],
        unitNumber: this.currentUnitNumber,
        effectNum: 3,
        paramNum: 3
    });
    this.effect3Link4 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x75],
        unitNumber: this.currentUnitNumber,
        effectNum: 3,
        paramNum: 4
    });
    this.effect3Link5 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x7A],
        unitNumber: this.currentUnitNumber,
        effectNum: 3,
        paramNum: 5
    });
    this.effect3Link6 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x7E],
        unitNumber: this.currentUnitNumber,
        effectNum: 3,
        paramNum: 6
    });
    this.effect3Link7 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x21],
        unitNumber: this.currentUnitNumber,
        effectNum: 3,
        paramNum: 7
    });
    this.effect3Link8 = new VDJC.LinkTypeLabels({
        midi: [0x99, 0x7D],
        unitNumber: this.currentUnitNumber,
        effectNum: 3,
        paramNum: 8
    });
    
    // Inizializza l'EffectUnit (trigger burst MIDI)
    this.init();
    
}; // Fine costruttore VDJC.EffectUnit

// Estende il prototipo di components.EffectUnit
VDJC.EffectUnit.prototype = Object.create(components.EffectUnit.prototype);
VDJC.EffectUnit.prototype.constructor = VDJC.EffectUnit;

// Metodo per gestire il toggle dell'EffectUnit
VDJC.EffectUnit.prototype.toggleUnit = function() {
    // ⚠️ CRITICAL ORDER: Invia PRIMA il messaggio di toggle (0x99 0x0E) 
    // per sincronizzare Android con il nuovo unit number PRIMA del burst di messaggi MIDI
    
    // Calcola il prossimo unit number (simula la logica di toggle() senza eseguirla)
    let index = this.unitNumbers.indexOf(this.currentUnitNumber);
    if (index === (this.unitNumbers.length - 1)) {
        index = 0;
    } else {
        index += 1;
    }
    const newUnitNumber = this.unitNumbers[index];
    
    // STEP 1: Invia SUBITO il messaggio di toggle con il nuovo unit number
    if (VDJC.debugging) {
        console.log(`[EffectUnit Toggle] Sending unit number FIRST: ${newUnitNumber} via 0x99 0x0E`);
    }
    midi.sendShortMsg(0x99, 0x0E, newUnitNumber);
    
    // STEP 2: Delay 25ms per garantire che Android processi il messaggio 0x0E
    // PRIMA del burst di Invert/LinkType/ButtonParams
    // Aumentato da 10ms a 25ms per gestire latenze variabili (WiFi + processing)
    const self = this;
    engine.beginTimer(25, function() {
        // STEP 3: Disconnetti sampler grid del vecchio unit
        self.effectSamplerGrid.disconnect();
        
        // STEP 4: Ora esegui il toggle vero (cambio unit + reconnectComponents + burst MIDI)
        self.toggle();
    
        // STEP 5: Riconnetti sampler grid al nuovo Effect Unit
        self.effectSamplerGrid.unitNumber = newUnitNumber;
        self.effectSamplerGrid.group = `[EffectRack1_EffectUnit${newUnitNumber}]`;
        self.effectSamplerGrid.connect();
        self.effectSamplerGrid.trigger(); // Invia tutti i 64 stati

        // Aggiorna i componenti num_parameters per gestire il numero di parametri
        if (self.effect1NumParameters) {
            self.effect1NumParameters.disconnect();
            self.effect1NumParameters.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
            self.effect1NumParameters.connect();
            self.effect1NumParameters.trigger();
        }
        if (self.effect2NumParameters) {
            self.effect2NumParameters.disconnect();
            self.effect2NumParameters.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
            self.effect2NumParameters.connect();
            self.effect2NumParameters.trigger();
        }
        if (self.effect3NumParameters) {
            self.effect3NumParameters.disconnect();
            self.effect3NumParameters.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
            self.effect3NumParameters.connect();
            self.effect3NumParameters.trigger();
        }
    
        // Aggiorna i componenti num_button_parameters per gestire la visibilità dei button parameters
        if (self.effect1NumButtonParameters) {
            self.effect1NumButtonParameters.disconnect();
            self.effect1NumButtonParameters.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
            self.effect1NumButtonParameters.connect();
            self.effect1NumButtonParameters.trigger();
        }
        if (self.effect2NumButtonParameters) {
            self.effect2NumButtonParameters.disconnect();
            self.effect2NumButtonParameters.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
            self.effect2NumButtonParameters.connect();
            self.effect2NumButtonParameters.trigger();
        }
        if (self.effect3NumButtonParameters) {
            self.effect3NumButtonParameters.disconnect();
            self.effect3NumButtonParameters.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
            self.effect3NumButtonParameters.connect();
            self.effect3NumButtonParameters.trigger();
        }
    
        // Aggiorna i gruppi di tutti gli encoder dei parametri dopo il toggle
        // newUnitNumber gi\u00e0 calcolato sopra, self.currentUnitNumber \u00e8 stato aggiornato da toggle()
        
        // Aggiorna Effect1 Parameters
        if (self.effect1Parameter1) self.effect1Parameter1.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
        if (self.effect1Parameter2) self.effect1Parameter2.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
        if (self.effect1Parameter3) self.effect1Parameter3.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
        if (self.effect1Parameter4) self.effect1Parameter4.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
        if (self.effect1Parameter5) self.effect1Parameter5.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
        if (self.effect1Parameter6) self.effect1Parameter6.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
        if (self.effect1Parameter7) self.effect1Parameter7.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
        
        // Aggiorna Effect2 Parameters
        if (self.effect2Parameter1) self.effect2Parameter1.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
        if (self.effect2Parameter2) self.effect2Parameter2.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
        if (self.effect2Parameter3) self.effect2Parameter3.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
        if (self.effect2Parameter4) self.effect2Parameter4.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
        if (self.effect2Parameter5) self.effect2Parameter5.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
        if (self.effect2Parameter6) self.effect2Parameter6.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
        if (self.effect2Parameter7) self.effect2Parameter7.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
        
        // Aggiorna Effect3 Parameters
        if (self.effect3Parameter1) self.effect3Parameter1.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
        if (self.effect3Parameter2) self.effect3Parameter2.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
        if (self.effect3Parameter3) self.effect3Parameter3.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
        if (self.effect3Parameter4) self.effect3Parameter4.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
        if (self.effect3Parameter5) self.effect3Parameter5.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
        if (self.effect3Parameter6) self.effect3Parameter6.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
        if (self.effect3Parameter7) self.effect3Parameter7.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
        
        // Aggiorna Effect1 Button Parameters
        if (self.effect1ButtonParameter1) self.effect1ButtonParameter1.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
        if (self.effect1ButtonParameter2) self.effect1ButtonParameter2.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
        if (self.effect1ButtonParameter3) self.effect1ButtonParameter3.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
        
        // Aggiorna Effect2 Button Parameters
        if (self.effect2ButtonParameter1) self.effect2ButtonParameter1.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
        if (self.effect2ButtonParameter2) self.effect2ButtonParameter2.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
        if (self.effect2ButtonParameter3) self.effect2ButtonParameter3.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
        
        // Aggiorna Effect3 Button Parameters
        if (self.effect3ButtonParameter1) self.effect3ButtonParameter1.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
        if (self.effect3ButtonParameter2) self.effect3ButtonParameter2.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
        if (self.effect3ButtonParameter3) self.effect3ButtonParameter3.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
        
        // Aggiorna Effect1 Invert Labels
        if (self.effect1Invert1) {
            self.effect1Invert1.disconnect();
            self.effect1Invert1.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
            self.effect1Invert1.connect();
            self.effect1Invert1.trigger();
        }
        if (self.effect1Invert2) {
            self.effect1Invert2.disconnect();
            self.effect1Invert2.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
            self.effect1Invert2.connect();
            self.effect1Invert2.trigger();
        }
        if (self.effect1Invert3) {
            self.effect1Invert3.disconnect();
            self.effect1Invert3.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
            self.effect1Invert3.connect();
            self.effect1Invert3.trigger();
        }
        if (self.effect1Invert4) {
            self.effect1Invert4.disconnect();
            self.effect1Invert4.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
            self.effect1Invert4.connect();
            self.effect1Invert4.trigger();
        }
        if (self.effect1Invert5) {
            self.effect1Invert5.disconnect();
            self.effect1Invert5.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
            self.effect1Invert5.connect();
            self.effect1Invert5.trigger();
        }
        if (self.effect1Invert6) {
            self.effect1Invert6.disconnect();
            self.effect1Invert6.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
            self.effect1Invert6.connect();
            self.effect1Invert6.trigger();
        }
        if (self.effect1Invert7) {
            self.effect1Invert7.disconnect();
            self.effect1Invert7.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
            self.effect1Invert7.connect();
            self.effect1Invert7.trigger();
        }
        
        // Aggiorna Effect2 Invert Labels
        if (self.effect2Invert1) {
            self.effect2Invert1.disconnect();
            self.effect2Invert1.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
            self.effect2Invert1.connect();
            self.effect2Invert1.trigger();
        }
        if (self.effect2Invert2) {
            self.effect2Invert2.disconnect();
            self.effect2Invert2.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
            self.effect2Invert2.connect();
            self.effect2Invert2.trigger();
        }
        if (self.effect2Invert3) {
            self.effect2Invert3.disconnect();
            self.effect2Invert3.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
            self.effect2Invert3.connect();
            self.effect2Invert3.trigger();
        }
        if (self.effect2Invert4) {
            self.effect2Invert4.disconnect();
            self.effect2Invert4.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
            self.effect2Invert4.connect();
            self.effect2Invert4.trigger();
        }
        if (self.effect2Invert5) {
            self.effect2Invert5.disconnect();
            self.effect2Invert5.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
            self.effect2Invert5.connect();
            self.effect2Invert5.trigger();
        }
        if (self.effect2Invert6) {
            self.effect2Invert6.disconnect();
            self.effect2Invert6.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
            self.effect2Invert6.connect();
            self.effect2Invert6.trigger();
        }
        if (self.effect2Invert7) {
            self.effect2Invert7.disconnect();
            self.effect2Invert7.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
            self.effect2Invert7.connect();
            self.effect2Invert7.trigger();
        }
        
        // Aggiorna Effect3 Invert Labels
        if (self.effect3Invert1) {
            self.effect3Invert1.disconnect();
            self.effect3Invert1.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
            self.effect3Invert1.connect();
            self.effect3Invert1.trigger();
        }
        if (self.effect3Invert2) {
            self.effect3Invert2.disconnect();
            self.effect3Invert2.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
            self.effect3Invert2.connect();
            self.effect3Invert2.trigger();
        }
        if (self.effect3Invert3) {
            self.effect3Invert3.disconnect();
            self.effect3Invert3.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
            self.effect3Invert3.connect();
            self.effect3Invert3.trigger();
        }
        if (self.effect3Invert4) {
            self.effect3Invert4.disconnect();
            self.effect3Invert4.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
            self.effect3Invert4.connect();
            self.effect3Invert4.trigger();
        }
        if (self.effect3Invert5) {
            self.effect3Invert5.disconnect();
            self.effect3Invert5.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
            self.effect3Invert5.connect();
            self.effect3Invert5.trigger();
        }
        if (self.effect3Invert6) {
            self.effect3Invert6.disconnect();
            self.effect3Invert6.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
            self.effect3Invert6.connect();
            self.effect3Invert6.trigger();
        }
        if (self.effect3Invert7) {
            self.effect3Invert7.disconnect();
            self.effect3Invert7.group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
            self.effect3Invert7.connect();
            self.effect3Invert7.trigger();
        }
        
        // Aggiorna Effect1 LinkType Labels (componente unificato gestisce lP, mP, rP)
        const effect1LinkLabels = [
            'effect1Link1', 'effect1Link2', 'effect1Link3', 'effect1Link4', 'effect1Link5', 'effect1Link6', 'effect1Link7'
        ];
        effect1LinkLabels.forEach(labelName => {
            if (self[labelName]) {
                self[labelName].disconnect();
                self[labelName].group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect1]";
                self[labelName].connect();
                self[labelName].trigger();
            }
        });
        
        // Aggiorna Effect2 LinkType Labels
        const effect2LinkLabels = [
            'effect2Link1', 'effect2Link2', 'effect2Link3', 'effect2Link4', 'effect2Link5', 'effect2Link6', 'effect2Link7'
        ];
        effect2LinkLabels.forEach(labelName => {
            if (self[labelName]) {
                self[labelName].disconnect();
                self[labelName].group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect2]";
                self[labelName].connect();
                self[labelName].trigger();
            }
        });
        
        // Aggiorna Effect3 LinkType Labels
        const effect3LinkLabels = [
            'effect3Link1', 'effect3Link2', 'effect3Link3', 'effect3Link4', 'effect3Link5', 'effect3Link6', 'effect3Link7'
        ];
        effect3LinkLabels.forEach(labelName => {
            if (self[labelName]) {
                self[labelName].disconnect();
                self[labelName].group = "[EffectRack1_EffectUnit" + newUnitNumber + "_Effect3]";
                self[labelName].connect();
                self[labelName].trigger();
            }
        });
        
        if (VDJC.debugging) {
            console.log(`[EffectUnit Toggle] Effect Unit toggled to: ${self.currentUnitNumber} - All parameters updated`);
        }
    }, true); // one-shot timer
};
// Fine classe VDJC.EffectUnit

/******Handelrs per i pulsanti generici del controller******/

// Handler shiftButton centralizzato - gestisce il singolo pulsante shift del controller
VDJC.shiftButton = function(channel, control, value, status, group) {
    // Verifica che sia effettivamente il pulsante shift (status 0x9F, control 0x03)
    if (status !== 0x9F || control !== 0x03) {
        return;
    }
    
    const isShifted = (value > 0);
    
    // Gestione shift per i deck
    [VDJC.leftDeck, VDJC.rightDeck].forEach(function(deck) {
        if (deck && typeof deck.handleShift === 'function') {
            deck.handleShift(isShifted);
        }
    });
    
    // Gestione shift per i sampler banks
    [VDJC.samplerBankA, VDJC.samplerBankB].forEach(function(bank) {
        if (bank && typeof bank.handleShift === 'function') {
            bank.handleShift(isShifted);
        }
    });
    
    // Invia feedback MIDI ad Android per aggiornare stato visivo pulsante SHIFT
    // Note On 0x9F (CH16) 0x03 - value 0x7F=pressed, 0x00=released
    midi.sendShortMsg(0x9F, 0x03, isShifted ? 0x7F : 0x00);
    
    // Debug info se abilitato
    if (VDJC.debugging) {
        console.log(`Shift ${isShifted ? 'ON' : 'OFF'} applied to decks and samplers - MIDI feedback sent`);
    }
};

///////////////////////////////////////////////////////////////
//          Sampler Navigation MIDI Handlers (Android → Mixxx) //
///////////////////////////////////////////////////////////////

/**
 * Toggle assignment Effect Unit su un sampler specifico
 * MIDI: 0x99 0x0D data2=samplerNumber (1-64)
 * Toggles group_[SamplerN]_enable per l'EffectUnit corrente
 */
VDJC.samplerToggleAssignment = function(channel, control, value, status, group) {
    if (!value || value === 0) return; // Ignora note-off
    
    const samplerNumber = value; // velocity = sampler number (1-64)
    
    if (samplerNumber < 1 || samplerNumber > 64) {
        if (VDJC.debugging) {
            console.log(`[Sampler Toggle] Invalid sampler number: ${samplerNumber}`);
        }
        return;
    }
    
    if (!VDJC.effectUnit) {
        console.warn('[Sampler Toggle] EffectUnit non disponibile');
        return;
    }
    
    const samplerGroup = `[Sampler${samplerNumber}]`;
    const assignmentKey = `group_${samplerGroup}_enable`;
    
    // Toggle dell'assegnazione
    const currentValue = engine.getValue(VDJC.effectUnit.group, assignmentKey);
    engine.setValue(VDJC.effectUnit.group, assignmentKey, currentValue ? 0 : 1);
    
    if (VDJC.debugging) {
        console.log(`[Sampler Toggle] Unit${VDJC.effectUnit.currentUnitNumber} + Sampler${samplerNumber}: ${currentValue ? 'OFF' : 'ON'}`);
    }
};

/**
 * Change target di un Sampler Bank
 * MIDI: CC 0xB4 0x7F [target] per Bank A, CC 0xB5 0x7F [target] per Bank B
 * target: 1-64 per Sampler1-64, 65 per PreviewDeck1
 * 
 * Chiamato quando l'utente seleziona un nuovo target dal dropdown in Android
 * Invia MIDI feedback con lo stesso messaggio per confermare ricezione
 */
VDJC.samplerBankChangeTarget = function(channel, control, value, status, group) {
    // Determina quale bank in base al canale MIDI
    let bank = null;
    let bankName = '';
    
    if (status === 0xB4) {
        bank = VDJC.samplerBankA;
        bankName = 'Bank A';
    } else if (status === 0xB5) {
        bank = VDJC.samplerBankB;
        bankName = 'Bank B';
    } else  if (VDJC.debugging){
        console.log(`[SamplerBank Target] Invalid MIDI channel: 0x${status.toString(16)}`);
        return;
    }
    
    if (!bank) {
        if (VDJC.debugging) {
            console.log(`[SamplerBank Target] ${bankName} non disponibile`);
        }
        return;
    }
    
    // Valida target (1-64 per Sampler, 65 per PreviewDeck1)
    if (value < 1 || value > 65) {
        if (VDJC.debugging) {
            console.log(`[SamplerBank Target] Invalid target: ${value} (range: 1-65)`);
        }
        return;
    }
    
    // Cambia target
    const targetName = value <= 64 ? `Sampler${value}` : 'PreviewDeck1';
    
    if (VDJC.debugging) {
        console.log(`[SamplerBank Target] ${bankName}: Changing target to ${targetName} (${value})`);
    }
    
    bank.setTarget(value);
    
    if (VDJC.debugging) {
        console.log(`[SamplerBank Target] ${bankName}: Target changed successfully to ${bank.currentDeck}`);
    }
    
    // MIDI feedback: Invia conferma del target ad Android (stesso messaggio ricevuto)
    // Questo permette all'app di confermare che il target è stato applicato
    midi.sendShortMsg(status, control, value);
    
    if (VDJC.debugging) {
        console.log(`[SamplerBank Target] ${bankName}: MIDI feedback sent (0x${status.toString(16)} 0x${control.toString(16)} 0x${value.toString(16)})`);
    }
};

// Funzione di utilità per trovare il deck attivo in base allo status MIDI
function getDeckByStatus(status) {
    if (status === 0x90 || status === 0xB0) return VDJC.leftDeck;
    if (status === 0x91 || status === 0xB1) return VDJC.rightDeck;
    if (status === 0x94 || status === 0xB4) return VDJC.samplerBankA; // Channel 5
    if (status === 0x95 || status === 0xB5) return VDJC.samplerBankB; // Channel 6
    return null;
};


// Handler globale per la jogWheel turn
VDJC.jogW = function(channel, control, value, status, group) {
    const deck = getDeckByStatus(status);
    if (deck && deck.jogWheel) {
        if (status === 0xB0 || status === 0xB1 || status === 0xB4 || status === 0xB5) {
            deck.jogWheel.inputWheel(channel, control, value, status, deck.currentDeck);
        }
        if (status === 0x90 || status === 0x91 || status === 0x94 || status === 0x95) {
            deck.jogWheel.inputTouch(channel, control, value, status, deck.currentDeck);
        }
    }
};

///////////////////////////////////////////////////////////
//** Handler generico per i pulsanti tipo push dei Deck**//
///////////////////////////////////////////////////////////
function pushDeckButtonHandler(buttonName) {
    return function(channel, control, value, status, _group) {
        if (value == 0x00 || value == 0x7f) {
            const deck = getDeckByStatus(status);
            if (deck && deck[buttonName]) {
                const btns = deck[buttonName];
                if (Array.isArray(btns)) {
                    btns.forEach((btn, idx) => {
                        if (btn.midi[1] === control && typeof btn.input === `function`) {
                            btn.input(channel, control, value, status, deck.currentDeck);
                        }
                    });
                } else if (btns && typeof btns.input === `function` && btns.midi && btns.midi[1] === control) {
                    btns.input(channel, control, value, status, deck.currentDeck);
                }
            }
        }
    }
};
//***Lista Pulsanti push***//
VDJC.cueB                = pushDeckButtonHandler(`cueButton`); //(transport button)
VDJC.syncB               = pushDeckButtonHandler(`syncButton`); //(transport button)
// I pulsanti push a seguire, nel controller VDJC sono programmati in modalità *momentary*)
VDJC.syncKeyB            = pushDeckButtonHandler(`syncKeyButton`);
VDJC.BeatGridB           = pushDeckButtonHandler(`beatgridButton`); 
VDJC.pflB                = pushDeckButtonHandler(`pflButton`);
VDJC.keylockB            = pushDeckButtonHandler(`keylockButton`);
VDJC.quantizeB           = pushDeckButtonHandler(`quantizeButton`);
VDJC.slipB               = pushDeckButtonHandler(`slipButton`);
VDJC.FXAssignB           = pushDeckButtonHandler(`effectUnitAssignmentButtons`);
VDJC.tapB                = pushDeckButtonHandler(`tapButton`);
VDJC.hotcueB             = pushDeckButtonHandler(`hotcues`); 
VDJC.orientationB        = pushDeckButtonHandler(`orientationButton`);
VDJC.beatloopToggleB     = pushDeckButtonHandler(`beatloopToggleButton`);
VDJC.reloopToggleB       = pushDeckButtonHandler(`reloopToggleButton`);
VDJC.loopInB             = pushDeckButtonHandler(`loopInButton`);
VDJC.loopOutB            = pushDeckButtonHandler(`loopOutButton`);
VDJC.loopAnchorB         = pushDeckButtonHandler(`loopAnchorButton`);
VDJC.loopDoubleB         = pushDeckButtonHandler(`loopDoubleButton`);
VDJC.loopHalveB          = pushDeckButtonHandler(`loopHalveButton`);
VDJC.beatjumpBackwardB   = pushDeckButtonHandler(`beatjumpBackwardButton`);
VDJC.beatjumpForwardB    = pushDeckButtonHandler(`beatjumpForwardButton`);
VDJC.beatjumpSizeDoubleB = pushDeckButtonHandler(`beatjumpSizeDoubleButton`);
VDJC.beatjumpSizeHalveB  = pushDeckButtonHandler(`beatjumpSizeHalveButton`);
VDJC.introStartB         = pushDeckButtonHandler(`introStartButton`);
VDJC.introEndB           = pushDeckButtonHandler(`introEndButton`);
VDJC.outroStartB         = pushDeckButtonHandler(`outroStartButton`);
VDJC.outroEndB           = pushDeckButtonHandler(`outroEndButton`);
VDJC.EQHighKillB         = pushDeckButtonHandler(`EQHighKillButton`);
VDJC.EQMidKillB          = pushDeckButtonHandler(`EQMidKillButton`);
VDJC.EQLowKillB          = pushDeckButtonHandler(`EQLowKillButton`);
VDJC.QuickEffB           = pushDeckButtonHandler(`QuickEffectEnableButton`);
/////////////////////////////////////////////////////////////
//** Handler generico per i pulsanti tipo toggle dei Deck**//
/////////////////////////////////////////////////////////////
function toggleDeckButtonHandler(buttonName) {
    return function(channel, control, value, status, _group) {
        if (!value) return;
        const deck = getDeckByStatus(status);
        if (deck && deck[buttonName] && typeof deck[buttonName].input === `function`) {
            deck[buttonName].input(channel, control, value, status, deck.currentDeck);
        }
    }
};
//***Lista Pulsanti toggle***//
VDJC.playB      = toggleDeckButtonHandler(`playButton`); //(transport button)
VDJC.repeatB    = toggleDeckButtonHandler(`repeatButton`); //(transport button)
VDJC.ejectB     = toggleDeckButtonHandler(`ejectButton`); //(transport button)

// Handler generico per tutti i Potenziometri (Faders,Encoders): volume, tempo, ecc.
function encoderHandler(encoderName) {
    return function(channel, control, value, status, _group) {
        // Accetta tutti i valori tra 0x00 e 0x7F
        if (value >= 0x00 && value <= 0x7F) {
            const deck = getDeckByStatus(status);
            if (deck && deck[encoderName]) {
                if (typeof deck[encoderName].input === `function`) {
                    deck[encoderName].input(channel, control, value, status, deck.currentDeck);
                }
            }
        }
    }
};

// Associa gli handler generici ai faders e potenziometri del controller VDJC
VDJC.pregainEncoderE = encoderHandler(`pregainEncoder`);
VDJC.highEncoderE = encoderHandler(`highEncoder`);
VDJC.midEncoderE = encoderHandler(`midEncoder`);
VDJC.lowEncoderE = encoderHandler(`lowEncoder`);
VDJC.super1EncoderE = encoderHandler(`super1Encoder`);
VDJC.quickEffectPreset = encoderHandler(`quickEffectPreset`);
VDJC.volumeF = encoderHandler(`volumeFader`);
VDJC.tempoF = encoderHandler(`tempoFader`);

///////////////////////////////////////////////////////////////
//******Handler per i controlli dell'EffectUnit******//
///////////////////////////////////////////////////////////////

// Handler per i pulsanti degli effetti
function effectButtonHandler(buttonName) {
    return function(channel, control, value, status, _group) {
        if (value > 0) {
            if (!VDJC.effectUnit) {
                print("ERROR: VDJC.effectUnit non inizializzato!");
                return;
            }
            if (!VDJC.effectUnit[buttonName]) {
                print("ERROR: " + buttonName + " non trovato in effectUnit!");
                return;
            }
            if (typeof VDJC.effectUnit[buttonName].input === 'function') {
                VDJC.effectUnit[buttonName].input(channel, control, value, status, VDJC.effectUnit.group);
            } else {
                print("ERROR: " + buttonName + ".input non ? una funzione!");
            }
        }
    };
}

// Handler per gli encoder degli effetti (continui 0x00-0x7F)
function effectEncoderHandler(encoderName) {
    return function(channel, control, value, status, _group) {
        if (value >= 0x00 && value <= 0x7F && VDJC.effectUnit && VDJC.effectUnit[encoderName]) {
            if (typeof VDJC.effectUnit[encoderName].input === 'function') {
                VDJC.effectUnit[encoderName].input(channel, control, value, status, VDJC.effectUnit[encoderName].group);
            }
        }
    };
}

// Handler per gli encoder a 3 posizioni (0x7F=-1, 0x01=+1)
function effectsSelectorHandler(encoderName) {
    return function(channel, control, value, status, _group) {
        if (VDJC.effectUnit && VDJC.effectUnit[encoderName]) {
            let newValue = 0; // default = nessuna azione
            
            if (value === 0x7F) {
                newValue = -1; // prev
            } else if (value === 0x01) {
                newValue = 1;  // next
            }
            
            // Invia il valore convertito direttamente al controllo Mixxx
            const encoder = VDJC.effectUnit[encoderName];
            if (encoder && encoder.group && encoder.key) {
                engine.setValue(encoder.group, encoder.key, newValue);
            }
        }
    };
}

// Associa gli handler ai controlli dell'EffectUnit
VDJC.effect1B = effectButtonHandler('effect1Button');
VDJC.effect2B = effectButtonHandler('effect2Button');
VDJC.effect3B = effectButtonHandler('effect3Button');
VDJC.mixModeB = effectButtonHandler('mixModeButton');

VDJC.effect1E = effectEncoderHandler('effect1Knob');
VDJC.effect2E = effectEncoderHandler('effect2Knob');
VDJC.effect3E = effectEncoderHandler('effect3Knob');
VDJC.mixE = effectEncoderHandler('mixKnob');
VDJC.super1EffectE = effectEncoderHandler('super1Knob');

// Handler per i selettori di effetti (encoder a 3 stati con feedback)
VDJC.effect1SelectorE = function(channel, control, value, status, group) {
    if (VDJC.effectUnit && VDJC.effectUnit.effect1Selector) {
        VDJC.effectUnit.effect1Selector.input(channel, control, value, status, group);
    }
};
VDJC.effect2SelectorE = function(channel, control, value, status, group) {
    if (VDJC.effectUnit && VDJC.effectUnit.effect2Selector) {
        VDJC.effectUnit.effect2Selector.input(channel, control, value, status, group);
    }
};
VDJC.effect3SelectorE = function(channel, control, value, status, group) {
    if (VDJC.effectUnit && VDJC.effectUnit.effect3Selector) {
        VDJC.effectUnit.effect3Selector.input(channel, control, value, status, group);
    }
};
VDJC.chainPresetSelectorE = function(channel, control, value, status, group) {
    if (VDJC.effectUnit && VDJC.effectUnit.chainSelector) {
        VDJC.effectUnit.chainSelector.input(channel, control, value, status, group);
    }
};

// Handler per i pulsanti di assegnamento dell'EffectUnit
function unitAssignmentHandler(buttonName) {
    return function(channel, control, value, status, _group) {
        if (value > 0 && VDJC.effectUnit && VDJC.effectUnit.unitAssignmentButtons && VDJC.effectUnit.unitAssignmentButtons[buttonName]) {
            const button = VDJC.effectUnit.unitAssignmentButtons[buttonName];
            if (typeof button.input === 'function') {
                button.input(channel, control, value, status, button.group);
            }
        }
    };
}

// Handler per i pulsanti di assegnamento nel Layout EFFECTS di VDJC
VDJC.unitAssignChannel1B = unitAssignmentHandler('channel1');
VDJC.unitAssignChannel2B = unitAssignmentHandler('channel2');
VDJC.unitAssignChannel3B = unitAssignmentHandler('channel3');
VDJC.unitAssignChannel4B = unitAssignmentHandler('channel4');
VDJC.unitAssignMasterB = unitAssignmentHandler('master');
VDJC.unitAssignHeadphoneB = unitAssignmentHandler('headphone');

// Handler per il toggle dell'EffectUnit
VDJC.effectUnitToggleB = function(channel, control, value, status, group) {
    if (status == 0x99 && control == 0x0E && value > 0 && VDJC.effectUnit) {
        VDJC.effectUnit.toggleUnit();
    }
};

// Handler globali per i Button Parameters degli effetti
function buttonParameterHandler(buttonName) {
    return function(channel, control, value, status, group) {
        if (VDJC.effectUnit && VDJC.effectUnit[buttonName]) {
            VDJC.effectUnit[buttonName].input(channel, control, value, status, group);
        }
    };
}

// Effect 1 Button Parameters
VDJC.effect1ButtonParameter1 = buttonParameterHandler('effect1ButtonParameter1');
VDJC.effect1ButtonParameter2 = buttonParameterHandler('effect1ButtonParameter2');
VDJC.effect1ButtonParameter3 = buttonParameterHandler('effect1ButtonParameter3');

// Effect 2 Button Parameters
VDJC.effect2ButtonParameter1 = buttonParameterHandler('effect2ButtonParameter1');
VDJC.effect2ButtonParameter2 = buttonParameterHandler('effect2ButtonParameter2');
VDJC.effect2ButtonParameter3 = buttonParameterHandler('effect2ButtonParameter3');

// Effect 3 Button Parameters
VDJC.effect3ButtonParameter1 = buttonParameterHandler('effect3ButtonParameter1');
VDJC.effect3ButtonParameter2 = buttonParameterHandler('effect3ButtonParameter2');
VDJC.effect3ButtonParameter3 = buttonParameterHandler('effect3ButtonParameter3');

/**
 * Gestione dei VU Meter per il controller VDJC
 * Invia i valori MIDI corrispondenti per i VU Meter di Master e Channel.
 */
// Cache per throttling dei valori MIDI
const throttleCache = {};

function onVuMeterChange(value, group, key) {
    const meterId = `${group}_${key}`;
    let midiValue;

    // Adjust conversion logic based on value range - 24 segments resolution
    if (value < 0.9) {
        midiValue = Math.round(value * 20); // Multiply by 20 for range 0-0.9 (0-18)
    } else {
        midiValue = Math.round(value * 24); // Multiply by 24 for range 0.9-1 (18-24)
    }

    if (throttleCache[meterId] === midiValue) return;
    throttleCache[meterId] = midiValue;
    if (VDJC.debugging) {
        console.log(`VU Meter ${group} ${key} changed to:`, midiValue);
    }

    if (group === `[Main]`) {
        if (key === `vu_meter_left`) {
            midi.sendShortMsg(0xBF, 0x7E, midiValue);
        } else if (key === `vu_meter_right`) {
            midi.sendShortMsg(0xBF, 0x7F, midiValue);
        }
    } 
    if (group === `[Channel3]`) {
        if (key === `vu_meter`) {
            midi.sendShortMsg(0xB0, 0x7E, midiValue);
        }
    }
    if (group === `[Channel1]`) {
        if (key === `vu_meter`) {
            midi.sendShortMsg(0xB0, 0x7F, midiValue);
        }
    }
    if (group === `[Channel2]`) {
        if (key === `vu_meter`) {
            midi.sendShortMsg(0xB1, 0x7E, midiValue);
        }
    }
    if (group === `[Channel4]`) {
        if (key === `vu_meter`) {
            midi.sendShortMsg(0xB1, 0x7F, midiValue);
        }
    }
    
    // Sampler Bank A (MIDI Ch.5 - 0xB4 0x20)
    // Controlla se il group corrisponde al target attuale del Bank A
    if (VDJC.samplerBankA && group === VDJC.samplerBankA.currentDeck) {
        if (key === `vu_meter`) {
            midi.sendShortMsg(0xB4, 0x20, midiValue);
        }
    }
    
    // Sampler Bank B (MIDI Ch.6 - 0xB5 0x20)
    // Controlla se il group corrisponde al target attuale del Bank B
    if (VDJC.samplerBankB && group === VDJC.samplerBankB.currentDeck) {
        if (key === `vu_meter`) {
            midi.sendShortMsg(0xB5, 0x20, midiValue);
        }
    }
};
//script.toggleControl(string group, string key)
/////////////////////////////////////////////////////////////////
//******               Sezione Sampler                   ******//
/////////////////////////////////////////////////////////////////
/* DISABILITATO per VDJC - La SamplerBank funziona diversamente
const samplerPlayButtonsId = {
    1: { id: `SP1`, samplerIndex:1},
    2: { id: `SP2`, samplerIndex:2},
    3: { id: `SP3`, samplerIndex:3},
    4: { id: `SP4`, samplerIndex:4},
    5: { id: `SP5`, samplerIndex:5},
    6: { id: `SP6`, samplerIndex:6},
    7: { id: `SP7`, samplerIndex:7},
    8: { id: `SP8`, samplerIndex:8},
    9: { id: `SP9`, samplerIndex:9},
    10: { id: `SP10`, samplerIndex:10},
    11: { id: `SP11`, samplerIndex:11},
    12: { id: `SP12`, samplerIndex:12},
    13: { id: `SP13`, samplerIndex:13},
    14: { id: `SP14`, samplerIndex:14},
    15: { id: `SP15`, samplerIndex:15},
    16: { id: `SP16`, samplerIndex:16},
};
// Inizializzazione compatta dei sampler play buttons (1-16)
VDJC.samplerPlayButtons = [];
for (let samplerIndex = 1; samplerIndex <= 16; samplerIndex++) {
    const samplerButtonId = samplerPlayButtonsId[samplerIndex];
    
    VDJC.samplerPlayButtons[samplerIndex - 1] = new components.PlayButton({
        group: `[Sampler${samplerIndex}]`,
        // midi: [0x94, 0x01 + (samplerIndex - 1) * 7], // DISABILITATO per VDJC - usa SysEx
        colorByDirection: true, // Abilita il cambio colore per direzione
        sysexId: samplerButtonId ? samplerButtonId.id : undefined, // ID per SysEx
        // Output MIDI disabilitato per VDJC - la logica colorByDirection resta per SysEx:
        // - Invia colore diverso basato su direzione riproduzione (play/pause/reverse)
        // - Il componente PlayButton standard gestisce automaticamente gli stati
        output: function(value, group, control) {
            // TODO VDJC: Implementare invio SysEx con logica colorByDirection
            // if (this.colorByDirection) {
            //     // Invia colore basato su play_indicator e reverse
            //     // value: 0 = stopped, 1 = playing forward, -1 = playing reverse
            // }
        }
    });
}

// Handler generico per tutti i sampler play buttons
VDJC.SamplerPlayB = function(channel, control, value, status, group) {
    const samplerNumber = parseInt(group.match(/\[Sampler(\d+)\]/)[1]);
    const samplerButton = VDJC.samplerPlayButtons[samplerNumber - 1];
    
    if (samplerButton && value == 0x7F) {
        samplerButton.input(channel, control, value, status, group);
    }
};

VDJC.SamplerCuePlayB = function (channel, control, value, status, group) {
    if (value == 0x7F) {
        script.toggleControl(group, `cue_gotoandplay`)}
};
VDJC.SamplerCueB = function (channel, control, value, status, group) {
    if (value == 0x7F) {
        script.toggleControl(group, `cue_default`),
        engine.getValue(group,`cue_indicator`) ? midi.sendShortMsg(0x90 | channel, control, 0x00) : midi.sendShortMsg(0x90 | channel, control, 0x7F);
    } 
};// implementare make connection per il cue_indicator
VDJC.SamplerPflB = function (channel, control, value, status, group) {
    if (value == 0x7F) {
        script.toggleControl(group, `pfl`),
        engine.getValue(group,`pfl`) ? midi.sendShortMsg(0x90 | channel, control, 0x7F) : midi.sendShortMsg(0x90 | channel, control, 0x00);
    } 
};//ok
VDJC.SamplerEjectB = function (channel, control, value, status, group) {
    if (value == 0x7F) {
        script.toggleControl(group, `eject`),
        engine.getValue(group,`eject`) ? midi.sendShortMsg(0x90 | channel, control, 0x7F) : midi.sendShortMsg(0x90 | channel, control, 0x00);
    } 
};//ok
VDJC.SamplerRepeatB = function (channel, control, value, status, group) {
    if (value == 0x7F) {
        script.toggleControl(group, `repeat`),
        engine.getValue(group,`repeat`) ? midi.sendShortMsg(0x90 | channel, control, 0x7F) : midi.sendShortMsg(0x90 | channel, control, 0x00);
    } 
};//ok
VDJC.SamplerSyncB = function (channel, control, value, status, group) {
    if (value == 0x7F) {
        script.toggleControl(group, `beatsync`),
        engine.getValue(group,`sync_enabled`) ? midi.sendShortMsg(0x90 | channel, control, 0x00) : midi.sendShortMsg(0x90 | channel, control, 0x7F);
    } 
};// verificare se implementare la stessa logica del syncButton dei Decks e se implementare un cambio di colore del pulsante in dipendenza allo stato di sync_leader
////Encoder per il volume del Sampler
VDJC.SamplerVolumeE = function(channel, control, value, status, group) {
    if (value >= 0x00 && value <= 0x7F) {
        // Impostazione del valore del volume nel gruppo del Sampler
        engine.setParameter(group, `pregain`, value / 127);
    }
};//Da rivedere, non funziona + Implementare feedback visivo del volume del Sampler

// Gestione jogwheel dei Sampler (modo potenziometro con valori fissi).
// 0x01 = forward, 0x7F = backward.
VDJC.samplerWheelTurn = function(channel, control, value, status, group) {
    if (value === 0x01) {
        engine.setValue(group, `jog`, 1); // movimento indietro
    } else if (value === 0x7F) {
        engine.setValue(group, `jog`, -1); // movimento avanti
    }
};

// Interprete dei small_fader dei Sampler come controlli a 3 stati.
// Mapping:
//   Valore 0x00 => Stato 0
//   Valore 0x01-0x03 => Stato 1
//   Valore 0x04 => Stato 2
VDJC.orientation = function(channel, control, value, status, group) {
    var newvalue = 1; // default
    if (value < 1) {
        newvalue = 0;
    } else if (value > 3) {
        newvalue = 2;
    }
    engine.setValue(group,`orientation`,newvalue);
};
*/ // Fine sezione DISABILITATA - SamplerBank


// id per gli Hotcue Pad
const LeftDeckHotcuePad = {
    1: { id: `H1L`},
    2: { id: `H2L`},
    3: { id: `H3L`},
    4: { id: `H4L`},
    5: { id: `H5L`},
    6: { id: `H6L`},
    7: { id: `H7L`},
    8: { id: `H8L`},
    9: { id: `H9L`},
    10: { id: `H10L`},
    11: { id: `H11L`},
    12: { id: `H12L`},
    13: { id: `H13L`},
    14: { id: `H14L`},
    15: { id: `H15L`},
    16: { id: `H16L`},
};
const RightDeckHotcuePad = {
    1: { id: `H1R`},
    2: { id: `H2R`},
    3: { id: `H3R`},
    4: { id: `H4R`},
    5: { id: `H5R`},
    6: { id: `H6R`},
    7: { id: `H7R`},
    8: { id: `H8R`},
    9: { id: `H9R`},
    10: { id: `H10R`},
    11: { id: `H11R`},
    12: { id: `H12R`},
    13: { id: `H13R`},
    14: { id: `H14R`},
    15: { id: `H15R`},
    16: { id: `H16R`},
};
  
/**
 * Converte un valore numerico in stringa normalizzata per i label
 * Se value < 1, restituisce una frazione (es: 1/2, 1/4, 1/8)
 * Se value >= 1, restituisce il numero intero
 * Aggiunge spazi per stringhe < 4 caratteri per mantenere font consistente
 */
function normalizeValueToString(value) {
    let result;
    
    if (value >= 1) {
        result = `${Math.round(value)}`;
    } else {
        // Per valori < 1, trova la frazione pi? vicina
        const commonFractions = [
            { decimal: 0.03125, fraction: "1/32" },
            { decimal: 0.0625, fraction: "1/16" },
            { decimal: 0.125, fraction: "1/8" },
            { decimal: 0.25, fraction: "1/4" },
            { decimal: 0.5, fraction: "1/2" }
        ];
        
        // Trova la frazione pi? vicina
        let closestFraction = "1/32"; // default
        let minDifference = Math.abs(value - 0.03125);
        
        for (const frac of commonFractions) {
            const difference = Math.abs(value - frac.decimal);
            if (difference < minDifference) {
                minDifference = difference;
                closestFraction = frac.fraction;
            }
        }
        
        result = closestFraction;
    }
    
    return result;
};

///////////////////////////////////////////////////////////////
//******Funzioni globali per gli encoder dei parametri******//
///////////////////////////////////////////////////////////////

// Funzioni globali che vengono chiamate dall'XML mapping per i parameter encoders
// Queste reindirizzano le chiamate agli encoder dell'EffectUnit attualmente attivo

function parameter1(channel, control, value, status, group) {
    if (!VDJC.effectUnit) return;
    
    // Determina quale effetto basandosi sul controllo MIDI
    if (control >= 0x12 && control <= 0x18) {
        // Effect 1 Parameters (0x12-0x18)
        const paramNum = control - 0x12 + 1;
        const encoderName = `effect1Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    } else if (control >= 0x19 && control <= 0x1F) {
        // Effect 2 Parameters (0x19-0x1F)
        const paramNum = control - 0x19 + 1;
        const encoderName = `effect2Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    } else if (control >= 0x20 && control <= 0x26) {
        // Effect 3 Parameters (0x20-0x26)
        const paramNum = control - 0x20 + 1;
        const encoderName = `effect3Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    }
}

function parameter2(channel, control, value, status, group) {
    if (!VDJC.effectUnit) return;
    
    if (control >= 0x12 && control <= 0x18) {
        const paramNum = control - 0x12 + 1;
        const encoderName = `effect1Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    } else if (control >= 0x19 && control <= 0x1F) {
        const paramNum = control - 0x19 + 1;
        const encoderName = `effect2Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    } else if (control >= 0x20 && control <= 0x26) {
        const paramNum = control - 0x20 + 1;
        const encoderName = `effect3Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    }
}

function parameter3(channel, control, value, status, group) {
    if (!VDJC.effectUnit) return;
    
    if (control >= 0x12 && control <= 0x18) {
        const paramNum = control - 0x12 + 1;
        const encoderName = `effect1Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    } else if (control >= 0x19 && control <= 0x1F) {
        const paramNum = control - 0x19 + 1;
        const encoderName = `effect2Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    } else if (control >= 0x20 && control <= 0x26) {
        const paramNum = control - 0x20 + 1;
        const encoderName = `effect3Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    }
}

function parameter4(channel, control, value, status, group) {
    if (!VDJC.effectUnit) return;
    
    if (control >= 0x12 && control <= 0x18) {
        const paramNum = control - 0x12 + 1;
        const encoderName = `effect1Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    } else if (control >= 0x19 && control <= 0x1F) {
        const paramNum = control - 0x19 + 1;
        const encoderName = `effect2Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    } else if (control >= 0x20 && control <= 0x26) {
        const paramNum = control - 0x20 + 1;
        const encoderName = `effect3Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    }
}

function parameter5(channel, control, value, status, group) {
    if (!VDJC.effectUnit) return;
    
    if (control >= 0x12 && control <= 0x18) {
        const paramNum = control - 0x12 + 1;
        const encoderName = `effect1Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    } else if (control >= 0x19 && control <= 0x1F) {
        const paramNum = control - 0x19 + 1;
        const encoderName = `effect2Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    } else if (control >= 0x20 && control <= 0x26) {
        const paramNum = control - 0x20 + 1;
        const encoderName = `effect3Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    }
}

function parameter6(channel, control, value, status, group) {
    if (!VDJC.effectUnit) return;
    
    if (control >= 0x12 && control <= 0x18) {
        const paramNum = control - 0x12 + 1;
        const encoderName = `effect1Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    } else if (control >= 0x19 && control <= 0x1F) {
        const paramNum = control - 0x19 + 1;
        const encoderName = `effect2Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    } else if (control >= 0x20 && control <= 0x26) {
        const paramNum = control - 0x20 + 1;
        const encoderName = `effect3Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    }
}

function parameter7(channel, control, value, status, group) {
    if (!VDJC.effectUnit) return;
    
    if (control >= 0x12 && control <= 0x18) {
        const paramNum = control - 0x12 + 1;
        const encoderName = `effect1Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    } else if (control >= 0x19 && control <= 0x1F) {
        const paramNum = control - 0x19 + 1;
        const encoderName = `effect2Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    } else if (control >= 0x20 && control <= 0x26) {
        const paramNum = control - 0x20 + 1;
        const encoderName = `effect3Parameter${paramNum}`;
        if (VDJC.effectUnit[encoderName]) {
            VDJC.effectUnit[encoderName].input(channel, control, value, status, group);
        }
    }
}

///////////////////////////////////////////////////////////////
//******  Componente InvertLabel per Effect Parameters ******//
///////////////////////////////////////////////////////////////

/**
 * InvertLabel Component
 * Label toggle per inversione parametri effetto (iP1E1-iP7E3)
 * Estende Button con connessione automatica al CO parameterN_link_inverse
 */
VDJC.InvertLabel = function(options) {
    if (options.effectNum === undefined || options.paramNum === undefined) {
        console.warn("ERROR: InvertLabel richiede effectNum e paramNum");
        return;
    }
    
    this.effectNum = options.effectNum;
    this.paramNum = options.paramNum;
    this.group = "[EffectRack1_EffectUnit" + options.unitNumber + "_Effect" + this.effectNum + "]";
    this.inKey = "parameter" + this.paramNum + "_link_inverse";
    this.outKey = "parameter" + this.paramNum + "_link_inverse";
    
    // InvertLabel è un Label con StatusFeedback (rosso/grigio)
    options.labelType = 'StatusFeedback';
    options.colorActive = 0x7F;   // Rosso quando inverse=1
    options.colorInactive = 0x00; // Grigio quando inverse=0
    
    components.Label.call(this, options);
};

VDJC.InvertLabel.prototype = new components.Label({
    type: components.Button.prototype.types.toggle,
    
    input: function(channel, control, value, status, _group) {
        if (value > 0) {
            this.inToggle();
            
            if (VDJC.debugging) {
                console.log(`Invert P${this.paramNum}E${this.effectNum}: ${this.inGetValue() ? 'ON' : 'OFF'}`);
            }
        }
    },
});

///////////////////////////////////////////////////////////////
//****** Componenti LinkType Label per Effect Parameters ******//
///////////////////////////////////////////////////////////////

/**
 * LinkTypeLabels Component
 * Gestisce il click sul box Middle del LinkTypeIndicator
 * Cicla tra gli stati link_type: 0→1→2→3→4→0
 */
VDJC.LinkTypeLabels = function(options) {
    if (options.effectNum === undefined || options.paramNum === undefined) {
        console.warn("ERROR: LinkTypeLabels richiede effectNum e paramNum");
        return;
    }
    
    this.effectNum = options.effectNum;
    this.paramNum = options.paramNum;
    this.group = "[EffectRack1_EffectUnit" + options.unitNumber + "_Effect" + this.effectNum + "]";
    this.inKey = "parameter" + this.paramNum + "_link_type";
    this.outKey = "parameter" + this.paramNum + "_link_type";
    
    // LinkTypeLabels è un Label con StatusFeedback (cyan/grigio)
    options.labelType = 'StatusFeedback';
    options.colorActive = 0x7F;   // Cyan quando linkato
    options.colorInactive = 0x00; // Grigio quando non linkato
    
    components.Label.call(this, options);
};

VDJC.LinkTypeLabels.prototype = new components.Label({
    input: function(channel, control, value, status, _group) {
        if (value > 0) {
            // Cicla tra gli stati 0→1→2→3→4→0
            const currentValue = engine.getValue(this.group, this.inKey);
            const nextValue = (currentValue + 1) % 5;
            engine.setValue(this.group, this.inKey, nextValue);
            
            if (VDJC.debugging) {
                console.log(`LinkType P${this.paramNum}E${this.effectNum}: ${currentValue} → ${nextValue}`);
            }
        }
    },
    
    output: function(value, _group, _control) {
        // Invia il valore intero link_type (0-4) come data2
        // 0 = None, 1 = Linked, 2 = Linked Left, 3 = Linked Right, 4 = Linked Left Right
        this.send(value);
    }
});

///////////////////////////////////////////////////////////
//** Library Navigation - D-Pad + ScrollRing (CH 16)    **//
///////////////////////////////////////////////////////////

/**
 * Library Navigation UP
 * MIDI: 0x9F 0x10 0x7F
 * Mixxx: [Library], MoveUp
 */
VDJC.libraryNavUp = function(channel, control, value, status) {
    if (value === 0x7F) {  // Button press normal
        engine.setValue("[Library]", "MoveUp", 1);
    }
    if (value === 0x40) {  // Button press shifted
        engine.setValue("[Library]", "ScrollUp", 1);
    }
};

/**
 * Library Navigation DOWN
 * MIDI: 0x9F 0x11 0x7F
 * Mixxx: [Library], MoveDown
 */
VDJC.libraryNavDown = function(channel, control, value, status) {
    if (value === 0x7F) {  // Button press normal
        engine.setValue("[Library]", "MoveDown", 1);
    }
    if (value === 0x40) {  // Button press shifted
        engine.setValue("[Library]", "ScrollDown", 1);
    }
};

/**
 * Library Navigation LEFT (focus backward)
 * MIDI: 0x9F 0x12 0x7F
 * Mixxx: [Library], MoveFocusBackward
 */
VDJC.libraryNavLeft = function(channel, control, value, status) {
    if (value === 0x7F) {  // Button press normal
        engine.setValue("[Library]", "MoveLeft", 1);
    }
    if (value === 0x40) {  // Button press shifted
        engine.setValue("[Library]", "MoveFocusBackward", 1);
    }
};

/**
 * Library Navigation RIGHT (focus forward)
 * MIDI: 0x9F 0x13 0x7F
 * Mixxx: [Library], MoveFocusForward
 */
VDJC.libraryNavRight = function(channel, control, value, status) {
    if (value === 0x7F) {  // Button press normal
        engine.setValue("[Library]", "MoveRight", 1);
    }
    if (value === 0x40) {  // Button press shifted
        engine.setValue("[Library]", "MoveFocusForward", 1);
    }
};

/**
 * Library Navigation CENTER (load track)
 * MIDI: 0x9F 0x14 0x7F
 * Mixxx: [Library], GoToItem
 */
VDJC.libraryNavCenter = function(channel, control, value, status) {
    if (value === 0x7F) {  // Button press normal
        engine.setValue("[Library]", "GoToItem", 1);
    }
    if (value === 0x40) {  // Button press shifted
        engine.setValue("[Library]", "sort_focused_column", 1);
    }
};

/**
 * Library ScrollRing (continuous scrolling)
 * MIDI: 0xBF 0x10 (CC relative)
 * Mixxx: [Library], MoveVertical
 * 
 * CC relative encoding:
 * - 0x01-0x3F (1-63):   Clockwise (scroll down)
 * - 0x40-0x7F (64-127): Counter-clockwise (scroll up)
 */
VDJC.libraryScroll = function(channel, control, value, status) {
    var delta;
    
    if (value < 0x40) {
        // Clockwise: positive delta (scroll down)
        delta = value;
    } else {
        // Counter-clockwise: negative delta (scroll up)
        delta = value - 128;  // Convert 64-127 to -64 to -1
    }
    
    // MoveVertical accepts: -1 (up) or +1 (down) per step
    if (delta !== 0) {
        engine.setValue("[Library]", "MoveVertical", delta > 0 ? 1 : -1);
    }
};

/**
 * Library Focus Widget (set focus to tracks table)
 * MIDI: 0xBF 0x11 value=0x03
 * Mixxx: [Library], focused_widget
 * 
 * Triggered when opening Library Overlay to ensure tracks table has focus.
 * Values:
 * Value 1 = "Search Bar"
 * Value 2 = ""Browser tree view"
 * Value 3 = "Tracks table or root views of library features"
 * Value 0 = "none" (no widget focused, sent when closing overlay)
 */
VDJC.libraryFocusWidget = function(channel, control, value, status) {
    // Set focused_widget (0=none, 3=tracks table)
    if (channel !== 0xBF && control !== 0x11) return;
    engine.setValue("[Library]", "focused_widget", value);
};

/**
 * Library Show Maximized
 * MIDI: 0xBF 0x13 (CC binary/toggle)
 * Mixxx: [Skin], show_maximized_library
 * 
 * Values:
 * - 0x7F: Toggle maximize/restore (manual button)
 * - 0x01: Maximize library (sent when opening Library Overlay)
 * - 0x00: Restore normal view (sent when pressing BACK to Console)
 */
VDJC.showMaximizedLibrary = function(channel, control, value, status) {
    if (value === 0x7F) {
        // Toggle mode Library View
        script.toggleControl("[Skin]", "show_maximized_library");
    }
    if (value === 0x40) {
        // Toggle Cover Art View
        script.toggleControl("[Skin]", "show_library_coverart");
    }
    else {
        // Direct set mode (0x01 or 0x00)
        engine.setValue("[Skin]", "show_maximized_library", value);
    }
};

/**
 * Skin View - Toggle Effect Rack
 * MIDI: 0x9F 0x20 0x7F
 * Mixxx: [Skin], show_effectrack
 * Usa components.Button per feedback automatico
 */
VDJC.toggleEffectRack = function(channel, control, value, status) {
    if (VDJC.skinEffectRackButton) {
        VDJC.skinEffectRackButton.input(channel, control, value, status);
    }
};

/**
 * Skin View - Toggle Samplers
 * MIDI: 0x9F 0x21 0x7F
 * Mixxx: [Skin], show_samplers
 * Usa components.Button per feedback automatico
 */
VDJC.toggleSamplers = function(channel, control, value, status) {
    if (VDJC.skinSamplersButton) {
        VDJC.skinSamplersButton.input(channel, control, value, status);
    }
};

/**
 * Skin View - Toggle Vinyl Control
 * MIDI: 0x9F 0x22 0x7F
 * Mixxx: [Skin], show_vinylcontrol
 * Usa components.Button per feedback automatico
 */
VDJC.toggleVinylControl = function(channel, control, value, status) {
    if (VDJC.skinVinylControlButton) {
        VDJC.skinVinylControlButton.input(channel, control, value, status);
    }
};

/**
 * Library Load to Channel1
 * MIDI: 0x9F 0x15 0x7F/0x40
 * Mixxx: [Channel1], LoadSelectedTrack / LoadSelectedTrackAndPlay
 */
VDJC.libraryLoadToChannel1 = function(channel, control, value, status) {
    if (value === 0x7F) {  // Normal: Load only
        engine.setValue("[Channel1]", "LoadSelectedTrack", 1);
    }
    if (value === 0x40) {  // Shifted: Load & Play
        engine.setValue("[Channel1]", "LoadSelectedTrackAndPlay", 1);
    }
};

/**
 * Library Load to Channel2
 * MIDI: 0x9F 0x16 0x7F/0x40
 * Mixxx: [Channel2], LoadSelectedTrack / LoadSelectedTrackAndPlay
 */
VDJC.libraryLoadToChannel2 = function(channel, control, value, status) {
    if (value === 0x7F) {  // Normal: Load only
        engine.setValue("[Channel2]", "LoadSelectedTrack", 1);
    }
    if (value === 0x40) {  // Shifted: Load & Play
        engine.setValue("[Channel2]", "LoadSelectedTrackAndPlay", 1);
    }
};

/**
 * Library Load to Channel3
 * MIDI: 0x9F 0x17 0x7F/0x40
 * Mixxx: [Channel3], LoadSelectedTrack / LoadSelectedTrackAndPlay
 */
VDJC.libraryLoadToChannel3 = function(channel, control, value, status) {
    if (value === 0x7F) {  // Normal: Load only
        engine.setValue("[Channel3]", "LoadSelectedTrack", 1);
    }
    if (value === 0x40) {  // Shifted: Load & Play
        engine.setValue("[Channel3]", "LoadSelectedTrackAndPlay", 1);
    }
};

/**
 * Library Load to Channel4
 * MIDI: 0x9F 0x18 0x7F/0x40
 * Mixxx: [Channel4], LoadSelectedTrack / LoadSelectedTrackAndPlay
 */
VDJC.libraryLoadToChannel4 = function(channel, control, value, status) {
    if (value === 0x7F) {  // Normal: Load only
        engine.setValue("[Channel4]", "LoadSelectedTrack", 1);
    }
    if (value === 0x40) {  // Shifted: Load & Play
        engine.setValue("[Channel4]", "LoadSelectedTrackAndPlay", 1);
    }
};

/**
 * Library Load to PreviewDeck1
 * MIDI: 0x9F 0x19 0x7F/0x40
 * Mixxx: [PreviewDeck1], LoadSelectedTrack / LoadSelectedTrackAndPlay
 */
VDJC.libraryLoadToPreviewDeck = function(channel, control, value, status) {
    if (value === 0x7F) {  // Normal: Load only
        engine.setValue("[PreviewDeck1]", "LoadSelectedTrack", 1);
    }
    if (value === 0x40) {  // Shifted: Load & Play
        engine.setValue("[PreviewDeck1]", "LoadSelectedTrackAndPlay", 1);
    }
};

/**
 * Library Load to Sampler (1-64)
 * MIDI: 0x9F 0x55 (data2 = 1-64 for normal load, data2 | 0x40 for load+play)
 * Mixxx: [SamplerN], LoadSelectedTrack / LoadSelectedTrackAndPlay
 */
VDJC.libraryLoadToSampler = function(channel, control, value, status) {
    const shifted = (value & 0x40) !== 0;
    const samplerNumber = shifted ? (value & 0x3F) : value;
    
    if (samplerNumber < 1 || samplerNumber > 64) {
        script.log("Invalid sampler number: " + samplerNumber);
        return;
    }
    
    const samplerGroup = "[Sampler" + samplerNumber + "]";
    
    if (shifted) {
        engine.setValue(samplerGroup, "LoadSelectedTrackAndPlay", 1);
    } else {
        engine.setValue(samplerGroup, "LoadSelectedTrack", 1);
    }
};

/**
 * Library Font Size Knob (endless encoder)
 * MIDI: 0xBF 0x12 (CC relative)
 * Mixxx: [Library], font_size_knob
 * 
 * CC relative encoding:
 * - 0x01-0x3F (1-63):   Clockwise (increase font size)
 * - 0x40-0x7F (64-127): Counter-clockwise (decrease font size)
 */
VDJC.libraryFontSizeKnob = function(channel, control, value, status) {
    var delta;
    
    if (value < 0x40) {
        // Clockwise: positive delta (increase font size)
        delta = 1;
    } else {
        // Counter-clockwise: negative delta (decrease font size)
        delta = -1;
    }
    
    // font_size_knob is a relative control in Mixxx
    // Each delta adjusts the font size by one step
    engine.setValue("[Library]", "font_size_knob", delta);
};

/**
 * Library Move Horizontal (slider encoder)
 * MIDI: 0xBF 0x14 (CC relative)
 * Mixxx: [Library], MoveHorizontal
 * 
 * CC relative encoding:
 * - 0x01-0x3F (1-63):   Right movement (positive values)
 * - 0x40-0x7F (64-127): Left movement (negative values)
 */
VDJC.libraryMoveHorizontal = function(channel, control, value, status) {
    var delta;
    
    if (value < 0x40) {
        // Right movement: positive delta
        delta = value;
    } else {
        // Left movement: negative delta
        delta = -(value - 0x40);
    }
    
    // MoveHorizontal is a relative control in Mixxx (New in version 2.1.0)
    engine.setValue("[Library]", "MoveHorizontal", delta);
};
