const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

canvas.focus();
canvas.addEventListener('click', () => canvas.focus());

const dialogueBox = document.getElementById('dialogue-box');

// ---------- TIPI ----------
const TYPES = {
    FUOCO: 'Fuoco', ACQUA: 'Acqua', BOSCO: 'Bosco', ROCCIA: 'Roccia',
    ZANNA: 'Zanna', VELENO: 'Veleno', LUCE: 'Luce', OMBRA: 'Ombra',
    ALA: 'Ala', GELO: 'Gelo'
};

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

// ---------- SPRITE COLORI ----------
const SPRITE_COLORS = {
    Lupfalena: ['#8B4513', '#DAA520'],
    Giraffatarta: ['#DAA520', '#8B7355'],
    Aquilpolpo: ['#4682B4', '#87CEEB'],
    Cervolince: ['#8B4513', '#D2691E'],
    Squalopolpo: ['#708090', '#4682B4'],
    Orsupo: ['#5C4033', '#4B0082'],
    Volpistrice: ['#FF6347', '#8B7355'],
    Crocovolo: ['#556B2F', '#8B7355'],
    Zebrafalla: ['#FF4500', '#FFD700'],
    Pescecane: ['#4169E1', '#708090']
};

// ---------- DATABASE BESTIAEMON ----------
const BESTIAEMON_DATA = [
    { id: 1, name: "Lupfalena", types: [TYPES.ZANNA, TYPES.ALA], stats: [55, 60, 45, 70], moves: ["Morso d'Ombra", "Raffica Ali", "Ululato", "Sguscio"], zone: "forest" },
    { id: 2, name: "Giraffatarta", types: [TYPES.BOSCO, TYPES.ROCCIA], stats: [70, 65, 70, 30], moves: ["Frustata", "Lancioroccia", "Ruggito", "Fotosintesi"], zone: "plains" },
    { id: 3, name: "Aquilpolpo", types: [TYPES.ACQUA, TYPES.ALA], stats: [55, 50, 55, 65], moves: ["Pistolacqua", "Beccata", "Inchiostro", "Avvitarsi"], zone: "water" },
    { id: 4, name: "Cervolince", types: [TYPES.BOSCO, TYPES.ZANNA], stats: [60, 75, 55, 60], moves: ["Cornata", "Morso", "Agilità", "Mimetismo"], zone: "forest" },
    { id: 5, name: "Squalopolpo", types: [TYPES.ACQUA, TYPES.ZANNA], stats: [65, 80, 50, 55], moves: ["Morso", "Idropulsar", "Furia", "Sgranocchio"], zone: "water" },
    { id: 6, name: "Orsupo", types: [TYPES.ZANNA, TYPES.OMBRA], stats: [75, 70, 60, 30], moves: ["Artiglio", "Palla Ombra", "Ruggito", "Leccata"], zone: "mountain" },
    { id: 7, name: "Volpistrice", types: [TYPES.FUOCO, TYPES.ROCCIA], stats: [55, 60, 65, 55], moves: ["Fiammata", "Lancioroccia", "Spina", "Agilità"], zone: "mountain" },
    { id: 8, name: "Crocovolo", types: [TYPES.BOSCO, TYPES.ROCCIA], stats: [70, 65, 70, 35], moves: ["Frustata", "Lancioroccia", "Morso", "Ruggito"], zone: "plains" },
    { id: 9, name: "Zebrafalla", types: [TYPES.FUOCO, TYPES.LUCE], stats: [55, 55, 50, 75], moves: ["Fiammata", "Raggio Luce", "Calpestio", "Sprint"], zone: "plains" },
    { id: 10, name: "Pescecane", types: [TYPES.ACQUA, TYPES.ZANNA], stats: [60, 75, 55, 55], moves: ["Morso", "Idropulsar", "Acquagetto", "Mordikken"], zone: "water" }
];

