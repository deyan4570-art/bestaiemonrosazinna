// Otteniamo il contesto 2D del canvas per disegnare
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// Disabilitiamo l'interpolazione dell'immagine per avere pixel art nitida
ctx.imageSmoothingEnabled = false;

// Riferimento all'elemento HTML per i dialoghi
const dialogueBox = document.getElementById('dialogue-box');

// ---------- TIPI E MATRICE DI EFFICACIA ----------
const TYPES = {
    FUOCO: 'Fuoco', ACQUA: 'Acqua', BOSCO: 'Bosco', ROCCIA: 'Roccia',
    ZANNA: 'Zanna', VELENO: 'Veleno', LUCE: 'Luce', OMBRA: 'Ombra',
    ALA: 'Ala', GELO: 'Gelo'
};

// Come nei giochi Pokémon, ogni tipo ha vantaggi e debolezze
const TYPE_EFFECTIVENESS = {
    [TYPES.FUOCO]: { strong: [TYPES.BOSCO, TYPES.GELO, TYPES.VELENO], weak: [TYPES.ACQUA, TYPES.ROCCIA] },
    [TYPES.ACQUA]: { strong: [TYPES.FUOCO, TYPES.ROCCIA], weak: [TYPES.BOSCO, TYPES.GELO] },
    [TYPES.BOSCO]: { strong: [TYPES.ACQUA, TYPES.ROCCIA], weak: [TYPES.FUOCO, TYPES.VELENO, TYPES.ALA] },
    [TYPES.ROCCIA]: { strong: [TYPES.FUOCO, TYPES.ALA, TYPES.GELO], weak: [TYPES.ACQUA, TYPES.BOSCO, TYPES.ZANNA] },
    [TYPES.ZANNA]: { strong: [TYPES.BOSCO, TYPES.OMBRA], weak: [TYPES.ALA, TYPES.ROCCIA, TYPES.VELENO] },
    [TYPES.VELENO]: { strong: [TYPES.BOSCO, TYPES.LUCE], weak: [TYPES.ZANNA, TYPES.OMBRA, TYPES.ROCCIA] },
    [TYPES.LUCE]: { strong: [TYPES.OMBRA, TYPES.GELO], weak: [TYPES.VELENO, TYPES.ROCCIA] },
    [TYPES.OMBRA]: { strong: [TYPES.VELENO, TYPES.ALA], weak: [TYPES.LUCE, TYPES.ZANNA] },
    [TYPES.ALA]: { strong: [TYPES.ZANNA, TYPES.BOSCO], weak: [TYPES.ROCCIA, TYPES.GELO, TYPES.LUCE] },
    [TYPES.GELO]: { strong: [TYPES.ALA, TYPES.ACQUA], weak: [TYPES.FUOCO, TYPES.ROCCIA, TYPES.LUCE] }
};

// ---------- DATABASE DEI TUOI 10 BESTIAEMON ----------
// Ogni mostro ha ID, nome, tipi, statistiche base, mosse e zona di apparizione
const BESTIAEMON_DATA = [
    { id: 1, name: "Lupfalena", types: [TYPES.ZANNA, TYPES.ALA], stats: [50, 60, 45, 70], moves: ["Morso d'Ombra", "Raffica Ali", "Ululato", "Sguscio"], zone: "forest" },
    { id: 2, name: "Giraffatarta", types: [TYPES.BOSCO, TYPES.ROCCIA], stats: [70, 65, 70, 30], moves: ["Frustata", "Lancioroccia", "Ruggito", "Fotosintesi"], zone: "plains" },
    { id: 3, name: "Aquilpolpo", types: [TYPES.ACQUA, TYPES.ALA], stats: [55, 50, 55, 65], moves: ["Pistolacqua", "Beccata", "Inchiostro", "Avvitarsi"], zone: "water" },
    { id: 4, name: "Cervolince", types: [TYPES.BOSCO, TYPES.ZANNA], stats: [60, 75, 55, 60], moves: ["Cornata", "Morso", "Agilità", "Mimetismo"], zone: "forest" },
    { id: 5, name: "Squalopolpo", types: [TYPES.ACQUA, TYPES.ZANNA], stats: [65, 80, 50, 55], moves: ["Morso", "Idropulsar", "Furia", "Sgranocchio"], zone: "water" },
    { id: 6, name: "Orsupo", types: [TYPES.ZANNA, TYPES.OMBRA], stats: [75, 70, 60, 30], moves: ["Artiglio", "Palla Ombra", "Ruggito", "Leccata"], zone: "mountain" },
    { id: 7, name: "Volpistrice", types: [TYPES.FUOCO, TYPES.ROCCIA], stats: [55, 60, 65, 55], moves: ["Fiammata", "Lancioroccia", "Spina", "Agilità"], zone: "mountain" },
    { id: 8, name: "Crocovolo", types: [TYPES.BOSCO, TYPES.ROCCIA], stats: [70, 65, 70, 35], moves: ["Frustata", "Lancioroccia", "Morso", "Ruggito"], zone: "plains" },
    { id: 9, name: "Zebrafalla", types: [TYPES.FUOCO, TYPES.LUCE], stats: [50, 55, 50, 75], moves: ["Fiammata", "Raggio Luce", "Calpestio", "Sprint"], zone: "plains" },
    { id: 10, name: "Pescecane", types: [TYPES.ACQUA, TYPES.ZANNA], stats: [60, 75, 55, 55], moves: ["Morso", "Idropulsar", "Acquagetto", "Mordikken"], zone: "water" }
];

