/**
 * InitShutFunctions.js
 * Funzioni modulari per inizializzazione e shutdown del controller VDJC
 * 
 * Struttura:
 * - Init functions: Chiamate da VDJC.init() per setup componenti
 * - Shutdown functions: Chiamate da VDJC.shutdown() per cleanup
 * 
 * Autori: Deja1987 & Claude
 * Data: Febbraio 2026
 */

///////////////////////////////////////////////////////////////
//                    INIT FUNCTIONS                         //
///////////////////////////////////////////////////////////////

/**
 * Inizializza VU Meters per Main e Deck 1-4
 * Crea connections per feedback real-time dei livelli audio
 */
function initVuMeter() {
    if (VDJC.debugging) {
        console.log('[Init] VU Meters - connecting Main + 4 decks...');
    }
    
    // Delay per garantire che i ControlObject siano pronti
    engine.beginTimer(100, function () {
        // Store connections per cleanup in shutdown
        VDJC.vuMeterConnections = [];
        
        VDJC.vuMeterConnections.push(
            engine.makeConnection("[Main]", "vu_meter_left", (value) =>
                onVuMeterChange(value, "[Main]", "vu_meter_left"))
        );
        VDJC.vuMeterConnections.push(
            engine.makeConnection("[Main]", "vu_meter_right", (value) =>
                onVuMeterChange(value, "[Main]", "vu_meter_right"))
        );
        
        VDJC.vuMeterConnections.push(
            engine.makeConnection("[Channel1]", "vu_meter", (value) =>
                onVuMeterChange(value, "[Channel1]", "vu_meter"))
        );
        VDJC.vuMeterConnections.push(
            engine.makeConnection("[Channel2]", "vu_meter", (value) =>
                onVuMeterChange(value, "[Channel2]", "vu_meter"))
        );
        VDJC.vuMeterConnections.push(
            engine.makeConnection("[Channel3]", "vu_meter", (value) =>
                onVuMeterChange(value, "[Channel3]", "vu_meter"))
        );
        VDJC.vuMeterConnections.push(
            engine.makeConnection("[Channel4]", "vu_meter", (value) =>
                onVuMeterChange(value, "[Channel4]", "vu_meter"))
        );
        
        if (VDJC.debugging) {
            console.log('[Init] VU Meters - 6 connections created ✓');
        }
    }, true); // true = auto-dispose del timer
}

/**
 * Inizializza Deck A (left) e Deck B (right)
 * Left: Channel1/3, Right: Channel2/4
 */
function initDecks() {
    if (VDJC.debugging) {
        console.log('[Init] Decks - creating leftDeck + rightDeck...');
    }
    
    // Deck sinistro: shift tra Channel1 e Channel3
    VDJC.leftDeck = new VDJC.Deck([1, 3], 0x00);
    
    // Deck destro: shift tra Channel2 e Channel4
    VDJC.rightDeck = new VDJC.Deck([2, 4], 0x01);
    
    // Sincronizza lo stato dei pulsanti di assegnazione degli effetti
    function syncFXAssignmentButtons(deck, channel) {
        for (let u = 1; u <= 4; u++) {
            const group = `[EffectRack1_EffectUnit${u}]`;
            const key = `group_${deck.currentDeck}_enable`;
            const value = engine.getValue(group, key) ? 0x7F : 0x00;
            midi.sendShortMsg(0x90 | channel, 0x50 + u, value);
        }
    }
    
    syncFXAssignmentButtons(VDJC.rightDeck, 0x01);
    syncFXAssignmentButtons(VDJC.leftDeck, 0x00);
    
    // Invia informazioni sui deck attivi all'app
    VDJC.leftDeck.sendActiveDeckInfo();
    VDJC.rightDeck.sendActiveDeckInfo();
    
    if (VDJC.debugging) {
        console.log('[Init] Decks - leftDeck + rightDeck initialized ✓');
    }
}

/**
 * Inizializza Sampler Banks A e B (MIDI ch5 e ch6)
 * Bank A: PreviewDeck1 (default), Bank B: Sampler1 (default)
 */