const MOVES = {
    "Morso d'Ombra": { type: TYPES.OMBRA, power: 40 },
    "Raffica Ali": { type: TYPES.ALA, power: 40 },
    "Frustata": { type: TYPES.BOSCO, power: 40 },
    "Lancioroccia": { type: TYPES.ROCCIA, power: 40 },
    "Pistolacqua": { type: TYPES.ACQUA, power: 40 },
    "Beccata": { type: TYPES.ALA, power: 35 },
    "Morso": { type: TYPES.ZANNA, power: 45 },
    "Cornata": { type: TYPES.BOSCO, power: 45 },
    "Artiglio": { type: TYPES.ZANNA, power: 40 },
    "Fiammata": { type: TYPES.FUOCO, power: 45 },
    "Raggio Luce": { type: TYPES.LUCE, power: 45 },
    "Idropulsar": { type: TYPES.ACQUA, power: 45 },
    "Palla Ombra": { type: TYPES.OMBRA, power: 45 },
    "Calpestio": { type: TYPES.ROCCIA, power: 35 },
    "Sprint": { type: TYPES.ALA, power: 25 },
    "Acquagetto": { type: TYPES.ACQUA, power: 40 },
    "Mordikken": { type: TYPES.ZANNA, power: 40 },
    "Spina": { type: TYPES.BOSCO, power: 35 },
    "Ululato": { type: TYPES.OMBRA, power: 0 },
    "Sguscio": { type: TYPES.ALA, power: 0 },
    "Ruggito": { type: TYPES.ZANNA, power: 0 },
    "Fotosintesi": { type: TYPES.BOSCO, power: 0 },
    "Inchiostro": { type: TYPES.ACQUA, power: 0 },
    "Avvitarsi": { type: TYPES.ALA, power: 0 },
    "Agilità": { type: TYPES.ALA, power: 0 },
    "Mimetismo": { type: TYPES.BOSCO, power: 0 },
    "Furia": { type: TYPES.ZANNA, power: 0 },
    "Sgranocchio": { type: TYPES.ZANNA, power: 0 },
    "Leccata": { type: TYPES.OMBRA, power: 0 }
};

// ---------- STATO GIOCO ----------
const gameState = {
    scene: 'title',
    player: {
        x: 14, y: 22,
        direction: 'down',
        team: [],
        seen: new Set(),
        caught: new Set(),
        inventory: { pokeballs: 10 }
    },
    wildMonster: null,
    battle: null,
    dialogueQueue: [],
    currentMenu: null
};

const TILE_SIZE = 16;
const MAP_WIDTH = 30;
const MAP_HEIGHT = 27;
let currentMap = [];

// ---------- CENTRO POKEMON (casa speciale) ----------
const POKECENTER = { x1: 13, y1: 22, x2: 15, y2: 24 };

// ---------- MAPPA ----------
function generateMap() {
    const map = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
        map[y] = [];
        for (let x = 0; x < MAP_WIDTH; x++) {
            // Bordi alberi
            if (y === 0 || y === MAP_HEIGHT-1 || x === 0 || x === MAP_WIDTH-1) {
                map[y][x] = 2;
            }
            // Centro Pokémon (casa con tetto rosso)
            else if (y >= 20 && y <= 24 && x >= 13 && x <= 15) {
                if (y === 20) map[y][x] = 7; // tetto rosso
                else if (x === 13 || x === 15 || y === 24) map[y][x] = 5; // muri
                else if (y === 23 && x === 14) map[y][x] = 8; // porta
                else map[y][x] = 6; // interno
            }
            // Sentiero verso il centro
            else if (y > 18 && y < 25 && x === 14) {
                map[y][x] = 5;
            }
            // Lago
            else if (y > 8 && y < 14 && x > 3 && x < 8) {
                map[y][x] = 3;
            }
            // Montagne
            else if (y > 4 && y < 9 && x > 21 && x < 27) {
                map[y][x] = 4;
            }
            // Bosco
            else if (y > 15 && y < 20 && x > 2 && x < 7) {
                map[y][x] = 2;
            }
            // Erba alta
            else if (Math.random() < 0.18 && x > 8 && x < 22 && y > 3 && y < 18) {
                map[y][x] = 1;
            }
            // Erba normale
            else {
                map[y][x] = 0;
            }
        }
    }
    // Percorsi aggiuntivi
    for (let x = 10; x < 19; x++) {
        if (map[15][x] === 0) map[15][x] = 5;
    }
    for (let y = 15; y < 21; y++) {
        if (map[y][10] === 0) map[y][10] = 5;
        if (map[y][18] === 0) map[y][18] = 5;
    }
    return map;
}