// Definizione delle mosse (per calcolo danni)
const MOVES = {
    "Morso d'Ombra": { type: TYPES.OMBRA, power: 35 },
    "Raffica Ali": { type: TYPES.ALA, power: 35 },
    "Frustata": { type: TYPES.BOSCO, power: 35 },
    "Lancioroccia": { type: TYPES.ROCCIA, power: 35 },
    "Pistolacqua": { type: TYPES.ACQUA, power: 35 },
    "Beccata": { type: TYPES.ALA, power: 30 },
    "Morso": { type: TYPES.ZANNA, power: 40 },
    "Cornata": { type: TYPES.BOSCO, power: 40 },
    "Artiglio": { type: TYPES.ZANNA, power: 35 },
    "Fiammata": { type: TYPES.FUOCO, power: 40 },
    "Raggio Luce": { type: TYPES.LUCE, power: 40 },
    "Idropulsar": { type: TYPES.ACQUA, power: 40 },
    "Palla Ombra": { type: TYPES.OMBRA, power: 40 }
};

// ---------- STATO GLOBALE DEL GIOCO ----------
const gameState = {
    scene: 'title', // 'title', 'world', 'battle', 'team', 'talk'
    player: {
        x: 14, y: 18, // Posizione di partenza sulla mappa
        direction: 'down',
        // Squadra di Bestiaemon. Inizialmente vuota
        team: [],
        // I mostri visti e catturati (per ID)
        seen: new Set(),
        caught: new Set(),
        // Zaino
        inventory: { pokeballs: 10 }
    },
    wildMonster: null, // Il mostro selvatico incontrato
    battle: null,      // Stato della battaglia in corso
    dialogueQueue: [], // Coda di messaggi per la UI
    currentMenu: null  // Quale menu è attivo
};

// Dimensione dei tile della mappa in pixel
const TILE_SIZE = 16;
// Dimensioni della mappa in tile
const MAP_WIDTH = 30;  // 30 * 16 = 480 pixel (larghezza canvas)
const MAP_HEIGHT = 27; // 27 * 16 = 432 pixel (altezza canvas)
// ---------- MAPPA DI GIOCO (30x27) ----------
// 0 = erba normale, 1 = erba alta (incontri), 2 = albero (blocco), 3 = acqua (blocco), 4 = montagna (blocco), 5 = sentiero/casa
function generateMap() {
    const map = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
        map[y] = [];
        for (let x = 0; x < MAP_WIDTH; x++) {
            // Bordo alberi tutto intorno
            if (y === 0 || y === MAP_HEIGHT-1 || x === 0 || x === MAP_WIDTH-1) {
                map[y][x] = 2;
            }
            // Area del villaggio in basso al centro
            else if (y > 20 && x > 10 && x < 19) {
                if (x === 11 || x === 18 || y === 21 || y === 25) map[y][x] = 2; // Mura
                else if ((x === 14 || x === 15) && y === 25) map[y][x] = 5; // Porta
                else map[y][x] = 5; // Interno villaggio
            }
            // Laghetto a sinistra
            else if (y > 10 && y < 15 && x > 2 && x < 7) {
                map[y][x] = 3;
            }
            // Zona montagnosa in alto a destra
            else if (y > 5 && y < 10 && x > 20 && x < 27) {
                map[y][x] = 4;
            }
            // Piccolo bosco a sinistra
            else if (y > 16 && y < 21 && x > 2 && x < 8) {
                map[y][x] = 2;
            }
            // Erba alta sparsa (zone di incontri)
            else if (Math.random() < 0.12 && x > 8 && x < 22) {
                map[y][x] = 1;
            }
            // Erba normale
            else {
                map[y][x] = 0;
            }
        }
    }
    return map;
}