function initSamplerBanks() {
    if (VDJC.debugging) {
        console.log('[Init] Sampler Banks - creating Bank A + B...');
    }
    
    // Bank A (MIDI ch5) → Default: PreviewDeck1
    VDJC.samplerBankA = new VDJC.SamplerBank(65, 0x04);
    
    // Bank B (MIDI ch6) → Default: Sampler1
    VDJC.samplerBankB = new VDJC.SamplerBank(1, 0x05);
    
    if (VDJC.debugging) {
        console.log('[Init] Sampler Banks - Bank A (ch5) → PreviewDeck1, Bank B (ch6) → Sampler1 ✓');
    }
}

/**
 * Inizializza Effect Unit (4 unit con toggle ciclico)
 * Include effectUnitLabel trigger e sampler grid
 */
function initEffectUnit() {
    if (VDJC.debugging) {
        console.log('[Init] Effect Unit - creating unit 1-4 + components...');
    }
    
    // Crea Effect Unit con tutte e 4 le unit per permettere il toggle ciclico
    VDJC.effectUnit = new VDJC.EffectUnit([1, 2, 3, 4]);
    
    // Triggera il label per inviare il feedback iniziale dell'unit attiva
    if (VDJC.effectUnit.effectUnitLabel && typeof VDJC.effectUnit.effectUnitLabel.output === 'function') {
        VDJC.effectUnit.effectUnitLabel.output(
            VDJC.effectUnit.currentUnitNumber,
            VDJC.effectUnit.group,
            'current_unit_number'
        );
    }
    
    // Connetti e trigger sampler grid per feedback iniziale
    VDJC.effectUnit.effectSamplerGrid.connect();
    VDJC.effectUnit.effectSamplerGrid.trigger();
    
    if (VDJC.debugging) {
        console.log('[Init] Effect Unit - initialized with sampler grid ✓');
    }
}

/**
 * Inizializza Sampler Pads (16 trigger buttons con feedback)
 * MIDI: 0x9F 0x2B [velocity 1-16]
 */
function initSamplerPads() {
    if (VDJC.debugging) {
        console.log('[Init] Sampler Pads - creating 16 trigger pads...');
    }
    
    // I Button si connettono automaticamente ai CO di Mixxx per feedback output
    VDJC.samplerPads = new VDJC.samplerPads();
    
    if (VDJC.debugging) {
        console.log('[Init] Sampler Pads - 16 pads with bidirectional feedback ✓');
    }
}

/**
 * Inizializza XY Pad controls per EffectUnit 1-4
 * 8 pots totali: mix + super1 per ogni unit (group fisso)
 */
function initXYPads() {
    if (VDJC.debugging) {
        console.log('[Init] XY Pads - connecting 8 pots (mix + super1)...');
    }
    
    // EffectUnit 1
    VDJC.xyPadUnit1Mix.connect();
    VDJC.xyPadUnit1Mix.trigger();
    VDJC.xyPadUnit1Super.connect();
    VDJC.xyPadUnit1Super.trigger();
    
    // EffectUnit 2
    VDJC.xyPadUnit2Mix.connect();
    VDJC.xyPadUnit2Mix.trigger();
    VDJC.xyPadUnit2Super.connect();
    VDJC.xyPadUnit2Super.trigger();
    
    // EffectUnit 3
    VDJC.xyPadUnit3Mix.connect();
    VDJC.xyPadUnit3Mix.trigger();
    VDJC.xyPadUnit3Super.connect();
    VDJC.xyPadUnit3Super.trigger();
    
    // EffectUnit 4
    VDJC.xyPadUnit4Mix.connect();
    VDJC.xyPadUnit4Mix.trigger();
    VDJC.xyPadUnit4Super.connect();
    VDJC.xyPadUnit4Super.trigger();
    
    if (VDJC.debugging) {
        console.log('[Init] XY Pads - 8 pots for EffectUnit 1-4 ✓');
    }
}

/**
 * Inizializza Skin View toggle buttons con feedback automatico
 * 3 buttons: show_effectrack, show_samplers, show_vinylcontrol
 */