// ---------- DISEGNO MAPPA ----------
function drawMap() {
    for (let row = 0; row < MAP_HEIGHT; row++) {
        for (let col = 0; col < MAP_WIDTH; col++) {
            const tile = currentMap[row][col];
            const x = col * TILE_SIZE;
            const y = row * TILE_SIZE;

            switch (tile) {
                case 0: // Erba normale
                    ctx.fillStyle = '#8bac0f';
                    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                    break;
                case 1: // Erba alta (pattern strisce)
                    ctx.fillStyle = '#7a9a0a';
                    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = '#6b8c0f';
                    for (let i = 0; i < 3; i++) {
                        ctx.fillRect(x + 2, y + i * 6 + 1, TILE_SIZE - 4, 2);
                    }
                    ctx.fillStyle = '#5a7a08';
                    ctx.fillRect(x + 4, y + 3, 3, 10);
                    ctx.fillRect(x + 10, y + 2, 2, 12);
                    break;
                case 2: // Albero
                    ctx.fillStyle = '#5a7247';
                    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = '#3d5a2b';
                    ctx.fillRect(x + 4, y + 4, 8, 8);
                    ctx.fillStyle = '#4a6b2a';
                    ctx.fillRect(x + 2, y + 2, 4, 4);
                    ctx.fillRect(x + 10, y + 2, 4, 4);
                    break;
                case 3: // Acqua
                    ctx.fillStyle = '#4f7aa6';
                    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = '#6ba0cc';
                    ctx.fillRect(x + 2, y + 2, 4, 2);
                    ctx.fillRect(x + 10, y + 8, 4, 2);
                    ctx.fillRect(x + 6, y + 12, 4, 2);
                    break;
                case 4: // Montagna
                    ctx.fillStyle = '#8b7a6b';
                    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = '#a09080';
                    ctx.fillRect(x + 2, y + 2, 6, 4);
                    ctx.fillRect(x + 8, y + 6, 4, 6);
                    break;
                case 5: // Sentiero
                    ctx.fillStyle = '#c4a882';
                    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = '#b8986a';
                    ctx.fillRect(x + 4, y + 4, 2, 2);
                    ctx.fillRect(x + 10, y + 10, 2, 2);
                    break;
                case 6: // Interno casa
                    ctx.fillStyle = '#e8d8c0';
                    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                    break;
                case 7: // Tetto centro Pokémon (rosso)
                    ctx.fillStyle = '#e04040';
                    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = '#cc3030';
                    ctx.fillRect(x + 4, y + 4, 8, 4);
                    break;
                case 8: // Porta
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = '#DAA520';
                    ctx.fillRect(x + 5, y + 6, 6, 6);
                    break;
            }
        }
    }

    // Giocatore
    const playerX = gameState.player.x * TILE_SIZE;
    const playerY = gameState.player.y * TILE_SIZE;
    // Corpo
    ctx.fillStyle = '#e03a4e';
    ctx.fillRect(playerX + 4, playerY, 8, 8);
    // Viso
    ctx.fillStyle = '#f8e3c4';
    ctx.fillRect(playerX + 4, playerY + 8, 8, 8);
    // Occhi
    ctx.fillStyle = '#000';
    ctx.fillRect(playerX + 6, playerY + 10, 2, 2);
    ctx.fillRect(playerX + 10, playerY + 10, 2, 2);
    // Cappello
    ctx.fillStyle = '#e03a4e';
    ctx.fillRect(playerX + 3, playerY, 10, 3);
    ctx.fillRect(playerX + 2, playerY + 2, 12, 2);
}