// Inizializziamo la mappa
let currentMap = generateMap();

// ---------- DISEGNO DELLA MAPPA ----------
function drawMap() {
    for (let row = 0; row < MAP_HEIGHT; row++) {
        for (let col = 0; col < MAP_WIDTH; col++) {
            const tile = currentMap[row][col];
            let color;
            switch (tile) {
                case 0: color = '#8bac0f'; break; // Erba normale
                case 1: color = '#6b8c0f'; break; // Erba alta (più scura)
                case 2: color = '#5a7247'; break; // Albero
                case 3: color = '#4f7aa6'; break; // Acqua
                case 4: color = '#8b7a6b'; break; // Montagna
                case 5: color = '#c4a882'; break; // Sentiero/Casa
                default: color = '#8bac0f';
            }
            ctx.fillStyle = color;
            ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
    
    // Disegna il personaggio giocante
    const playerX = gameState.player.x * TILE_SIZE;
    const playerY = gameState.player.y * TILE_SIZE;
    ctx.fillStyle = '#e03a4e'; // Rosso per il cappello/parte superiore
    ctx.fillRect(playerX + 4, playerY, 8, 8);
    ctx.fillStyle = '#f8e3c4'; // Pelle
    ctx.fillRect(playerX + 4, playerY + 8, 8, 8);
    ctx.fillStyle = '#3a2a1a'; // Capelli
    ctx.fillRect(playerX + 5, playerY, 6, 2);
}
// ---------- MOVIMENTO E COLLISIONI ----------
function canMoveTo(x, y) {
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
    const tile = currentMap[y][x];
    // Non si può camminare su alberi (2), acqua (3) o montagne (4)
    return tile !== 2 && tile !== 3 && tile !== 4;
}

function movePlayer(dx, dy, direction) {
    const newX = gameState.player.x + dx;
    const newY = gameState.player.y + dy;
    
    if (canMoveTo(newX, newY)) {
        gameState.player.x = newX;
        gameState.player.y = newY;
        gameState.player.direction = direction;
        
        // Controlla incontri casuali dopo ogni movimento
        checkForEncounter();
        drawGameScene(); // Ridisegna la scena
    }
}

// ---------- SISTEMA DI INCONTRI CASUALI ----------
function getWildMonster() {
    const zoneMap = { 1: 'plains', 2: 'forest', 3: 'water', 4: 'mountain' };
    const currentTile = currentMap[gameState.player.y][gameState.player.x];
    const zone = zoneMap[currentTile] || 'plains';
    const candidates = BESTIAEMON_DATA.filter(m => m.zone === zone);
    if (candidates.length === 0) return null;
    
    const base = candidates[Math.floor(Math.random() * candidates.length)];
    const level = Math.floor(Math.random() * 5) + 3; // Livello tra 3 e 7
    
    return {
        ...base,
        level: level,
        currentHp: base.stats[0] + level * 2,
        maxHp: base.stats[0] + level * 2,
        attack: base.stats[1] + level,
        defense: base.stats[2] + level,
        speed: base.stats[3] + level,
        moves: base.moves.slice(0, 3) // Solo 3 mosse per i selvatici
    };
}

function checkForEncounter() {
    // Incontri solo sull'erba alta (tile 1) con probabilità del 15%
    const tile = currentMap[gameState.player.y][gameState.player.x];
    if (tile === 1 && Math.random() < 0.15 && gameState.scene === 'world') {
        const wild = getWildMonster();
        if (wild) {
            gameState.wildMonster = wild;
            gameState.scene = 'battle';
            gameState.dialogueQueue = [`Appare un ${wild.name} selvatico! (Lv.${wild.level})`];
            gameState.battle = {
                playerActiveIdx: 0, // Indice del mostro attivo nella squadra
                turn: 'player'
            };
            updateDialogue();
            drawGameScene();
        }
    }
}
// ---------- GESTIONE BATTAGLIA ----------
function calculateBattleDamage(attacker, defender, moveName) {
    const move = MOVES[moveName] || { type: TYPES.ZANNA, power: 20 };
    let effectiveness = 1;
    
    // Calcolo efficacia tipi
    const moveType = move.type;
    if (TYPE_EFFECTIVENESS[moveType]) {
        for (const defType of defender.types) {
            if (TYPE_EFFECTIVENESS[moveType].strong.includes(defType)) {
                effectiveness *= 1.8;
            } else if (TYPE_EFFECTIVENESS[moveType].weak.includes(defType)) {
                effectiveness *= 0.6;
            }
        }
    }
    
    const attackStat = attacker.attack;
    const defenseStat = defender.defense;
    const baseDamage = ((2 * attacker.level / 5 + 2) * move.power * attackStat / defenseStat / 50 + 2);
    return Math.max(1, Math.floor(baseDamage * effectiveness));
}

function playerAttack(moveName) {
    if (!gameState.battle || gameState.battle.turn !== 'player') return;
    
    const playerMon = gameState.player.team[gameState.battle.playerActiveIdx];
    const wildMon = gameState.wildMonster;
    
    if (!playerMon || playerMon.currentHp <= 0) return;
    
    const damage = calculateBattleDamage(playerMon, wildMon, moveName);
    wildMon.currentHp -= damage;
    gameState.dialogueQueue[0] = `${playerMon.name} usa ${moveName}! Danno: ${damage}`;
    
    if (wildMon.currentHp <= 0) {
        wildMon.currentHp = 0;
        gameState.dialogueQueue[0] = `${wildMon.name} è esausto! Hai vinto!`;
        endBattle(true);
        return;
    }
    
    // Turno del nemico
    gameState.battle.turn = 'enemy';
    setTimeout(enemyTurn, 800);
}

function enemyTurn() {
    if (!gameState.battle || gameState.battle.turn !== 'enemy') return;
    
    const playerMon = gameState.player.team[gameState.battle.playerActiveIdx];
    const wildMon = gameState.wildMonster;
    
    if (!playerMon || !wildMon) return;
    
    // Il nemico sceglie una mossa a caso
    const randomMove = wildMon.moves[Math.floor(Math.random() * wildMon.moves.length)];
    const damage = calculateBattleDamage(wildMon, playerMon, randomMove);
    playerMon.currentHp -= damage;
    gameState.dialogueQueue[0] = `${wildMon.name} usa ${randomMove}! Danno: ${damage}`;
    
    if (playerMon.currentHp <= 0) {
        playerMon.currentHp = 0;
        gameState.dialogueQueue[0] = `${playerMon.name} è esausto!`;
        // Se tutta la squadra è esausta, si torna al centro Pokémon (per ora, solo game over semplice)
        if (gameState.player.team.every(m => m.currentHp <= 0)) {
            endBattle(false);
        }
    }
    
    gameState.battle.turn = 'player';
    updateDialogue();
    drawGameScene();
}

function tryCatch() {
    if (!gameState.battle || gameState.battle.turn !== 'player') return;
    if (gameState.player.inventory.pokeballs <= 0) {
        gameState.dialogueQueue[0] = "Non hai sfere di cattura!";
        return;
    }
    
    gameState.player.inventory.pokeballs--;
    const wild = gameState.wildMonster;
    const hpFactor = wild.currentHp / wild.maxHp;
    const catchRate = 0.5 - hpFactor * 0.4 + 0.1;
    
    if (Math.random() < catchRate) {
        gameState.dialogueQueue[0] = `Preso! Hai catturato ${wild.name}!`;
        gameState.player.caught.add(wild.id);
        gameState.player.seen.add(wild.id);
        if (gameState.player.team.length < 6) {
            gameState.player.team.push(wild);
        }
        endBattle(true);
    } else {
        gameState.dialogueQueue[0] = "Oh no! Si è liberato!";
        gameState.battle.turn = 'enemy';
        setTimeout(enemyTurn, 800);
    }
    updateDialogue();
    drawGameScene();
}

function endBattle(victory) {
    if (victory && gameState.battle) {
        const playerMon = gameState.player.team[gameState.battle.playerActiveIdx];
        if (playerMon && gameState.wildMonster) {
            playerMon.exp += gameState.wildMonster.level * 20;
            // Esempio semplificato di level up
            if (playerMon.exp >= playerMon.level * 30) {
                playerMon.level++;
                playerMon.maxHp += 3;
                playerMon.currentHp = playerMon.maxHp;
                playerMon.attack += 2;
                playerMon.defense += 2;
                playerMon.speed += 2;
                gameState.dialogueQueue[0] += ` ${playerMon.name} sale al livello ${playerMon.level}!`;
            }
        }
    }
    
    gameState.scene = 'world';
    gameState.battle = null;
    gameState.wildMonster = null;
    updateDialogue();
    drawGameScene();
    saveGame();
}
// ---------- AGGIORNAMENTO DIALOGO ----------
function updateDialogue() {
    if (gameState.dialogueQueue.length > 0) {
        dialogueBox.textContent = gameState.dialogueQueue[0];
    } else {
        dialogueBox.textContent = '';
    }
}

// ---------- DISEGNO DELLE SCENE ----------
function drawTitleScene() {
    ctx.fillStyle = '#1e1e2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f7e3b2';
    ctx.font = '24px "Courier New"';
    ctx.fillText('BESTIAEMON: Lince', 90, 180);
    ctx.font = '14px "Courier New"';
    ctx.fillText('Premi INVIO per iniziare', 130, 220);
    ctx.fillText('M per caricare partita', 135, 240);
}

function drawBattleScene() {
    ctx.fillStyle = '#2a2a3a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!gameState.wildMonster) return;
    
    // Disegna il mostro selvatico (a destra)
    ctx.fillStyle = getTypeColor(gameState.wildMonster.types[0]);
    ctx.fillRect(320, 80, 80, 80);
    ctx.fillStyle = '#fff';
    ctx.font = '14px "Courier New"';
    ctx.fillText(gameState.wildMonster.name + ' Lv.' + gameState.wildMonster.level, 310, 180);
    // Barra HP selvatico
    drawHpBar(320, 190, gameState.wildMonster.currentHp, gameState.wildMonster.maxHp);
    
    // Disegna il mostro del giocatore (a sinistra)
    const playerMon = gameState.player.team[gameState.battle?.playerActiveIdx || 0];
    if (playerMon) {
        ctx.fillStyle = getTypeColor(playerMon.types[0]);
        ctx.fillRect(60, 260, 80, 80);
        ctx.fillStyle = '#fff';
        ctx.fillText(playerMon.name + ' Lv.' + playerMon.level, 50, 360);
        drawHpBar(50, 370, playerMon.currentHp, playerMon.maxHp);
    }
    
    // Opzioni di battaglia (testuali)
    ctx.fillStyle = '#e8e0c8';
    ctx.fillRect(20, 390, 440, 30);
    ctx.fillStyle = '#000';
    ctx.font = '12px "Courier New"';
    ctx.fillText('A: Attacco | C: Cattura | F: Fuga', 100, 410);
}

function drawHpBar(x, y, current, max) {
    const width = 100;
    const percent = current / max;
    ctx.fillStyle = '#444';
    ctx.fillRect(x, y, width, 8);
    const hpColor = percent > 0.5 ? '#4cd964' : percent > 0.2 ? '#ffcc00' : '#ff3b30';
    ctx.fillStyle = hpColor;
    ctx.fillRect(x, y, width * percent, 8);
}

function getTypeColor(type) {
    const colors = {
        Fuoco: '#e04040', Acqua: '#4080e0', Bosco: '#40a040',
        Roccia: '#a08060', Zanna: '#c0a040', Veleno: '#a040a0',
        Luce: '#e0d040', Ombra: '#604080', Ala: '#a0c0e0', Gelo: '#80c0e0'
    };
    return colors[type] || '#888';
}

function drawGameScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gameState.scene === 'title') {
        drawTitleScene();
    } else if (gameState.scene === 'world') {
        drawMap();
    } else if (gameState.scene === 'battle') {
        drawBattleScene();
    }
    updateDialogue();
}
// ---------- SCELTA DELLO STARTER ----------
function chooseStarter(starterId) {
    const starter = BESTIAEMON_DATA.find(m => m.id === starterId);
    if (starter) {
        const lv5 = {
            ...starter,
            level: 5,
            currentHp: starter.stats[0] + 10,
            maxHp: starter.stats[0] + 10,
            attack: starter.stats[1] + 5,
            defense: starter.stats[2] +