function initSkinViewButtons() {
    if (VDJC.debugging) {
        console.log('[Init] Skin View Buttons - creating 3 toggle buttons...');
    }
    
    // Effect Rack toggle
    VDJC.skinEffectRackButton = new components.Button({
        midi: [0x9F, 0x20],
        group: '[Skin]',
        key: 'show_effectrack',
        type: components.Button.prototype.types.toggle,
    });
    
    // Samplers toggle
    VDJC.skinSamplersButton = new components.Button({
        midi: [0x9F, 0x21],
        group: '[Skin]',
        key: 'show_samplers',
        type: components.Button.prototype.types.toggle,
    });
    
    // Vinyl Control toggle
    VDJC.skinVinylControlButton = new components.Button({
        midi: [0x9F, 0x22],
        group: '[Skin]',
        key: 'show_vinylcontrol',
        type: components.Button.prototype.types.toggle,
    });
    
    // Connetti i button per abilitare il feedback automatico
    VDJC.skinEffectRackButton.connect();
    VDJC.skinSamplersButton.connect();
    VDJC.skinVinylControlButton.connect();
    
    // Trigger feedback iniziale per sincronizzare lo stato corrente
    VDJC.skinEffectRackButton.trigger();
    VDJC.skinSamplersButton.trigger();
    VDJC.skinVinylControlButton.trigger();
    
    if (VDJC.debugging) {
        console.log('[Init] Skin View Buttons - 3 buttons connected ✓');
    }
}

/**
 * Inizializza Master FX Assignment Buttons (4 buttons per [Master])
 * MIDI: 0x9F 0x51-0x54
 */
function initMasterControls() {
    if (VDJC.debugging) {
        console.log('[Init] Master Controls - creating FX assignment buttons...');
    }
    
    // Effect Unit Assignment Buttons per Master
    VDJC.masterFxAssignButtons = [];
    for (var u = 1; u <= 4; u++) {
        VDJC.masterFxAssignButtons.push(new components.Button({
            midi: [0x9F, 0x50 + u],
            group: `[EffectRack1_EffectUnit${u}]`,
            key: 'group_[Master]_enable',
            type: components.Button.prototype.types.toggle,
        }));
    }
    
    if (VDJC.debugging) {
        console.log('[Init] Master Controls - 4 FX assignment buttons created ✓');
    }
}

///////////////////////////////////////////////////////////////
//                  SHUTDOWN FUNCTIONS                       //
///////////////////////////////////////////////////////////////

/**
 * Shutdown VU Meters - Disconnette tutte le connections
 */
function shutdownVuMeter() {
    if (VDJC.debugging) {
        console.log('[Shutdown] VU Meters - disconnecting connections...');
    }
    
    if (VDJC.vuMeterConnections && VDJC.vuMeterConnections.length > 0) {
        VDJC.vuMeterConnections.forEach(function(connection) {
            if (connection && typeof connection.disconnect === 'function') {
                connection.disconnect();
            }
        });
        VDJC.vuMeterConnections = [];
        
        if (VDJC.debugging) {
            console.log('[Shutdown] VU Meters - disconnected ✓');
        }
    }
}

/**
 * Shutdown Decks - Disconnette leftDeck e rightDeck
 */
function shutdownDecks() {
    if (VDJC.debugging) {
        console.log('[Shutdown] Decks - disconnecting leftDeck + rightDeck...');
    }
    
    if (VDJC.leftDeck && typeof VDJC.leftDeck.shutdown === 'function') {
        VDJC.leftDeck.shutdown();
    }
    
    if (VDJC.rightDeck && typeof VDJC.rightDeck.shutdown === 'function') {
        VDJC.rightDeck.shutdown();
    }
    
    if (VDJC.debugging) {
        console.log('[Shutdown] Decks - disconnected ✓');
    }
}

/**
 * Shutdown Sampler Banks - Disconnette Bank A e B
 */
function shutdownSamplerBanks() {
    if (VDJC.debugging) {
        console.log('[Shutdown] Sampler Banks - disconnecting Bank A + B...');
    }
    
    if (VDJC.samplerBankA && typeof VDJC.samplerBankA.shutdown === 'function') {
        VDJC.samplerBankA.shutdown();
    }
    
    if (VDJC.samplerBankB && typeof VDJC.samplerBankB.shutdown === 'function') {
        VDJC.samplerBankB.shutdown();
    }
    
    if (VDJC.debugging) {
        console.log('[Shutdown] Sampler Banks - disconnected ✓');
    }
}