// ---------- SPRITE BESTIAEMON ----------
function drawMonsterSprite(monster, x, y, size) {
    const colors = SPRITE_COLORS[monster.name] || ['#888', '#aaa'];
    
    // Corpo principale
    ctx.fillStyle = colors[0];
    ctx.fillRect(x, y, size, size);
    
    // Dettagli (occhi, strisce)
    ctx.fillStyle = colors[1];
    // Striscia superiore
    ctx.fillRect(x + size * 0.2, y, size * 0.6, size * 0.2);
    // Striscia centrale
    ctx.fillRect(x, y + size * 0.4, size, size * 0.2);
    
    // Occhi
    ctx.fillStyle = '#FFF';
    ctx.fillRect(x + size * 0.2, y + size * 0.25, size * 0.25, size * 0.2);
    ctx.fillRect(x + size * 0.55, y + size * 0.25, size * 0.25, size * 0.2);
    ctx.fillStyle = '#000';
    ctx.fillRect(x + size * 0.3, y + size * 0.28, size * 0.1, size * 0.12);
    ctx.fillRect(x + size * 0.65, y + size * 0.28, size * 0.1, size * 0.12);
    
    // Bocca
    ctx.fillStyle = '#000';
    ctx.fillRect(x + size * 0.3, y + size * 0.7, size * 0.4, size * 0.1);
    
    // Corna/orecchie in base al tipo
    if (monster.types.includes(TYPES.ZANNA)) {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(x, y - size * 0.15, size * 0.2, size * 0.2);
        ctx.fillRect(x + size * 0.8, y - size * 0.15, size * 0.2, size * 0.2);
    }
    if (monster.types.includes(TYPES.ALA)) {
        ctx.fillStyle = colors[1];
        ctx.fillRect(x - size * 0.2, y + size * 0.3, size * 0.25, size * 0.4);
        ctx.fillRect(x + size * 0.95, y + size * 0.3, size * 0.25, size * 0.4);
    }
}

// ---------- MOVIMENTO ----------
function canMoveTo(x, y) {
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
    const tile = currentMap[y][x];
    return tile !== 2 && tile !== 3 && tile !== 4 && tile !== 7;
}

function movePlayer(dx, dy, direction) {
    const newX = gameState.player.x + dx;
    const newY = gameState.player.y + dy;
    
    if (canMoveTo(newX, newY)) {
        gameState.player.x = newX;
        gameState.player.y = newY;
        gameState.player.direction = direction;
        
        // Controlla se è entrato nel Centro Pokémon
        checkPokeCenter();
        checkForEncounter();
        drawGameScene();
    }
}

// ---------- CENTRO POKEMON ----------
function checkPokeCenter() {
    const px = gameState.player.x;
    const py = gameState.player.y;
    const tile = currentMap[py][px];
    
    if (tile === 8 && gameState.player.team.length > 0) {
        let needsHeal = false;
        gameState.player.team.forEach(m => {
            if (m.currentHp < m.maxHp) needsHeal = true;
            m.currentHp = m.maxHp;
        });
        if (needsHeal) {
            gameState.dialogueQueue = ['🏥 Centro Bestiaemon: I tuoi mostri sono stati curati!'];
        } else {
            gameState.dialogueQueue = ['🏥 Centro Bestiaemon: I tuoi mostri stanno già bene!'];
        }
        updateDialogue();
        drawGameScene();
    }
}

// ---------- INCONTRI ----------
function getWildMonster() {
    const zoneMap = { 1: 'plains', 2: 'forest', 3: 'water', 4: 'mountain' };
    const currentTile = currentMap[gameState.player.y][gameState.player.x];
    const zone = zoneMap[currentTile] || 'plains';
    const candidates = BESTIAEMON_DATA.filter(m => m.zone === zone);
    if (candidates.length === 0) return null;
    
    const base = candidates[Math.floor(Math.random() * candidates.length)];
    const level = Math.floor(Math.random() * 5) + 3;
    
    return {
        ...base,
        level: level,
        currentHp: base.stats[0] + level * 2,
        maxHp: base.stats[0] + level * 2,
        attack: base.stats[1] + level,
        defense: base.stats[2] + level,
        speed: base.stats[3] + level,
        moves: base.moves.slice(0, 3)
    };
}

function checkForEncounter() {
    const tile = currentMap[gameState.player.y][gameState.player.x];
    if (tile === 1 && Math.random() < 0.2 && gameState.scene === 'world') {
        const wild = getWildMonster();
        if (wild) {
            gameState.wildMonster = wild;
            gameState.scene = 'battle';
            gameState.dialogueQueue = [`Appare un ${wild.name} selvatico! (Lv.${wild.level})`];
            gameState.battle = { playerActiveIdx: 0, turn: 'player' };
            updateDialogue();
            drawGameScene();
        }
    }
}