/**
 * Shutdown Effect Unit - Disconnette effectUnit e componenti
 */
function shutdownEffectUnit() {
    if (VDJC.debugging) {
        console.log('[Shutdown] Effect Unit - disconnecting unit + components...');
    }
    
    if (VDJC.effectUnit) {
        // Disconnect sampler grid
        if (VDJC.effectUnit.effectSamplerGrid && 
            typeof VDJC.effectUnit.effectSamplerGrid.disconnect === 'function') {
            VDJC.effectUnit.effectSamplerGrid.disconnect();
        }
        
        // Shutdown effectUnit (chiama ComponentContainer.shutdown)
        if (typeof VDJC.effectUnit.shutdown === 'function') {
            VDJC.effectUnit.shutdown();
        }
    }
    
    if (VDJC.debugging) {
        console.log('[Shutdown] Effect Unit - disconnected ✓');
    }
}

/**
 * Shutdown Sampler Pads - Disconnette 16 trigger pads
 */
function shutdownSamplerPads() {
    if (VDJC.debugging) {
        console.log('[Shutdown] Sampler Pads - disconnecting 16 pads...');
    }
    
    if (VDJC.samplerPads && typeof VDJC.samplerPads.shutdown === 'function') {
        VDJC.samplerPads.shutdown();
    }
    
    if (VDJC.debugging) {
        console.log('[Shutdown] Sampler Pads - disconnected ✓');
    }
}

/**
 * Shutdown XY Pads - Disconnette 8 pots (mix + super1 per 4 unit)
 */
function shutdownXYPads() {
    if (VDJC.debugging) {
        console.log('[Shutdown] XY Pads - disconnecting 8 pots...');
    }
    
    const xyPads = [
        VDJC.xyPadUnit1Mix,
        VDJC.xyPadUnit1Super,
        VDJC.xyPadUnit2Mix,
        VDJC.xyPadUnit2Super,
        VDJC.xyPadUnit3Mix,
        VDJC.xyPadUnit3Super,
        VDJC.xyPadUnit4Mix,
        VDJC.xyPadUnit4Super
    ];
    
    xyPads.forEach(function(pad) {
        if (pad && typeof pad.disconnect === 'function') {
            pad.disconnect();
        }
    });
    
    if (VDJC.debugging) {
        console.log('[Shutdown] XY Pads - disconnected ✓');
    }
}

/**
 * Shutdown Skin View Buttons - Disconnette 3 toggle buttons
 */
function shutdownSkinViewButtons() {
    if (VDJC.debugging) {
        console.log('[Shutdown] Skin View Buttons - disconnecting 3 buttons...');
    }
    
    const skinButtons = [
        VDJC.skinEffectRackButton,
        VDJC.skinSamplersButton,
        VDJC.skinVinylControlButton
    ];
    
    skinButtons.forEach(function(button) {
        if (button && typeof button.disconnect === 'function') {
            button.disconnect();
        }
    });
    
    if (VDJC.debugging) {
        console.log('[Shutdown] Skin View Buttons - disconnected ✓');
    }
}

/**
 * Shutdown Master Controls - Disconnette FX assignment buttons + encoders
 */
function shutdownMasterControls() {
    if (VDJC.debugging) {
        console.log('[Shutdown] Master Controls - disconnecting encoders + FX buttons...');
    }
    
    // Disconnect Master Encoders
    const masterEncoders = [
        VDJC.crossF,
        VDJC.cueVolume,
        VDJC.cueMix,
        VDJC.masterVolume,
        VDJC.masterBalance
    ];
    
    masterEncoders.forEach(function(encoder) {
        if (encoder && typeof encoder.disconnect === 'function') {
            encoder.disconnect();
        }
    });
    
    // Disconnect Master FX Assignment Buttons
    if (VDJC.masterFxAssignButtons && VDJC.masterFxAssignButtons.length > 0) {
        VDJC.masterFxAssignButtons.forEach(function(button) {
            if (button && typeof button.disconnect === 'function') {
                button.disconnect();
            }
        });
    }
    
    if (VDJC.debugging) {
        console.log('[Shutdown] Master Controls - disconnected ✓');
    }
}