// ---------- BATTAGLIA ----------
function calculateBattleDamage(attacker, defender, moveName) {
    const move = MOVES[moveName] || { type: TYPES.ZANNA, power: 20 };
    let effectiveness = 1;
    const moveType = move.type;
    if (TYPE_EFFECTIVENESS[moveType]) {
        for (const defType of defender.types) {
            if (TYPE_EFFECTIVENESS[moveType].strong.includes(defType)) effectiveness *= 1.8;
            else if (TYPE_EFFECTIVENESS[moveType].weak.includes(defType)) effectiveness *= 0.6;
        }
    }
    const baseDamage = ((2 * attacker.level / 5 + 2) * move.power * attacker.attack / defender.defense / 50 + 2);
    return Math.max(1, Math.floor(baseDamage * effectiveness));
}

function playerAttack(moveName) {
    if (!gameState.battle || gameState.battle.turn !== 'player') return;
    const playerMon = gameState.player.team[gameState.battle.playerActiveIdx];
    const wildMon = gameState.wildMonster;
    if (!playerMon || playerMon.currentHp <= 0) return;
    
    const damage = calculateBattleDamage(playerMon, wildMon, moveName);
    wildMon.currentHp -= damage;
    gameState.dialogueQueue[0] = `${playerMon.name} usa ${moveName}! -${damage} HP`;
    
    if (wildMon.currentHp <= 0) {
        wildMon.currentHp = 0;
        gameState.dialogueQueue[0] = `${wildMon.name} è esausto! Hai vinto!`;
        endBattle(true);
        return;
    }
    gameState.battle.turn = 'enemy';
    updateDialogue();
    drawGameScene();
    setTimeout(enemyTurn, 800);
}

function enemyTurn() {
    if (!gameState.battle || gameState.battle.turn !== 'enemy') return;
    const playerMon = gameState.player.team[gameState.battle.playerActiveIdx];
    const wildMon = gameState.wildMonster;
    if (!playerMon || !wildMon) return;
    
    const randomMove = wildMon.moves[Math.floor(Math.random() * wildMon.moves.length)];
    const damage = calculateBattleDamage(wildMon, playerMon, randomMove);
    playerMon.currentHp -= damage;
    gameState.dialogueQueue[0] = `${wildMon.name} usa ${randomMove}! -${damage} HP`;
    
    if (playerMon.currentHp <= 0) {
        playerMon.currentHp = 0;
        gameState.dialogueQueue[0] = `${playerMon.name} è esausto!`;
        if (gameState.player.team.every(m => m.currentHp <= 0)) {
            gameState.dialogueQueue[0] += ' Corri al Centro Bestiaemon!';
            setTimeout(() => {
                gameState.player.team.forEach(m => { m.currentHp = 1; });
                gameState.scene = 'world';
                gameState.battle = null;
                gameState.wildMonster = null;
                updateDialogue();
                drawGameScene();
                saveGame();
            }, 1500);
            updateDialogue();
            drawGameScene();
            return;
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
        updateDialogue();
        return;
    }
    gameState.player.inventory.pokeballs--;
    const wild = gameState.wildMonster;
    const hpFactor = wild.currentHp / wild.maxHp;
    const catchRate = 0.5 - hpFactor * 0.4 + 0.15;
    
    if (Math.random() < catchRate) {
        gameState.dialogueQueue[0] = `Preso! Hai catturato ${wild.name}!`;
        gameState.player.caught.add(wild.id);
        gameState.player.seen.add(wild.id);
        if (gameState.player.team.length < 6) gameState.player.team.push(wild);
        endBattle(true);
    } else {
        gameState.dialogueQueue[0] = "Oh no! Si è liberato!";
        gameState.battle.turn = 'enemy';
        updateDialogue();
        drawGameScene();
        setTimeout(enemyTurn, 800);
    }
}

function endBattle(victory) {
    if (victory && gameState.battle && gameState.player.team[gameState.battle.playerActiveIdx]) {
        const playerMon = gameState.player.team[gameState.battle.playerActiveIdx];
        if (playerMon && gameState.wildMonster) {
            playerMon.exp += gameState.wildMonster.level * 25;
            if (playerMon.exp >= playerMon.level * 30) {
                playerMon.level++;
                playerMon.maxHp += 3;
                playerMon.currentHp = playerMon.maxHp;
                playerMon.attack += 2;
                playerMon.defense += 2;
                playerMon.speed += 2;
                gameState.dialogueQueue[0] += ` ${playerMon.name} sale al Lv.${playerMon.level}!`;
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

// ---------- DIALOGHI ----------
function updateDialogue() {
    dialogueBox.textContent = gameState.dialogueQueue.length > 0 ? gameState.dialogueQueue[0] : '';
}

// ---------- DISEGNO SCENE ----------
function drawTitleScene() {
    ctx.fillStyle = '#1e1e2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f7e3b2';
    ctx.font = '26px "Courier New"';
    ctx.fillText('BESTIAEMON: Lince', 75, 160);
    ctx.font = '13px "Courier New"';
    ctx.fillText('Premi INVIO per Nuova Partita', 100, 210);
    ctx.fillText('Premi M per Caricare Partita', 105, 235);
}

function drawHpBar(x, y, current, max) {
    const barWidth = 120;
    const barHeight = 10;
    const percent = Math.max(0, current / max);
    
    // Sfondo barra
    ctx.fillStyle = '#333';
    ctx.fillRect(x, y, barWidth, barHeight);
    // Bordo
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, barWidth, barHeight);
    // Riempimento
    let color;
    if (percent > 0.5) color = '#4cd964';
    else if (percent > 0.25) color = '#ffcc00';
    else color = '#ff3b30';
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, (barWidth - 2) * percent, barHeight - 2);
    // Testo HP
    ctx.fillStyle = '#fff';
    ctx.font = '9px "Courier New"';
    ctx.fillText(`${current}/${max}`, x + 35, y + 9);
}

function getTypeColor(type) {
    const colors = {
        Fuoco: '#e04040', Acqua: '#4080e0', Bosco: '#40a040',
        Roccia: '#a08060', Zanna: '#c0a040', Veleno: '#a040a0',
        Luce: '#e0d040', Ombra: '#604080', Ala: '#a0c0e0', Gelo: '#80c0e0'
    };
    return colors[type] || '#888';
}

function drawBattleScene() {
    ctx.fillStyle = '#2a2a3a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!gameState.wildMonster) return;
    
    // Bestiaemon selvatico
    drawMonsterSprite(gameState.wildMonster, 340, 50, 80);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px "Courier New"';
    ctx.fillText(gameState.wildMonster.name, 320, 150);
    ctx.fillText(`Lv.${gameState.wildMonster.level}`, 420, 150);
    drawHpBar(320, 158, gameState.wildMonster.currentHp, gameState.wildMonster.maxHp);
    
    // Bestiaemon giocatore
    const playerMon = gameState.player.team[gameState.battle?.playerActiveIdx || 0];
    if (playerMon) {
        drawMonsterSprite(playerMon, 50, 240, 80);
        ctx.fillStyle = '#fff';
        ctx.fillText(playerMon.name, 30, 340);
        ctx.fillText(`Lv.${playerMon.level}`, 130, 340);
        drawHpBar(30, 348, playerMon.currentHp, playerMon.maxHp);
    }
    
    // Comandi
    ctx.fillStyle = '#e8e0c8';
    ctx.fillRect(20, 380, 440, 40);
    ctx.fillStyle = '#000';
    ctx.font = '13px "Courier New"';
    ctx.fillText('A: Attacco | C: Cattura | F: Fuga', 60, 405);
}

function drawGameScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gameState.scene === 'title') drawTitleScene();
    else if (gameState.scene === 'world') drawMap();
    else if (gameState.scene === 'battle') drawBattleScene();
    else if (gameState.scene === 'talk') {
        ctx.fillStyle = '#1e1e2a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f7e3b2';
        ctx.font = '15px "Courier New"';
        ctx.fillText('Scegli il tuo starter:', 135, 170);
        ctx.fillText('Z - Zebrafalla (Fuoco/Luce)', 100, 210);
        ctx.fillText('P - Pescecane (Acqua/Zanna)', 100, 240);
        ctx.fillText('C - Crocovolo (Bosco/Roccia)', 100, 270);
    }
    updateDialogue();
}

// ---------- STARTER, SALVATAGGIO ----------
function chooseStarter(id) {
    const base = BESTIAEMON_DATA.find(m => m.id === id);
    if (!base) return;
    const starter = {
        ...base, level: 5,
        currentHp: base.stats[0] + 10, maxHp: base.stats[0] + 10,
        attack: base.stats[1] + 5, defense: base.stats[2] + 5, speed: base.stats[3] + 5,
        exp: 0, moves: base.moves.slice(0, 4)
    };
    gameState.player.team = [starter];
    gameState.player.seen.add(starter.id);
    gameState.player.caught.add(starter.id);
    gameState.scene = 'world';
    gameState.dialogueQueue = [`Hai scelto ${starter.name}! Esplora il mondo!`];
    currentMap = generateMap();
    updateDialogue();
    drawGameScene();
    saveGame();
}

function showStarterSelection() {
    gameState.scene = 'talk';
    gameState.dialogueQueue = ["Professor Larice: Scegli il tuo primo Bestiaemon!"];
    updateDialogue();
    drawGameScene();
}

function saveGame() {
    const data = {
        player: { x: gameState.player.x, y: gameState.player.y, direction: gameState.player.direction, team: gameState.player.team, inventory: gameState.player.inventory },
        seen: Array.from(gameState.player.seen),
        caught: Array.from(gameState.player.caught)
    };
    localStorage.setItem('bestiaemon_save', JSON.stringify(data));
}

function loadGame() {
    const raw = localStorage.getItem('bestiaemon_save');
    if (!raw) return false;
    try {
        const data = JSON.parse(raw);
        gameState.player.x = data.player.x;
        gameState.player.y = data.player.y;
        gameState.player.direction = data.player.direction;
        gameState.player.team = data.player.team;
        gameState.player.inventory = data.player.inventory;
        gameState.player.seen = new Set(data.seen);
        gameState.player.caught = new Set(data.caught);
        gameState.scene = 'world';
        currentMap = generateMap();
        gameState.dialogueQueue = ['Partita caricata!'];
        updateDialogue();
        drawGameScene();
        return true;
    } catch(e) { return false; }
}

// ---------- INPUT ----------
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    e.preventDefault();
    
    if (gameState.scene === 'title') {
        if (key === 'enter') { if (loadGame()) return; showStarterSelection(); }
        if (key === 'm') { if (loadGame()) return; gameState.dialogueQueue = ['Nessun salvataggio trovato. Premi INVIO per iniziare.']; updateDialogue(); }
        return;
    }
    if (gameState.scene === 'talk') {
        if (key === 'z') chooseStarter(9);
        if (key === 'p') chooseStarter(10);
        if (key === 'c') chooseStarter(8);
        return;
    }
    if (gameState.scene === 'world') {
        switch(key) {
            case 'arrowup': movePlayer(0, -1, 'up'); break;
            case 'arrowdown': movePlayer(0, 1, 'down'); break;
            case 'arrowleft': movePlayer(-1, 0, 'left'); break;
            case 'arrowright': movePlayer(1, 0, 'right'); break;
            case 'enter': case ' ':
                if (gameState.dialogueQueue.length > 0) { gameState.dialogueQueue.shift(); updateDialogue(); }
                break;
            case 'm':
                const info = gameState.player.team.map(m => `${m.name} Lv.${m.level} HP:${m.currentHp}/${m.maxHp}`).join(' | ');
                gameState.dialogueQueue = [`🎒 Sfere: ${gameState.player.inventory.pokeballs} | ${info || 'Nessun mostro'}`];
                updateDialogue();
                break;
        }
        return;
    }
    if (gameState.scene === 'battle') {
        if (key === 'a' && gameState.battle?.turn === 'player') {
            const mon = gameState.player.team[gameState.battle.playerActiveIdx];
            if (mon && mon.moves.length > 0) playerAttack(mon.moves[0]);
        }
        if (key === 'c' && gameState.battle?.turn === 'player') tryCatch();
        if (key === 'f') { gameState.dialogueQueue[0] = "Sei fuggito!"; endBattle(false); }
        return;
    }
});

// ---------- AVVIO ----------
currentMap = generateMap();
drawTitleScene();
updateDialogue();
