/**
 * Gaming España - Juegos Component
 * Version 4.0 - Advanced Games Edition
 * Juegos avanzados: Buscaminas (3 difs), Snake, Tetris, Conecta 4 (IA), Memory (timer), Ahorcado (categorías), Tres en Raya (Minimax)
 * Juegos sencillos: Adivina el Número, Piedra Papel Tijera
 */

// ===================================
// DOM REFERENCES
// ===================================
const gameContainer = document.getElementById('game-container');

// ===================================
// GAME STATE
// ===================================
let currentGame = null;
let activeGameLoop = null; // para cancelar loops de juego activos

// ===================================
// CATEGORY TOGGLE (Juegos Sencillos)
// ===================================
const classicToggle = document.getElementById('classic-toggle');
const classicSelector = document.getElementById('game-selector-classic');
const toggleArrow = document.getElementById('toggle-arrow');

if (classicToggle) {
    classicToggle.addEventListener('click', () => {
        const isCollapsed = classicSelector.classList.contains('collapsed');
        classicSelector.classList.toggle('collapsed');
        toggleArrow.textContent = isCollapsed ? '▲' : '▼';
        classicToggle.setAttribute('aria-expanded', isCollapsed ? 'true' : 'false');
    });
}

// ===================================
// GAME SELECTOR INITIALIZATION
// ===================================
document.addEventListener('click', (e) => {
    const card = e.target.closest('.game-card');
    if (card) {
        const gameName = card.dataset.game;
        document.querySelectorAll('.game-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        stopActiveGame();
        loadGame(gameName);
        // Scroll suave al contenedor del juego
        setTimeout(() => {
            gameContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    // Juegos destacados en welcome
    const featured = e.target.closest('.clickable-featured');
    if (featured) {
        const gameName = featured.dataset.game;
        const card = document.querySelector(`.game-card[data-game="${gameName}"]`);
        if (card) {
            document.querySelectorAll('.game-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        }
        stopActiveGame();
        loadGame(gameName);
    }
});

// ===================================
// STOP ACTIVE GAME (evitar memory leaks)
// ===================================
function stopActiveGame() {
    if (activeGameLoop) {
        clearInterval(activeGameLoop);
        clearTimeout(activeGameLoop);
        activeGameLoop = null;
    }
}

// ===================================
// GAME LOADER
// ===================================
function loadGame(selectedGame) {
    currentGame = selectedGame;
    gameContainer.innerHTML = '';
    gameContainer.style.animation = 'none';
    gameContainer.offsetHeight;
    gameContainer.style.animation = 'fadeIn 0.3s ease';
    gameContainer.classList.remove('has-welcome');

    const games = {
        'minesweeper': loadMinesweeperGame,
        'snake': loadSnakeGame,
        'tetris': loadTetrisGame,
        'connect4': loadConnect4Game,
        'tic-tac-toe': loadTicTacToeGame,
        '2048': load2048Game,
        'pong': loadPongGame,
        'flappy': loadFlappyGame,
        'memory-game': loadMemoryGame,
        'hangman': loadHangmanGame,
        'dino-game': loadDinoGame,
        'guess-number': loadGuessNumberGame,
        'rock-paper-scissors': loadRockPaperScissorsGame,
    };

    if (games[selectedGame]) {
        games[selectedGame]();
    }
}

// ===================================
// HELPER FUNCTIONS
// ===================================
function createGameHTML(title, content) {
    return `
        <div class="game-header">
            <h2>${title}</h2>
        </div>
        <div class="game-content">
            ${content}
        </div>
    `;
}

// ===================================
// 💣 BUSCAMINAS MEJORADO (3 dificultades + timer + best time)
// ===================================
function loadMinesweeperGame() {
    const DIFFICULTIES = {
        easy:   { grid: 8,  mines: 10, label: 'Fácil' },
        medium: { grid: 10, mines: 20, label: 'Medio' },
        hard:   { grid: 14, mines: 40, label: 'Difícil' }
    };
    let currentDiff = 'medium';
    let grid = [], revealed = [], flagged = [];
    let gameOver = false, firstClick = true, safeCells = 0;
    let timerInterval = null, seconds = 0;
    let bestTimes = { easy: null, medium: null, hard: null };

    function getDiff() { return DIFFICULTIES[currentDiff]; }

    gameContainer.innerHTML = createGameHTML('💣 Buscaminas', `
        <div class="mines-difficulty-tabs">
            <button class="mines-diff-btn" data-diff="easy">🟢 Fácil<br><small>8×8 · 10 minas</small></button>
            <button class="mines-diff-btn active" data-diff="medium">🟡 Medio<br><small>10×10 · 20 minas</small></button>
            <button class="mines-diff-btn" data-diff="hard">🔴 Difícil<br><small>14×14 · 40 minas</small></button>
        </div>
        <div class="mines-topbar">
            <span>🚩 <strong id="mines-count">20</strong></span>
            <span class="mines-timer">⏱️ <strong id="mines-timer">0s</strong></span>
            <span>🏆 Récord: <strong id="mines-best">--</strong></span>
        </div>
        <div class="mines-grid" id="mines-grid"></div>
        <div class="mines-help"><p>🖱️ Click = Revelar &nbsp;|&nbsp; Click derecho = Bandera</p></div>
        <div id="mines-result" class="game-result"></div>
        <button id="mines-reset" class="game-reset-btn">🔄 Nuevo Juego</button>
    `);

    document.querySelectorAll('.mines-diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mines-diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDiff = btn.dataset.diff;
            initGame();
        });
    });

    document.getElementById('mines-reset').addEventListener('click', initGame);

    function initGame() {
        const { grid: G, mines: M } = getDiff();
        grid = Array(G).fill().map(() => Array(G).fill(0));
        revealed = Array(G).fill().map(() => Array(G).fill(false));
        flagged = Array(G).fill().map(() => Array(G).fill(false));
        gameOver = false; firstClick = true;
        safeCells = G * G - M;
        seconds = 0;

        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById('mines-timer').textContent = '0s';
        document.getElementById('mines-count').textContent = M;
        document.getElementById('mines-result').className = 'game-result';
        document.getElementById('mines-result').textContent = '';
        document.getElementById('mines-best').textContent = bestTimes[currentDiff] ? bestTimes[currentDiff] + 's' : '--';

        renderGrid();
    }

    function placeMines(safeX, safeY) {
        const { grid: G, mines: M } = getDiff();
        let placed = 0;
        while (placed < M) {
            const x = Math.floor(Math.random() * G);
            const y = Math.floor(Math.random() * G);
            if (grid[y][x] !== -1 && (Math.abs(x - safeX) > 1 || Math.abs(y - safeY) > 1)) {
                grid[y][x] = -1; placed++;
            }
        }
        for (let y = 0; y < G; y++)
            for (let x = 0; x < G; x++)
                if (grid[y][x] !== -1) grid[y][x] = countMines(x, y, G);
    }

    function countMines(x, y, G) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++) {
                const ny = y + dy, nx = x + dx;
                if (ny >= 0 && ny < G && nx >= 0 && nx < G && grid[ny][nx] === -1) count++;
            }
        return count;
    }

    function renderGrid() {
        const { grid: G } = getDiff();
        const gridEl = document.getElementById('mines-grid');
        if (!gridEl) return;
        gridEl.innerHTML = '';
        gridEl.style.gridTemplateColumns = `repeat(${G}, 1fr)`;
        gridEl.style.maxWidth = `${G * 36}px`;

        for (let y = 0; y < G; y++) {
            for (let x = 0; x < G; x++) {
                const cell = document.createElement('div');
                cell.className = 'mines-cell';
                cell.dataset.x = x; cell.dataset.y = y;
                if (revealed[y][x]) {
                    cell.classList.add('revealed');
                    if (grid[y][x] === -1) { cell.textContent = '💣'; cell.classList.add('mine'); }
                    else if (grid[y][x] > 0) { cell.textContent = grid[y][x]; cell.dataset.num = grid[y][x]; }
                } else if (flagged[y][x]) {
                    cell.textContent = '🚩';
                }
                cell.addEventListener('click', () => reveal(x, y));
                cell.addEventListener('contextmenu', e => { e.preventDefault(); toggleFlag(x, y); });
                gridEl.appendChild(cell);
            }
        }
    }

    function reveal(x, y) {
        const { grid: G, mines: M } = getDiff();
        if (gameOver || revealed[y][x] || flagged[y][x]) return;
        if (firstClick) {
            placeMines(x, y); firstClick = false;
            timerInterval = setInterval(() => {
                seconds++;
                const el = document.getElementById('mines-timer');
                if (el) el.textContent = seconds + 's';
            }, 1000);
            activeGameLoop = timerInterval;
        }
        revealed[y][x] = true;
        if (grid[y][x] === -1) {
            gameOver = true; clearInterval(timerInterval);
            revealAllMines(G);
            const res = document.getElementById('mines-result');
            if (res) { res.className = 'game-result error'; res.textContent = '💥 ¡BOOM! Pisaste una mina...'; }
            return;
        }
        safeCells--;
        if (safeCells === 0) {
            gameOver = true; clearInterval(timerInterval);
            if (!bestTimes[currentDiff] || seconds < bestTimes[currentDiff]) bestTimes[currentDiff] = seconds;
            const res = document.getElementById('mines-result');
            if (res) { res.className = 'game-result success'; res.textContent = `🎉 ¡GANASTE en ${seconds} segundos!`; }
            const best = document.getElementById('mines-best');
            if (best) best.textContent = bestTimes[currentDiff] + 's';
        }
        if (grid[y][x] === 0)
            for (let dy = -1; dy <= 1; dy++)
                for (let dx = -1; dx <= 1; dx++) {
                    const ny = y + dy, nx = x + dx;
                    if (ny >= 0 && ny < G && nx >= 0 && nx < G) reveal(nx, ny);
                }
        renderGrid();
    }

    function toggleFlag(x, y) {
        if (gameOver || revealed[y][x]) return;
        const { mines: M } = getDiff();
        flagged[y][x] = !flagged[y][x];
        const count = flagged.flat().filter(f => f).length;
        const el = document.getElementById('mines-count');
        if (el) el.textContent = M - count;
        renderGrid();
    }

    function revealAllMines(G) {
        for (let y = 0; y < G; y++)
            for (let x = 0; x < G; x++)
                if (grid[y][x] === -1) revealed[y][x] = true;
        renderGrid();
    }

    initGame();
}

// ===================================
// 🐍 SNAKE (NUEVO)
// ===================================
function loadSnakeGame() {
    const CELL = 20, COLS = 20, ROWS = 18;
    let snake, dir, nextDir, food, score, highScore, gameRunning, gameStarted, speed;

    gameContainer.innerHTML = createGameHTML('🐍 Snake', `
        <div class="snake-topbar">
            <span>🏆 Récord: <strong id="snake-high">0</strong></span>
            <span>⭐ Puntos: <strong id="snake-score">0</strong></span>
            <span class="snake-speed-label">Velocidad: <strong id="snake-speed-label">Normal</strong></span>
        </div>
        <div class="snake-wrap">
            <canvas id="snake-canvas" width="${COLS * CELL}" height="${ROWS * CELL}"></canvas>
            <div class="snake-overlay" id="snake-overlay">
                <div class="snake-overlay-box">
                    <div style="font-size:3rem">🐍</div>
                    <h3>Snake</h3>
                    <p>Usa las flechas del teclado<br>o los botones de abajo</p>
                    <div class="snake-speed-select">
                        <button class="speed-btn" data-speed="200">🐢 Lento</button>
                        <button class="speed-btn active" data-speed="130">🐍 Normal</button>
                        <button class="speed-btn" data-speed="70">⚡ Rápido</button>
                    </div>
                    <button id="snake-start-btn" class="game-action-btn" style="margin-top:1rem">▶ Empezar</button>
                </div>
            </div>
        </div>
        <div class="snake-dpad">
            <button class="dpad-btn" id="dpad-up">▲</button>
            <div class="dpad-row">
                <button class="dpad-btn" id="dpad-left">◀</button>
                <button class="dpad-btn dpad-center" id="dpad-pause">⏸</button>
                <button class="dpad-btn" id="dpad-right">▶</button>
            </div>
            <button class="dpad-btn" id="dpad-down">▼</button>
        </div>
        <button id="snake-reset" class="game-reset-btn">🔄 Reiniciar</button>
    `);

    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    speed = 130;
    highScore = 0;

    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            speed = parseInt(btn.dataset.speed);
            const labels = { 200: 'Lento', 130: 'Normal', 70: 'Rápido' };
            const lbl = document.getElementById('snake-speed-label');
            if (lbl) lbl.textContent = labels[speed];
        });
    });

    document.getElementById('snake-start-btn').addEventListener('click', startGame);
    document.getElementById('snake-reset').addEventListener('click', resetGame);

    // D-pad
    document.getElementById('dpad-up').addEventListener('click', () => { if (dir.y !== 1) nextDir = { x: 0, y: -1 }; });
    document.getElementById('dpad-down').addEventListener('click', () => { if (dir.y !== -1) nextDir = { x: 0, y: 1 }; });
    document.getElementById('dpad-left').addEventListener('click', () => { if (dir.x !== 1) nextDir = { x: -1, y: 0 }; });
    document.getElementById('dpad-right').addEventListener('click', () => { if (dir.x !== -1) nextDir = { x: 1, y: 0 }; });
    document.getElementById('dpad-pause').addEventListener('click', togglePause);

    // Keyboard
    document.addEventListener('keydown', handleKey);

    function handleKey(e) {
        if (!gameRunning || !gameStarted) return;
        const map = {
            'ArrowUp': { x: 0, y: -1 }, 'ArrowDown': { x: 0, y: 1 },
            'ArrowLeft': { x: -1, y: 0 }, 'ArrowRight': { x: 1, y: 0 },
            'w': { x: 0, y: -1 }, 's': { x: 0, y: 1 },
            'a': { x: -1, y: 0 }, 'd': { x: 1, y: 0 }
        };
        if (map[e.key]) {
            const nd = map[e.key];
            if (nd.x !== -dir.x || nd.y !== -dir.y) nextDir = nd;
            if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
        }
        if (e.key === 'p' || e.key === 'P') togglePause();
    }

    let paused = false;
    function togglePause() {
        if (!gameStarted) return;
        paused = !paused;
        const btn = document.getElementById('dpad-pause');
        if (btn) btn.textContent = paused ? '▶' : '⏸';
        if (!paused) gameLoop();
    }

    function initState() {
        snake = [{ x: 10, y: 9 }, { x: 9, y: 9 }, { x: 8, y: 9 }];
        dir = { x: 1, y: 0 }; nextDir = { x: 1, y: 0 };
        score = 0; gameRunning = true; gameStarted = false; paused = false;
        placeFood();
        updateScoreDisplay();
    }

    function placeFood() {
        do {
            food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
        } while (snake.some(s => s.x === food.x && s.y === food.y));
    }

    function startGame() {
        const overlay = document.getElementById('snake-overlay');
        if (overlay) overlay.style.display = 'none';
        gameStarted = true;
        gameLoop();
    }

    function gameLoop() {
        if (!gameRunning || paused) return;
        clearInterval(activeGameLoop);
        activeGameLoop = setInterval(update, speed);
    }

    function update() {
        if (!gameRunning || paused) return;
        dir = { ...nextDir };
        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

        // Wall collision
        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) { endGame(); return; }
        // Self collision
        if (snake.some(s => s.x === head.x && s.y === head.y)) { endGame(); return; }

        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            if (score > highScore) highScore = score;
            updateScoreDisplay();
            placeFood();
        } else {
            snake.pop();
        }
        draw();
    }

    function draw() {
        // Background
        ctx.fillStyle = '#0d0d1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, ROWS * CELL); ctx.stroke(); }
        for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(COLS * CELL, y * CELL); ctx.stroke(); }

        // Food
        ctx.fillStyle = '#ff4d6d';
        ctx.shadowColor = '#ff4d6d';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Snake
        snake.forEach((seg, i) => {
            const ratio = i / snake.length;
            const r = Math.round(100 + (155 * (1 - ratio)));
            const g = Math.round(220 - (100 * ratio));
            const b = Math.round(80 + (100 * (1 - ratio)));
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            if (i === 0) {
                ctx.shadowColor = '#7fff00';
                ctx.shadowBlur = 8;
            }
            const margin = i === 0 ? 1 : 2;
            ctx.beginPath();
            ctx.roundRect(seg.x * CELL + margin, seg.y * CELL + margin, CELL - margin * 2, CELL - margin * 2, 4);
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    }

    function updateScoreDisplay() {
        const s = document.getElementById('snake-score');
        const h = document.getElementById('snake-high');
        if (s) s.textContent = score;
        if (h) h.textContent = highScore;
    }

    function endGame() {
        gameRunning = false; clearInterval(activeGameLoop);
        // Draw game over
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff4d6d';
        ctx.font = 'bold 28px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💀 Game Over', canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillStyle = '#fff';
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText(`Puntuación: ${score}`, canvas.width / 2, canvas.height / 2 + 15);
        if (score >= highScore && score > 0) {
            ctx.fillStyle = '#fbbf24';
            ctx.fillText('🏆 ¡Nuevo récord!', canvas.width / 2, canvas.height / 2 + 40);
        }
    }

    function resetGame() {
        clearInterval(activeGameLoop);
        document.removeEventListener('keydown', handleKey);
        loadSnakeGame();
    }

    initState();
    draw();
}

// ===================================
// 🧱 TETRIS (NUEVO)
// ===================================
function loadTetrisGame() {
    const COLS = 10, ROWS = 20, CELL = 28;
    const COLORS = ['', '#ff4d6d','#7c3aed','#3b82f6','#10b981','#fbbf24','#06b6d4','#f97316'];
    const PIECES = [
        [[1,1,1,1]],                        // I
        [[2,2],[2,2]],                       // O
        [[0,3,0],[3,3,3]],                   // T
        [[4,0],[4,0],[4,4]],                 // J
        [[0,5],[0,5],[5,5]],                 // L
        [[0,6,6],[6,6,0]],                   // S
        [[7,7,0],[0,7,7]],                   // Z
    ];

    let board, piece, pieceX, pieceY, pieceType, nextType;
    let score, lines, level, gameRunning, paused, dropInterval;

    gameContainer.innerHTML = createGameHTML('🧱 Tetris', `
        <div class="tetris-layout">
            <div class="tetris-left">
                <canvas id="tetris-canvas" width="${COLS * CELL}" height="${ROWS * CELL}"></canvas>
            </div>
            <div class="tetris-right">
                <div class="tetris-panel">
                    <div class="tetris-info-box">
                        <span class="tetris-label">SIGUIENTE</span>
                        <canvas id="tetris-next" width="${4 * CELL}" height="${4 * CELL}"></canvas>
                    </div>
                    <div class="tetris-info-box">
                        <span class="tetris-label">PUNTOS</span>
                        <strong id="tetris-score">0</strong>
                    </div>
                    <div class="tetris-info-box">
                        <span class="tetris-label">LÍNEAS</span>
                        <strong id="tetris-lines">0</strong>
                    </div>
                    <div class="tetris-info-box">
                        <span class="tetris-label">NIVEL</span>
                        <strong id="tetris-level">1</strong>
                    </div>
                    <button id="tetris-pause" class="game-action-btn" style="width:100%;margin-top:.5rem">⏸ Pausa</button>
                </div>
            </div>
        </div>
        <div class="tetris-controls">
            <div class="tetris-dpad">
                <button class="dpad-btn" id="t-up">🔄 Rotar</button>
                <div class="dpad-row">
                    <button class="dpad-btn" id="t-left">◀</button>
                    <button class="dpad-btn" id="t-down">▼▼</button>
                    <button class="dpad-btn" id="t-right">▶</button>
                </div>
            </div>
        </div>
        <div class="tetris-overlay" id="tetris-overlay">
            <div class="tetris-overlay-box">
                <div style="font-size:3rem">🧱</div>
                <h3>Tetris</h3>
                <p>Flechas: mover y rotar<br>↓ rápido · ↑ rotar</p>
                <button id="tetris-start" class="game-action-btn" style="margin-top:1rem">▶ Empezar</button>
            </div>
        </div>
        <button id="tetris-reset" class="game-reset-btn">🔄 Reiniciar</button>
    `);

    const canvas = document.getElementById('tetris-canvas');
    const ctx = canvas.getContext('2d');
    const nextCanvas = document.getElementById('tetris-next');
    const nextCtx = nextCanvas.getContext('2d');

    document.getElementById('tetris-start').addEventListener('click', startTetris);
    document.getElementById('tetris-reset').addEventListener('click', () => { clearInterval(dropInterval); document.removeEventListener('keydown', handleTetrisKey); loadTetrisGame(); });
    document.getElementById('tetris-pause').addEventListener('click', toggleTetrisPause);

    document.getElementById('t-up').addEventListener('click', () => rotatePiece());
    document.getElementById('t-left').addEventListener('click', () => movePiece(-1));
    document.getElementById('t-right').addEventListener('click', () => movePiece(1));
    document.getElementById('t-down').addEventListener('click', () => { while (canPlace(piece, pieceX, pieceY + 1)) pieceY++; lockPiece(); });

    document.addEventListener('keydown', handleTetrisKey);

    function handleTetrisKey(e) {
        if (!gameRunning || paused) return;
        switch (e.key) {
            case 'ArrowLeft': movePiece(-1); e.preventDefault(); break;
            case 'ArrowRight': movePiece(1); e.preventDefault(); break;
            case 'ArrowDown': dropFast(); e.preventDefault(); break;
            case 'ArrowUp': rotatePiece(); e.preventDefault(); break;
            case ' ': { while (canPlace(piece, pieceX, pieceY + 1)) pieceY++; lockPiece(); e.preventDefault(); break; }
            case 'p': case 'P': toggleTetrisPause(); break;
        }
    }

    function initBoard() {
        board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
        score = 0; lines = 0; level = 1; paused = false;
        nextType = Math.floor(Math.random() * PIECES.length);
        spawnPiece();
        updateDisplay();
    }

    function startTetris() {
        const overlay = document.getElementById('tetris-overlay');
        if (overlay) overlay.style.display = 'none';
        gameRunning = true;
        dropInterval = setInterval(dropStep, getDropSpeed());
        activeGameLoop = dropInterval;
    }

    function getDropSpeed() { return Math.max(100, 700 - (level - 1) * 60); }

    function spawnPiece() {
        pieceType = nextType;
        nextType = Math.floor(Math.random() * PIECES.length);
        piece = PIECES[pieceType].map(row => [...row]);
        pieceX = Math.floor((COLS - piece[0].length) / 2);
        pieceY = 0;
        drawNext();
        if (!canPlace(piece, pieceX, pieceY)) { endTetris(); }
    }

    function dropStep() {
        if (canPlace(piece, pieceX, pieceY + 1)) { pieceY++; }
        else { lockPiece(); }
        drawBoard();
    }

    function dropFast() { if (canPlace(piece, pieceX, pieceY + 1)) { pieceY++; drawBoard(); } }

    function movePiece(dx) {
        if (canPlace(piece, pieceX + dx, pieceY)) { pieceX += dx; drawBoard(); }
    }

    function rotatePiece() {
        const rotated = piece[0].map((_, i) => piece.map(row => row[i]).reverse());
        if (canPlace(rotated, pieceX, pieceY)) { piece = rotated; drawBoard(); }
        else if (canPlace(rotated, pieceX - 1, pieceY)) { pieceX--; piece = rotated; drawBoard(); }
        else if (canPlace(rotated, pieceX + 1, pieceY)) { pieceX++; piece = rotated; drawBoard(); }
    }

    function canPlace(p, px, py) {
        for (let y = 0; y < p.length; y++)
            for (let x = 0; x < p[y].length; x++)
                if (p[y][x]) {
                    const nx = px + x, ny = py + y;
                    if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
                    if (ny >= 0 && board[ny][nx]) return false;
                }
        return true;
    }

    function lockPiece() {
        for (let y = 0; y < piece.length; y++)
            for (let x = 0; x < piece[y].length; x++)
                if (piece[y][x] && pieceY + y >= 0)
                    board[pieceY + y][pieceX + x] = piece[y][x];
        clearLines();
        spawnPiece();
        drawBoard();
    }

    function clearLines() {
        let cleared = 0;
        for (let y = ROWS - 1; y >= 0; y--) {
            if (board[y].every(c => c !== 0)) {
                board.splice(y, 1);
                board.unshift(Array(COLS).fill(0));
                cleared++; y++;
            }
        }
        if (cleared) {
            const pts = [0, 100, 300, 600, 1000];
            score += (pts[cleared] || 1000) * level;
            lines += cleared;
            level = Math.floor(lines / 10) + 1;
            clearInterval(dropInterval);
            dropInterval = setInterval(dropStep, getDropSpeed());
            activeGameLoop = dropInterval;
            updateDisplay();
        }
    }

    function drawBoard() {
        ctx.fillStyle = '#0d0d1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, ROWS * CELL); ctx.stroke(); }
        for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(COLS * CELL, y * CELL); ctx.stroke(); }

        // Board cells
        for (let y = 0; y < ROWS; y++)
            for (let x = 0; x < COLS; x++)
                if (board[y][x]) drawCell(ctx, x, y, COLORS[board[y][x]], CELL);

        // Ghost piece
        let ghostY = pieceY;
        while (canPlace(piece, pieceX, ghostY + 1)) ghostY++;
        for (let y = 0; y < piece.length; y++)
            for (let x = 0; x < piece[y].length; x++)
                if (piece[y][x] && ghostY !== pieceY) {
                    ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    ctx.fillRect((pieceX + x) * CELL + 1, (ghostY + y) * CELL + 1, CELL - 2, CELL - 2);
                }

        // Active piece
        for (let y = 0; y < piece.length; y++)
            for (let x = 0; x < piece[y].length; x++)
                if (piece[y][x]) drawCell(ctx, pieceX + x, pieceY + y, COLORS[piece[y][x]], CELL);
    }

    function drawNext() {
        nextCtx.fillStyle = '#0d0d1a';
        nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
        const p = PIECES[nextType];
        const ox = Math.floor((4 - p[0].length) / 2);
        const oy = Math.floor((4 - p.length) / 2);
        for (let y = 0; y < p.length; y++)
            for (let x = 0; x < p[y].length; x++)
                if (p[y][x]) drawCell(nextCtx, ox + x, oy + y, COLORS[p[y][x]], CELL);
    }

    function drawCell(c, x, y, color, size) {
        c.fillStyle = color;
        c.shadowColor = color;
        c.shadowBlur = 6;
        c.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
        c.shadowBlur = 0;
        // Highlight
        c.fillStyle = 'rgba(255,255,255,0.2)';
        c.fillRect(x * size + 2, y * size + 2, size - 4, 4);
    }

    function updateDisplay() {
        const s = document.getElementById('tetris-score');
        const l = document.getElementById('tetris-lines');
        const lv = document.getElementById('tetris-level');
        if (s) s.textContent = score;
        if (l) l.textContent = lines;
        if (lv) lv.textContent = level;
    }

    function toggleTetrisPause() {
        paused = !paused;
        const btn = document.getElementById('tetris-pause');
        if (btn) btn.textContent = paused ? '▶ Continuar' : '⏸ Pausa';
        if (!paused) { dropInterval = setInterval(dropStep, getDropSpeed()); activeGameLoop = dropInterval; }
        else clearInterval(dropInterval);
    }

    function endTetris() {
        gameRunning = false; clearInterval(dropInterval);
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff4d6d';
        ctx.font = 'bold 24px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💀 Game Over', canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillStyle = '#fff';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText(`Puntos: ${score}  |  Líneas: ${lines}`, canvas.width / 2, canvas.height / 2 + 10);
    }

    initBoard();
    drawBoard();
}

// ===================================
// 🔴 CONECTA 4 (IA mejorada con minimax)
// ===================================
function loadConnect4Game() {
    const ROWS = 6, COLS = 7;
    let board, currentPlayer, gameActive, vsComputer, difficulty;

    function initBoard() {
        board = Array(ROWS).fill().map(() => Array(COLS).fill(''));
        currentPlayer = 'red'; gameActive = true;
    }

    gameContainer.innerHTML = createGameHTML('🔴 Conecta 4', `
        <div class="c4-modes">
            <button class="c4-mode-btn active" data-mode="2p">👥 2 Jugadores</button>
            <button class="c4-mode-btn" data-mode="1p">🤖 vs CPU</button>
        </div>
        <div class="c4-difficulty" id="c4-difficulty" style="display:none">
            <button class="c4-diff-btn" data-diff="easy">Fácil</button>
            <button class="c4-diff-btn active" data-diff="medium">Medio</button>
            <button class="c4-diff-btn" data-diff="hard">Difícil (Minimax)</button>
        </div>
        <div id="c4-status" class="game-status-text">Turno: 🔴 Rojo</div>
        <div class="c4-board" id="c4-board">
            ${Array(ROWS * COLS).fill('').map((_, i) => `<div class="c4-cell" data-col="${i % COLS}"></div>`).join('')}
        </div>
        <button id="c4-reset" class="game-reset-btn">🔄 Nuevo Juego</button>
    `);

    const boardEl = document.getElementById('c4-board');
    const cells = boardEl.querySelectorAll('.c4-cell');
    const statusEl = document.getElementById('c4-status');
    const modeButtons = document.querySelectorAll('.c4-mode-btn');
    const diffEl = document.getElementById('c4-difficulty');
    const diffButtons = document.querySelectorAll('.c4-diff-btn');
    vsComputer = false; difficulty = 'medium';
    initBoard();

    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            vsComputer = btn.dataset.mode === '1p';
            diffEl.style.display = vsComputer ? 'flex' : 'none';
            resetGame();
        });
    });

    diffButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            diffButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            difficulty = btn.dataset.diff;
            resetGame();
        });
    });

    function dropPiece(col) {
        if (!gameActive) return false;
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row][col] === '') {
                board[row][col] = currentPlayer;
                updateBoardDisplay();
                if (checkWin(row, col)) {
                    gameActive = false;
                    const emoji = currentPlayer === 'red' ? '🔴' : '🟡';
                    statusEl.textContent = vsComputer ?
                        (currentPlayer === 'red' ? '¡Ganaste! 🎉' : '¡Ha ganado la CPU!') :
                        `¡${emoji} gana!`;
                    highlightWin(row, col);
                    return true;
                }
                if (board[0].every(c => c !== '')) {
                    gameActive = false; statusEl.textContent = '¡Empate!'; return true;
                }
                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
                const em = currentPlayer === 'red' ? '🔴 Rojo' : '🟡 Amarillo';
                statusEl.textContent = vsComputer ?
                    (currentPlayer === 'red' ? 'Tu turno 🔴' : 'CPU pensando...') :
                    `Turno: ${em}`;
                return true;
            }
        }
        return false;
    }

    function checkWin(row, col) {
        const dirs = [[0,1],[1,0],[1,1],[1,-1]];
        const color = board[row][col];
        for (const [dy,dx] of dirs) {
            let count = 1;
            for (let d = -1; d <= 1; d += 2) {
                let r = row + dy*d, c = col + dx*d;
                while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === color) {
                    count++; r += dy*d; c += dx*d;
                }
            }
            if (count >= 4) return true;
        }
        return false;
    }

    function highlightWin(row, col) {
        const dirs = [[0,1],[1,0],[1,1],[1,-1]];
        const color = board[row][col];
        const winCells = new Set();
        for (const [dy,dx] of dirs) {
            let cells_found = [[row,col]];
            for (let d = -1; d <= 1; d += 2) {
                let r = row + dy*d, c = col + dx*d;
                while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === color) {
                    cells_found.push([r,c]); r += dy*d; c += dx*d;
                }
            }
            if (cells_found.length >= 4) cells_found.forEach(([r,c]) => winCells.add(r * COLS + c));
        }
        cells.forEach((cell, i) => {
            const r = Math.floor(i / COLS), c = i % COLS;
            if (winCells.has(r * COLS + c)) cell.classList.add('win-cell');
        });
    }

    // Minimax para dificultad hard
    function scoreWindow(window, piece) {
        const opp = piece === 'yellow' ? 'red' : 'yellow';
        const pieceCount = window.filter(c => c === piece).length;
        const emptyCount = window.filter(c => c === '').length;
        const oppCount = window.filter(c => c === opp).length;
        if (pieceCount === 4) return 100;
        if (pieceCount === 3 && emptyCount === 1) return 5;
        if (pieceCount === 2 && emptyCount === 2) return 2;
        if (oppCount === 3 && emptyCount === 1) return -4;
        return 0;
    }

    function scorePosition(b, piece) {
        let score = 0;
        // Center preference
        const center = b.map(row => row[Math.floor(COLS/2)]).filter(c => c === piece).length;
        score += center * 3;
        // Horizontal
        for (let r = 0; r < ROWS; r++)
            for (let c = 0; c < COLS - 3; c++)
                score += scoreWindow([b[r][c],b[r][c+1],b[r][c+2],b[r][c+3]], piece);
        // Vertical
        for (let c = 0; c < COLS; c++)
            for (let r = 0; r < ROWS - 3; r++)
                score += scoreWindow([b[r][c],b[r+1][c],b[r+2][c],b[r+3][c]], piece);
        // Diagonal
        for (let r = 0; r < ROWS - 3; r++)
            for (let c = 0; c < COLS - 3; c++)
                score += scoreWindow([b[r][c],b[r+1][c+1],b[r+2][c+2],b[r+3][c+3]], piece);
        for (let r = 3; r < ROWS; r++)
            for (let c = 0; c < COLS - 3; c++)
                score += scoreWindow([b[r][c],b[r-1][c+1],b[r-2][c+2],b[r-3][c+3]], piece);
        return score;
    }

    function isTerminal(b) {
        // Check wins
        for (let r = 0; r < ROWS; r++)
            for (let c = 0; c < COLS; c++) {
                if (!b[r][c]) continue;
                const col2 = b[r][c];
                for (const [dy,dx] of [[0,1],[1,0],[1,1],[1,-1]]) {
                    let cnt = 1, nr = r+dy, nc = c+dx;
                    while (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr][nc] === col2) { cnt++; nr+=dy; nc+=dx; }
                    if (cnt >= 4) return true;
                }
            }
        return b[0].every(c => c !== '');
    }

    function getValidCols(b) { return Array.from({length:COLS},(_,i)=>i).filter(c=>b[0][c]===''); }

    function dropInCopy(b, col, color) {
        const nb = b.map(r=>[...r]);
        for (let r = ROWS-1; r >= 0; r--) if (nb[r][col]==='') { nb[r][col]=color; break; }
        return nb;
    }

    function minimax4(b, depth, alpha, beta, maximizing) {
        const valid = getValidCols(b);
        const terminal = isTerminal(b);
        if (depth === 0 || terminal) {
            if (terminal) {
                // Check who won
                for (let r = 0; r < ROWS; r++)
                    for (let c = 0; c < COLS; c++) {
                        if (!b[r][c]) continue;
                        const color = b[r][c];
                        for (const [dy,dx] of [[0,1],[1,0],[1,1],[1,-1]]) {
                            let cnt=1,nr=r+dy,nc=c+dx;
                            while (nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&b[nr][nc]===color){cnt++;nr+=dy;nc+=dx;}
                            if (cnt>=4) return color==='yellow' ? 100000 : -100000;
                        }
                    }
                return 0; // tie
            }
            return scorePosition(b, 'yellow') - scorePosition(b, 'red');
        }
        if (maximizing) {
            let val = -Infinity;
            for (const col of valid) {
                const nb = dropInCopy(b, col, 'yellow');
                val = Math.max(val, minimax4(nb, depth-1, alpha, beta, false));
                alpha = Math.max(alpha, val);
                if (alpha >= beta) break;
            }
            return val;
        } else {
            let val = Infinity;
            for (const col of valid) {
                const nb = dropInCopy(b, col, 'red');
                val = Math.min(val, minimax4(nb, depth-1, alpha, beta, true));
                beta = Math.min(beta, val);
                if (alpha >= beta) break;
            }
            return val;
        }
    }

    function computerMove() {
        if (!gameActive) return;
        setTimeout(() => {
            const valid = getValidCols(board);
            let col;
            if (difficulty === 'easy') {
                col = valid[Math.floor(Math.random() * valid.length)];
            } else if (difficulty === 'medium') {
                // Check win/block first
                for (const c of valid) {
                    const nb = dropInCopy(board, c, 'yellow');
                    if (isTerminal(nb)) { col = c; break; }
                }
                if (col === undefined) {
                    for (const c of valid) {
                        const nb = dropInCopy(board, c, 'red');
                        if (isTerminal(nb)) { col = c; break; }
                    }
                }
                if (col === undefined) col = valid[Math.floor(Math.random() * valid.length)];
            } else {
                // Minimax depth 5
                let best = -Infinity;
                for (const c of valid) {
                    const nb = dropInCopy(board, c, 'yellow');
                    const val = minimax4(nb, 5, -Infinity, Infinity, false);
                    if (val > best) { best = val; col = c; }
                }
            }
            if (col !== undefined) dropPiece(col);
        }, 400);
    }

    function updateBoardDisplay() {
        cells.forEach((cell, i) => {
            const r = Math.floor(i / COLS), c = i % COLS;
            cell.className = `c4-cell ${board[r][c]}`;
        });
    }

    function resetGame() {
        initBoard(); updateBoardDisplay();
        statusEl.textContent = vsComputer ? 'Tu turno 🔴' : 'Turno: 🔴 Rojo';
    }

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (vsComputer && currentPlayer === 'yellow') return;
            const col = parseInt(cell.dataset.col);
            if (dropPiece(col) && vsComputer && gameActive) computerMove();
        });
    });

    document.getElementById('c4-reset').addEventListener('click', resetGame);
}

// ===================================
// 🧠 MEMORY GAME (Timer + Dificultad)
// ===================================
function loadMemoryGame() {
    const LEVELS = {
        easy:   { emojis: ['🎮','🕹️','🎲','🎯','⚔️','🛡️','🔫','🚀'], cols: 4, pairs: 8 },
        hard:   { emojis: ['🎮','🕹️','🎲','🎯','⚔️','🛡️','🔫','🚀','🏆','🎪','🎭','🎨'], cols: 6, pairs: 12 }
    };
    let currentLevel = 'easy';
    let flippedCards = [], matchedPairs = 0, moves = 0, canFlip = true;
    let timerInterval = null, seconds = 0;

    function buildGame(level) {
        const cfg = LEVELS[level];
        const cards = [...cfg.emojis.slice(0, cfg.pairs), ...cfg.emojis.slice(0, cfg.pairs)].sort(() => Math.random() - 0.5);
        flippedCards = []; matchedPairs = 0; moves = 0; canFlip = true;
        clearInterval(timerInterval); seconds = 0;

        gameContainer.innerHTML = createGameHTML('🧠 Memory', `
            <div class="memory-level-tabs">
                <button class="mem-lvl-btn ${level==='easy'?'active':''}" data-level="easy">🟢 Fácil (4×4)</button>
                <button class="mem-lvl-btn ${level==='hard'?'active':''}" data-level="hard">🔴 Difícil (6×4)</button>
            </div>
            <div class="game-stats">
                <span class="stat">Movimientos: <strong id="memory-moves">0</strong></span>
                <span class="stat">Parejas: <strong id="memory-pairs">0</strong>/${cfg.pairs}</span>
                <span class="stat">⏱️ <strong id="memory-timer">0s</strong></span>
            </div>
            <div class="memory-board memory-cols-${cfg.cols}">
                ${cards.map((card, i) => `
                    <div class="memory-card" data-card="${card}" data-index="${i}">
                        <div class="memory-card-inner">
                            <div class="memory-card-front">?</div>
                            <div class="memory-card-back">${card}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div id="memory-result" class="game-result"></div>
            <button id="memory-reset" class="game-reset-btn">🔄 Nuevo Juego</button>
        `);

        document.querySelectorAll('.mem-lvl-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentLevel = btn.dataset.level;
                clearInterval(timerInterval);
                buildGame(currentLevel);
            });
        });

        const cardEls = document.querySelectorAll('.memory-card');
        const movesEl = document.getElementById('memory-moves');
        const pairsEl = document.getElementById('memory-pairs');
        const resultEl = document.getElementById('memory-result');
        let timerStarted = false;

        cardEls.forEach(card => {
            card.addEventListener('click', () => {
                if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) return;
                if (!timerStarted) {
                    timerStarted = true;
                    timerInterval = setInterval(() => {
                        seconds++;
                        const el = document.getElementById('memory-timer');
                        if (el) el.textContent = seconds + 's';
                    }, 1000);
                    activeGameLoop = timerInterval;
                }
                card.classList.add('flipped');
                flippedCards.push(card);
                if (flippedCards.length === 2) {
                    moves++; movesEl.textContent = moves; canFlip = false;
                    const [c1, c2] = flippedCards;
                    if (c1.dataset.card === c2.dataset.card) {
                        c1.classList.add('matched'); c2.classList.add('matched');
                        matchedPairs++; pairsEl.textContent = matchedPairs;
                        flippedCards = []; canFlip = true;
                        if (matchedPairs === cfg.pairs) {
                            clearInterval(timerInterval);
                            resultEl.className = 'game-result success';
                            resultEl.textContent = `🎉 ¡Ganaste en ${moves} movimientos y ${seconds}s!`;
                        }
                    } else {
                        setTimeout(() => {
                            c1.classList.remove('flipped'); c2.classList.remove('flipped');
                            flippedCards = []; canFlip = true;
                        }, 1000);
                    }
                }
            });
        });

        document.getElementById('memory-reset').addEventListener('click', () => { clearInterval(timerInterval); buildGame(currentLevel); });
    }

    buildGame(currentLevel);
}

// ===================================
// 🔢 2048
// ===================================
function load2048Game() {
    const SIZE = 4;
    let board, score, bestScore, gameOver, won;
    bestScore = 0;

    function newBoard() {
        board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
        score = 0; gameOver = false; won = false;
        addRandom(); addRandom();
    }

    function addRandom() {
        const empty = [];
        for (let r = 0; r < SIZE; r++)
            for (let c = 0; c < SIZE; c++)
                if (board[r][c] === 0) empty.push([r, c]);
        if (!empty.length) return;
        const [r, c] = empty[Math.floor(Math.random() * empty.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    function slide(row) {
        let arr = row.filter(v => v !== 0);
        let gained = 0;
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === arr[i + 1]) {
                arr[i] *= 2; gained += arr[i]; arr[i + 1] = 0;
            }
        }
        arr = arr.filter(v => v !== 0);
        while (arr.length < SIZE) arr.push(0);
        return { row: arr, gained };
    }

    function move(dir) {
        let moved = false;
        let totalGained = 0;
        const prev = board.map(r => [...r]);

        for (let i = 0; i < SIZE; i++) {
            let row;
            if (dir === 'left')  row = board[i];
            if (dir === 'right') row = [...board[i]].reverse();
            if (dir === 'up')    row = board.map(r => r[i]);
            if (dir === 'down')  row = board.map(r => r[i]).reverse();

            const { row: slid, gained } = slide(row);
            totalGained += gained;

            for (let j = 0; j < SIZE; j++) {
                const val = (dir === 'right' || dir === 'down') ? slid[SIZE - 1 - j] : slid[j];
                if (dir === 'left' || dir === 'right') board[i][j] = val;
                else board[j][i] = val;
            }
        }

        for (let r = 0; r < SIZE; r++)
            for (let c = 0; c < SIZE; c++)
                if (board[r][c] !== prev[r][c]) moved = true;

        if (moved) {
            score += totalGained;
            if (score > bestScore) bestScore = score;
            addRandom();
            checkState();
            render();
        }
    }

    function checkState() {
        // Check win
        for (let r = 0; r < SIZE; r++)
            for (let c = 0; c < SIZE; c++)
                if (board[r][c] === 2048 && !won) won = true;
        // Check lose
        for (let r = 0; r < SIZE; r++)
            for (let c = 0; c < SIZE; c++) {
                if (board[r][c] === 0) return;
                if (c < SIZE-1 && board[r][c] === board[r][c+1]) return;
                if (r < SIZE-1 && board[r][c] === board[r+1][c]) return;
            }
        gameOver = true;
    }

    const TILE_COLORS = {
        0:'#1a1a2e', 2:'#3b4a6b', 4:'#4a5568', 8:'#c05621', 16:'#dd6b20',
        32:'#e53e3e', 64:'#c53030', 128:'#d69e2e', 256:'#b7791f',
        512:'#276749', 1024:'#2c7a7b', 2048:'#553c9a', 4096:'#44337a'
    };
    const TILE_TEXT = {
        0:'transparent', 2:'#e2e8f0', 4:'#e2e8f0', 8:'#fff',
        16:'#fff', 32:'#fff', 64:'#fff', 128:'#fff',
        256:'#fff', 512:'#fff', 1024:'#fff', 2048:'#fff', 4096:'#fff'
    };

    gameContainer.innerHTML = createGameHTML('🔢 2048', `
        <div class="g2048-topbar">
            <div class="g2048-score-box"><span class="g2048-label">PUNTOS</span><strong id="s2048-score">0</strong></div>
            <div class="g2048-score-box"><span class="g2048-label">RÉCORD</span><strong id="s2048-best">0</strong></div>
        </div>
        <div id="g2048-msg" class="game-result" style="min-height:0;padding:0.3rem 1rem;margin:0.5rem 0"></div>
        <div class="g2048-grid" id="g2048-grid"></div>
        <p class="g2048-hint">🖐️ Desliza o usa las flechas del teclado</p>
        <button id="g2048-reset" class="game-reset-btn">🔄 Nuevo Juego</button>
    `);

    function render() {
        const grid = document.getElementById('g2048-grid');
        const sc = document.getElementById('s2048-score');
        const bs = document.getElementById('s2048-best');
        const msg = document.getElementById('g2048-msg');
        if (!grid) return;
        if (sc) sc.textContent = score;
        if (bs) bs.textContent = bestScore;

        grid.innerHTML = '';
        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                const val = board[r][c];
                const cell = document.createElement('div');
                cell.className = 'g2048-cell';
                cell.textContent = val || '';
                cell.style.background = TILE_COLORS[val] || '#553c9a';
                cell.style.color = TILE_TEXT[val] || '#fff';
                cell.style.fontSize = val >= 1024 ? '1.1rem' : val >= 128 ? '1.4rem' : '1.8rem';
                if (val) cell.classList.add('g2048-pop');
                grid.appendChild(cell);
            }
        }

        if (msg) {
            if (won && !gameOver) { msg.className = 'game-result success'; msg.textContent = '🎉 ¡2048! ¡Ganaste! Sigue jugando...'; }
            else if (gameOver)   { msg.className = 'game-result error';   msg.textContent = '💀 Game Over — No hay más movimientos'; }
            else                 { msg.className = 'game-result'; msg.textContent = ''; msg.style.minHeight = '0'; }
        }
    }

    // Keyboard
    function handleKey2048(e) {
        const map = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down' };
        if (map[e.key]) { e.preventDefault(); if (!gameOver) move(map[e.key]); }
    }
    document.addEventListener('keydown', handleKey2048);

    // Touch swipe
    let touchX = 0, touchY = 0;
    const grid2048 = () => document.getElementById('g2048-grid');
    function onTouchStart(e) { touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; }
    function onTouchEnd(e) {
        const dx = e.changedTouches[0].clientX - touchX;
        const dy = e.changedTouches[0].clientY - touchY;
        if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left');
        else move(dy > 0 ? 'down' : 'up');
    }
    document.getElementById('g2048-grid').addEventListener('touchstart', onTouchStart, { passive: true });
    document.getElementById('g2048-grid').addEventListener('touchend', onTouchEnd, { passive: true });

    document.getElementById('g2048-reset').addEventListener('click', () => {
        document.removeEventListener('keydown', handleKey2048);
        load2048Game();
    });

    newBoard(); render();
}

// ===================================
// 🏓 PONG
// ===================================
function loadPongGame() {
    const W = 480, H = 300, PAD_W = 10, PAD_H = 70, BALL_R = 8;
    let playerY, cpuY, ballX, ballY, ballVX, ballVY;
    let playerScore, cpuScore, running, difficulty;
    let animId;

    gameContainer.innerHTML = createGameHTML('🏓 Pong', `
        <div class="pong-topbar">
            <div class="pong-score"><strong id="pong-player-score">0</strong><span>Tú</span></div>
            <div class="pong-vs">VS</div>
            <div class="pong-score"><span>CPU</span><strong id="pong-cpu-score">0</strong></div>
        </div>
        <div class="pong-wrap">
            <canvas id="pong-canvas" width="${W}" height="${H}"></canvas>
            <div class="pong-overlay" id="pong-overlay">
                <div class="pong-overlay-box">
                    <div style="font-size:2.5rem">🏓</div>
                    <h3>Pong</h3>
                    <p>Mueve el ratón o usa<br>↑ ↓ para mover la pala</p>
                    <div class="pong-diff-select">
                        <button class="pong-diff-btn" data-diff="easy">🟢 Fácil</button>
                        <button class="pong-diff-btn active" data-diff="medium">🟡 Medio</button>
                        <button class="pong-diff-btn" data-diff="hard">🔴 Difícil</button>
                    </div>
                    <button id="pong-start" class="game-action-btn" style="margin-top:1rem">▶ Empezar</button>
                </div>
            </div>
        </div>
        <button id="pong-reset" class="game-reset-btn">🔄 Reiniciar</button>
    `);

    const canvas = document.getElementById('pong-canvas');
    const ctx = canvas.getContext('2d');
    difficulty = 'medium';

    document.querySelectorAll('.pong-diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.pong-diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            difficulty = btn.dataset.diff;
        });
    });

    document.getElementById('pong-start').addEventListener('click', startPong);
    document.getElementById('pong-reset').addEventListener('click', () => {
        cancelAnimationFrame(animId);
        document.removeEventListener('keydown', handlePongKey);
        canvas.removeEventListener('mousemove', handleMouse);
        loadPongGame();
    });

    // Mouse control
    function handleMouse(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleY = H / rect.height;
        playerY = (e.clientY - rect.top) * scaleY - PAD_H / 2;
        playerY = Math.max(0, Math.min(H - PAD_H, playerY));
    }
    canvas.addEventListener('mousemove', handleMouse);

    // Keyboard
    let keys = {};
    function handlePongKey(e) { keys[e.key] = e.type === 'keydown'; }
    document.addEventListener('keydown', handlePongKey);
    document.addEventListener('keyup', handlePongKey);

    function cpuSpeed() { return { easy: 2.2, medium: 3.5, hard: 5 }[difficulty]; }
    function ballSpeed() { return { easy: 3.5, medium: 5, hard: 7 }[difficulty]; }

    function initState() {
        playerY = H / 2 - PAD_H / 2;
        cpuY = H / 2 - PAD_H / 2;
        playerScore = 0; cpuScore = 0;
        launchBall();
    }

    function launchBall() {
        ballX = W / 2; ballY = H / 2;
        const angle = (Math.random() * 60 - 30) * Math.PI / 180;
        const spd = ballSpeed();
        ballVX = (Math.random() > 0.5 ? 1 : -1) * spd * Math.cos(angle);
        ballVY = spd * Math.sin(angle);
    }

    function startPong() {
        document.getElementById('pong-overlay').style.display = 'none';
        running = true;
        loop();
    }

    function loop() {
        if (!running) return;
        update();
        draw();
        animId = requestAnimationFrame(loop);
        activeGameLoop = animId;
    }

    function update() {
        // Player keyboard
        if (keys['ArrowUp'])   { playerY -= 5; if (playerY < 0) playerY = 0; }
        if (keys['ArrowDown']) { playerY += 5; if (playerY > H - PAD_H) playerY = H - PAD_H; }

        // CPU AI
        const cpuCenter = cpuY + PAD_H / 2;
        const spd = cpuSpeed();
        if (cpuCenter < ballY - 5) cpuY += spd;
        else if (cpuCenter > ballY + 5) cpuY -= spd;
        cpuY = Math.max(0, Math.min(H - PAD_H, cpuY));

        // Ball move
        ballX += ballVX; ballY += ballVY;

        // Top/bottom bounce
        if (ballY - BALL_R <= 0) { ballY = BALL_R; ballVY = Math.abs(ballVY); }
        if (ballY + BALL_R >= H) { ballY = H - BALL_R; ballVY = -Math.abs(ballVY); }

        // Player paddle collision (left)
        if (ballX - BALL_R <= PAD_W + 20 && ballY >= playerY && ballY <= playerY + PAD_H && ballVX < 0) {
            const hit = (ballY - (playerY + PAD_H / 2)) / (PAD_H / 2);
            const angle = hit * 60 * Math.PI / 180;
            const spd2 = Math.min(Math.sqrt(ballVX*ballVX + ballVY*ballVY) + 0.3, 14);
            ballVX = spd2 * Math.cos(angle);
            ballVY = spd2 * Math.sin(angle);
            ballX = PAD_W + 20 + BALL_R;
        }

        // CPU paddle collision (right)
        if (ballX + BALL_R >= W - PAD_W - 20 && ballY >= cpuY && ballY <= cpuY + PAD_H && ballVX > 0) {
            const hit = (ballY - (cpuY + PAD_H / 2)) / (PAD_H / 2);
            const angle = hit * 60 * Math.PI / 180;
            const spd2 = Math.min(Math.sqrt(ballVX*ballVX + ballVY*ballVY) + 0.3, 14);
            ballVX = -spd2 * Math.cos(angle);
            ballVY = spd2 * Math.sin(angle);
            ballX = W - PAD_W - 20 - BALL_R;
        }

        // Score
        if (ballX < 0) { cpuScore++; updateScores(); launchBall(); }
        if (ballX > W) { playerScore++; updateScores(); launchBall(); }
    }

    function draw() {
        ctx.fillStyle = '#0d0d1a';
        ctx.fillRect(0, 0, W, H);

        // Center line
        ctx.setLineDash([10, 10]);
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke();
        ctx.setLineDash([]);

        // Player paddle
        ctx.fillStyle = '#ff4d6d';
        ctx.shadowColor = '#ff4d6d'; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.roundRect(20, playerY, PAD_W, PAD_H, 5); ctx.fill();

        // CPU paddle
        ctx.fillStyle = '#7c3aed';
        ctx.shadowColor = '#7c3aed';
        ctx.beginPath(); ctx.roundRect(W - 20 - PAD_W, cpuY, PAD_W, PAD_H, 5); ctx.fill();
        ctx.shadowBlur = 0;

        // Ball
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff'; ctx.shadowBlur = 15;
        ctx.beginPath(); ctx.arc(ballX, ballY, BALL_R, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
    }

    function updateScores() {
        const p = document.getElementById('pong-player-score');
        const c = document.getElementById('pong-cpu-score');
        if (p) p.textContent = playerScore;
        if (c) c.textContent = cpuScore;
    }

    initState(); draw();
}

// ===================================
// 🐦 FLAPPY BIRD
// ===================================
function loadFlappyGame() {
    const W = 320, H = 480;
    const BIRD_X = 70, BIRD_R = 16;
    const GRAVITY = 0.45, FLAP = -8;
    const PIPE_W = 52, GAP = 145, PIPE_SPEED = 2.5;

    let birdY, birdVY, pipes, score, bestScore, state; // state: 'idle' | 'playing' | 'dead'
    bestScore = 0;
    let animId;

    gameContainer.innerHTML = createGameHTML('🐦 Flappy Bird', `
        <div class="flappy-topbar">
            <span>🏆 Récord: <strong id="flappy-best">0</strong></span>
            <span>⭐ Puntos: <strong id="flappy-score">0</strong></span>
        </div>
        <div class="flappy-wrap">
            <canvas id="flappy-canvas" width="${W}" height="${H}"></canvas>
        </div>
        <p class="flappy-hint">🖱️ Click / Espacio / Toca para volar</p>
        <button id="flappy-reset" class="game-reset-btn">🔄 Reiniciar</button>
    `);

    const canvas = document.getElementById('flappy-canvas');
    const ctx = canvas.getContext('2d');

    function init() {
        birdY = H / 2; birdVY = 0;
        pipes = []; score = 0; state = 'idle';
        render();
    }

    function flap() {
        if (state === 'dead') { init(); return; }
        if (state === 'idle') { state = 'playing'; loop(); }
        birdVY = FLAP;
    }

    // Input
    canvas.addEventListener('click', flap);
    function handleFlapKey(e) { if (e.code === 'Space') { e.preventDefault(); flap(); } }
    document.addEventListener('keydown', handleFlapKey);
    canvas.addEventListener('touchstart', e => { e.preventDefault(); flap(); }, { passive: false });

    document.getElementById('flappy-reset').addEventListener('click', () => {
        cancelAnimationFrame(animId);
        document.removeEventListener('keydown', handleFlapKey);
        loadFlappyGame();
    });

    let frameCount = 0;
    function loop() {
        if (state !== 'playing') return;
        update();
        render();
        animId = requestAnimationFrame(loop);
        activeGameLoop = animId;
    }

    function update() {
        frameCount++;
        birdVY += GRAVITY;
        birdY += birdVY;

        // Spawn pipes
        if (frameCount % 90 === 0) {
            const topH = 60 + Math.random() * (H - GAP - 120);
            pipes.push({ x: W + 10, topH, scored: false });
        }

        // Move & score pipes
        for (const p of pipes) {
            p.x -= PIPE_SPEED;
            if (!p.scored && p.x + PIPE_W < BIRD_X) {
                p.scored = true; score++;
                if (score > bestScore) bestScore = score;
                const sc = document.getElementById('flappy-score');
                const bs = document.getElementById('flappy-best');
                if (sc) sc.textContent = score;
                if (bs) bs.textContent = bestScore;
                // Speed up slightly every 5 points (capped)
            }
        }
        pipes = pipes.filter(p => p.x > -PIPE_W - 10);

        // Collision
        if (birdY + BIRD_R > H || birdY - BIRD_R < 0) { die(); return; }
        for (const p of pipes) {
            if (BIRD_X + BIRD_R > p.x && BIRD_X - BIRD_R < p.x + PIPE_W) {
                if (birdY - BIRD_R < p.topH || birdY + BIRD_R > p.topH + GAP) { die(); return; }
            }
        }
    }

    function die() {
        state = 'dead';
        cancelAnimationFrame(animId);
        render();
        // Show game over overlay on canvas
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#ff4d6d';
        ctx.font = 'bold 28px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💀 Game Over', W / 2, H / 2 - 30);
        ctx.fillStyle = '#fff';
        ctx.font = '18px Inter, sans-serif';
        ctx.fillText(`Puntuación: ${score}`, W / 2, H / 2 + 5);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('Click o Espacio para reintentar', W / 2, H / 2 + 35);
    }

    function render() {
        // Sky gradient
        const sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, '#1a1a3e');
        sky.addColorStop(1, '#0d1a2e');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        // Ground
        ctx.fillStyle = '#2d5a1b';
        ctx.fillRect(0, H - 30, W, 30);
        ctx.fillStyle = '#3a7a24';
        ctx.fillRect(0, H - 30, W, 8);

        // Pipes
        for (const p of pipes) {
            // Top pipe
            const pipGrad = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
            pipGrad.addColorStop(0, '#2d8a2d');
            pipGrad.addColorStop(0.4, '#4caf50');
            pipGrad.addColorStop(1, '#1a5c1a');
            ctx.fillStyle = pipGrad;
            ctx.fillRect(p.x, 0, PIPE_W, p.topH);
            // Top cap
            ctx.fillStyle = '#3cb84f';
            ctx.beginPath(); ctx.roundRect(p.x - 4, p.topH - 20, PIPE_W + 8, 20, [0,0,4,4]); ctx.fill();

            // Bottom pipe
            const botY = p.topH + GAP;
            ctx.fillStyle = pipGrad;
            ctx.fillRect(p.x, botY, PIPE_W, H - botY - 30);
            // Bottom cap
            ctx.fillStyle = '#3cb84f';
            ctx.beginPath(); ctx.roundRect(p.x - 4, botY, PIPE_W + 8, 20, [4,4,0,0]); ctx.fill();
        }

        // Bird
        const tilt = Math.max(-0.5, Math.min(1.0, birdVY * 0.07));
        ctx.save();
        ctx.translate(BIRD_X, birdY);
        ctx.rotate(tilt);
        // Body
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.ellipse(0, 0, BIRD_R, BIRD_R - 2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        // Wing
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.ellipse(-4, 4, 8, 5, -0.3, 0, Math.PI * 2); ctx.fill();
        // Eye
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(6, -4, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath(); ctx.arc(8, -4, 2.5, 0, Math.PI * 2); ctx.fill();
        // Beak
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.moveTo(BIRD_R, -2); ctx.lineTo(BIRD_R + 8, 0); ctx.lineTo(BIRD_R, 3); ctx.closePath(); ctx.fill();
        ctx.restore();

        // Score
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold 32px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(score, W / 2, 50);

        // Idle screen
        if (state === 'idle') {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 22px Plus Jakarta Sans, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🐦 Flappy Bird', W / 2, H / 2 - 20);
            ctx.font = '14px Inter, sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fillText('Click o Espacio para empezar', W / 2, H / 2 + 15);
        }
    }

    init();
}

// ===================================
// 🔤 AHORCADO (Categorías + más palabras)
function loadHangmanGame() {
    const CATEGORIES = {
        '🎮 Gaming': ['fortnite', 'minecraft', 'valorant', 'overwatch', 'battlefield', 'callofduty', 'leagueoflegends', 'apex', 'roblox', 'pubg', 'terraria', 'skyrim', 'zelda', 'pokemon'],
        '⚽ Deportes': ['futbol', 'baloncesto', 'tenis', 'ciclismo', 'natacion', 'atletismo', 'voleibol', 'rugby', 'beisbol', 'hockey'],
        '🌍 Países': ['espana', 'alemania', 'francia', 'portugal', 'italia', 'japon', 'canada', 'brasil', 'argentina', 'australia'],
        '🎬 Películas': ['inception', 'avatar', 'titanic', 'matrix', 'interstellar', 'gladiator', 'batman', 'spiderman', 'avengers', 'joker']
    };
    const categoryKeys = Object.keys(CATEGORIES);
    let currentCategory = categoryKeys[0];
    let word = '', guessedLetters = [], mistakes = 0, maxMistakes = 6;

    function buildGame(cat) {
        currentCategory = cat;
        const wordList = CATEGORIES[cat];
        word = wordList[Math.floor(Math.random() * wordList.length)];
        guessedLetters = []; mistakes = 0;

        gameContainer.innerHTML = createGameHTML('🔤 Ahorcado', `
            <div class="hangman-categories">
                ${categoryKeys.map(k => `<button class="hang-cat-btn ${k===cat?'active':''}" data-cat="${k}">${k}</button>`).join('')}
            </div>
            <div class="hangman-figure" id="hangman-figure">${getHangmanSVG(0)}</div>
            <div class="hangman-word" id="hangman-word">${renderWord()}</div>
            <div class="hangman-keyboard" id="hangman-keyboard">
                ${'abcdefghijklmnñopqrstuvwxyz'.split('').map(l => `<button class="keyboard-key" data-letter="${l}">${l.toUpperCase()}</button>`).join('')}
            </div>
            <div class="game-stats">
                <span class="stat">Errores: <strong id="hangman-mistakes">0</strong>/${maxMistakes}</span>
                <span class="stat">Categoría: <strong>${cat}</strong></span>
            </div>
            <div id="hangman-result" class="game-result"></div>
            <button id="hangman-reset" class="game-reset-btn">🔄 Nueva Palabra</button>
        `);

        document.querySelectorAll('.hang-cat-btn').forEach(btn => {
            btn.addEventListener('click', () => buildGame(btn.dataset.cat));
        });

        const figureEl = document.getElementById('hangman-figure');
        const wordEl = document.getElementById('hangman-word');
        const mistakesEl = document.getElementById('hangman-mistakes');
        const resultEl = document.getElementById('hangman-result');
        const keyboard = document.getElementById('hangman-keyboard');

        keyboard.addEventListener('click', (e) => {
            if (!e.target.classList.contains('keyboard-key') || e.target.disabled) return;
            const letter = e.target.dataset.letter;
            e.target.disabled = true;
            guessedLetters.push(letter);
            if (word.includes(letter)) {
                e.target.classList.add('correct');
                wordEl.textContent = renderWord();
                if (!wordEl.textContent.includes('_')) {
                    resultEl.className = 'game-result success';
                    resultEl.textContent = '¡Ganaste! 🎉';
                    disableKeyboard();
                }
            } else {
                e.target.classList.add('wrong');
                mistakes++; mistakesEl.textContent = mistakes;
                figureEl.innerHTML = getHangmanSVG(mistakes);
                if (mistakes >= maxMistakes) {
                    resultEl.className = 'game-result error';
                    resultEl.textContent = `¡Perdiste! La palabra era: ${word.toUpperCase()}`;
                    wordEl.textContent = word.split('').join(' ');
                    disableKeyboard();
                }
            }
        });

        function disableKeyboard() { keyboard.querySelectorAll('.keyboard-key').forEach(k => k.disabled = true); }
        document.getElementById('hangman-reset').addEventListener('click', () => buildGame(currentCategory));
    }

    function renderWord() { return word.split('').map(l => guessedLetters.includes(l) ? l : '_').join(' '); }

    function getHangmanSVG(errors) {
        const parts = [
            errors >= 1 ? '<circle cx="50" cy="25" r="10" stroke="currentColor" stroke-width="2" fill="none"/>' : '',
            errors >= 2 ? '<line x1="50" y1="35" x2="50" y2="60" stroke="currentColor" stroke-width="2"/>' : '',
            errors >= 3 ? '<line x1="50" y1="40" x2="35" y2="55" stroke="currentColor" stroke-width="2"/>' : '',
            errors >= 4 ? '<line x1="50" y1="40" x2="65" y2="55" stroke="currentColor" stroke-width="2"/>' : '',
            errors >= 5 ? '<line x1="50" y1="60" x2="35" y2="80" stroke="currentColor" stroke-width="2"/>' : '',
            errors >= 6 ? '<line x1="50" y1="60" x2="65" y2="80" stroke="currentColor" stroke-width="2"/>' : '',
        ];
        return `<svg viewBox="0 0 100 100" class="hangman-svg">
            <line x1="10" y1="95" x2="40" y2="95" stroke="currentColor" stroke-width="2"/>
            <line x1="25" y1="95" x2="25" y2="5" stroke="currentColor" stroke-width="2"/>
            <line x1="25" y1="5" x2="50" y2="5" stroke="currentColor" stroke-width="2"/>
            <line x1="50" y1="5" x2="50" y2="15" stroke="currentColor" stroke-width="2"/>
            ${parts.join('')}
        </svg>`;
    }

    buildGame(currentCategory);
}

// ===================================
// ⭕ TRES EN RAYA (Minimax IA)
// ===================================
function loadTicTacToeGame() {
    let board, currentPlayer, gameActive, vsComputer, difficulty;

    const winPatterns = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    gameContainer.innerHTML = createGameHTML('⭕ Tres en Raya', `
        <div class="ttt-modes">
            <button class="ttt-mode-btn active" data-mode="2p">👥 2 Jugadores</button>
            <button class="ttt-mode-btn" data-mode="1p">🤖 vs CPU</button>
        </div>
        <div class="ttt-difficulty" id="ttt-difficulty" style="display:none">
            <button class="ttt-diff-btn" data-diff="easy">Fácil</button>
            <button class="ttt-diff-btn active" data-diff="medium">Medio</button>
            <button class="ttt-diff-btn" data-diff="hard">Imposible</button>
        </div>
        <div id="ttt-status" class="game-status-text">Turno de X</div>
        <div class="ttt-board" id="ttt-board">
            ${Array(9).fill('').map((_, i) => `<div class="ttt-cell" data-index="${i}"></div>`).join('')}
        </div>
        <button id="ttt-reset" class="game-reset-btn">🔄 Nuevo Juego</button>
    `);

    const boardEl = document.getElementById('ttt-board');
    const cells = boardEl.querySelectorAll('.ttt-cell');
    const statusEl = document.getElementById('ttt-status');
    const modeButtons = document.querySelectorAll('.ttt-mode-btn');
    const difficultyEl = document.getElementById('ttt-difficulty');
    const diffButtons = document.querySelectorAll('.ttt-diff-btn');
    vsComputer = false; difficulty = 'medium';
    resetGame();

    function checkWinner() {
        for (const [a,b,c] of winPatterns)
            if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
        return board.includes('') ? null : 'tie';
    }

    function minimax(b, depth, isMax) {
        const winner = (() => {
            for (const [a,bw,c] of winPatterns) if (b[a]&&b[a]===b[bw]&&b[a]===b[c]) return b[a];
            return b.includes('') ? null : 'tie';
        })();
        if (winner === 'O') return 10 - depth;
        if (winner === 'X') return depth - 10;
        if (winner === 'tie') return 0;
        if (isMax) {
            let best = -Infinity;
            for (let i = 0; i < 9; i++) if (b[i]==='') { b[i]='O'; best=Math.max(best,minimax(b,depth+1,false)); b[i]=''; }
            return best;
        } else {
            let best = Infinity;
            for (let i = 0; i < 9; i++) if (b[i]==='') { b[i]='X'; best=Math.min(best,minimax(b,depth+1,true)); b[i]=''; }
            return best;
        }
    }

    function computerMove() {
        if (!gameActive) return;
        let move;
        const empty = board.map((v,i)=>v===''?i:null).filter(v=>v!==null);
        if (difficulty === 'hard') {
            let best = -Infinity;
            for (const i of empty) { board[i]='O'; const s=minimax(board,0,false); board[i]=''; if(s>best){best=s;move=i;} }
        } else if (difficulty === 'medium') {
            if (Math.random() < 0.7) {
                let best = -Infinity;
                for (const i of empty) { board[i]='O'; const s=minimax(board,0,false); board[i]=''; if(s>best){best=s;move=i;} }
            } else { move = empty[Math.floor(Math.random()*empty.length)]; }
        } else { move = empty[Math.floor(Math.random()*empty.length)]; }
        setTimeout(() => { if (move !== undefined) makeMove(move); }, 400);
    }

    function makeMove(index) {
        if (board[index] !== '' || !gameActive) return;
        board[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        cells[index].classList.add(currentPlayer.toLowerCase());
        const winner = checkWinner();
        if (winner) {
            gameActive = false;
            if (winner === 'tie') { statusEl.textContent = '¡Empate! 🤝'; }
            else {
                statusEl.textContent = vsComputer ? (winner==='X'?'¡Ganaste! 🎉':'¡Ha ganado la CPU! 🤖') : `¡Jugador ${winner} gana! 🎉`;
                // Highlight winning cells
                for (const [a,b,c] of winPatterns)
                    if (board[a]&&board[a]===board[b]&&board[a]===board[c])
                        [a,b,c].forEach(i=>cells[i].classList.add('win-cell'));
            }
            return;
        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusEl.textContent = vsComputer ? (currentPlayer==='X'?'Tu turno (X)':'CPU pensando...') : `Turno de ${currentPlayer}`;
        if (vsComputer && currentPlayer === 'O') computerMove();
    }

    function resetGame() {
        board = Array(9).fill(''); currentPlayer = 'X'; gameActive = true;
        cells.forEach(cell => { cell.textContent=''; cell.className='ttt-cell'; });
        statusEl.textContent = vsComputer ? 'Tu turno (X)' : 'Turno de X';
    }

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (vsComputer && currentPlayer === 'O') return;
            makeMove(parseInt(cell.dataset.index));
        });
    });

    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modeButtons.forEach(b=>b.classList.remove('active')); btn.classList.add('active');
            vsComputer = btn.dataset.mode === '1p';
            difficultyEl.style.display = vsComputer ? 'flex' : 'none';
            resetGame();
        });
    });

    diffButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            diffButtons.forEach(b=>b.classList.remove('active')); btn.classList.add('active');
            difficulty = btn.dataset.diff; resetGame();
        });
    });

    document.getElementById('ttt-reset').addEventListener('click', resetGame);
}

// ===================================
// 🦖 DINO RUN
// ===================================
function loadDinoGame() {
    gameContainer.innerHTML = createGameHTML('🦖 Dino Run', `
        <p class="game-description">El clásico juego del dinosaurio de Chrome</p>
        <div class="dino-frame">
            <iframe 
                src="https://chromedino.com/" 
                frameborder="0" 
                scrolling="no"
                loading="lazy">
            </iframe>
        </div>
        <div class="dino-tip">
            <p>💡 ¿No carga? Abre <code>chrome://dino</code> en Chrome</p>
        </div>
    `);
}

// ===================================
// 🎯 ADIVINA EL NÚMERO (Sencillo)
// ===================================
function loadGuessNumberGame() {
    let secretNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;

    gameContainer.innerHTML = createGameHTML('🎯 Adivina el Número', `
        <p class="game-description">Estoy pensando en un número entre 1 y 100. ¿Puedes adivinarlo?</p>
        <div class="game-input-group">
            <input type="number" id="guess-input" placeholder="Tu número" min="1" max="100">
            <button id="guess-btn" class="game-action-btn">Adivinar</button>
        </div>
        <div id="guess-result" class="game-result"></div>
        <div class="game-stats">
            <span class="stat">Intentos: <strong id="attempts-count">0</strong></span>
        </div>
        <button id="guess-reset" class="game-reset-btn">🔄 Nuevo Juego</button>
    `);

    const guessInput = document.getElementById('guess-input');
    const guessBtn = document.getElementById('guess-btn');
    const resultDiv = document.getElementById('guess-result');
    const attemptsCount = document.getElementById('attempts-count');

    function handleGuess() {
        const guess = parseInt(guessInput.value);
        if (isNaN(guess) || guess < 1 || guess > 100) {
            resultDiv.className = 'game-result warning'; resultDiv.textContent = 'Introduce un número válido entre 1 y 100'; return;
        }
        attempts++; attemptsCount.textContent = attempts;
        if (guess === secretNumber) {
            resultDiv.className = 'game-result success'; resultDiv.textContent = `¡Correcto! 🎉 Lo adivinaste en ${attempts} intentos`;
            guessBtn.disabled = true; guessInput.disabled = true;
        } else if (guess < secretNumber) {
            resultDiv.className = 'game-result info'; resultDiv.textContent = '📈 El número es MAYOR';
        } else {
            resultDiv.className = 'game-result info'; resultDiv.textContent = '📉 El número es MENOR';
        }
        guessInput.value = ''; guessInput.focus();
    }

    guessBtn.addEventListener('click', handleGuess);
    guessInput.addEventListener('keypress', e => { if (e.key === 'Enter') handleGuess(); });
    document.getElementById('guess-reset').addEventListener('click', () => loadGuessNumberGame());
    guessInput.focus();
}

// ===================================
// ✌️ PIEDRA PAPEL TIJERA (Sencillo)
// ===================================
let rpsPlayerWins = 0, rpsComputerWins = 0;

function loadRockPaperScissorsGame() {
    gameContainer.innerHTML = createGameHTML('✌️ Piedra, Papel o Tijera', `
        <p class="game-description">Elige tu opción y desafía a la computadora</p>
        <div class="rps-choices">
            <button class="rps-btn" data-choice="piedra">🪨<span>Piedra</span></button>
            <button class="rps-btn" data-choice="papel">📄<span>Papel</span></button>
            <button class="rps-btn" data-choice="tijera">✂️<span>Tijera</span></button>
        </div>
        <div id="rps-result" class="game-result"></div>
        <div class="game-stats rps-score">
            <span class="stat player-stat">Tú: <strong id="player-score">${rpsPlayerWins}</strong></span>
            <span class="stat-divider">vs</span>
            <span class="stat computer-stat">CPU: <strong id="computer-score">${rpsComputerWins}</strong></span>
        </div>
        <button id="rps-reset" class="game-reset-btn">🔄 Reiniciar Puntuación</button>
    `);

    const resultDiv = document.getElementById('rps-result');
    const playerScoreEl = document.getElementById('player-score');
    const computerScoreEl = document.getElementById('computer-score');

    document.querySelectorAll('.rps-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const userChoice = btn.dataset.choice;
            const choices = ['piedra', 'papel', 'tijera'];
            const computerChoice = choices[Math.floor(Math.random() * 3)];
            const emojis = { piedra:'🪨', papel:'📄', tijera:'✂️' };
            if (userChoice === computerChoice) {
                resultDiv.className = 'game-result info'; resultDiv.innerHTML = `${emojis[userChoice]} vs ${emojis[computerChoice]} - ¡Empate!`;
            } else if ((userChoice==='piedra'&&computerChoice==='tijera')||(userChoice==='papel'&&computerChoice==='piedra')||(userChoice==='tijera'&&computerChoice==='papel')) {
                rpsPlayerWins++; playerScoreEl.textContent = rpsPlayerWins;
                resultDiv.className = 'game-result success'; resultDiv.innerHTML = `${emojis[userChoice]} vs ${emojis[computerChoice]} - ¡Ganaste! 🎉`;
            } else {
                rpsComputerWins++; computerScoreEl.textContent = rpsComputerWins;
                resultDiv.className = 'game-result error'; resultDiv.innerHTML = `${emojis[userChoice]} vs ${emojis[computerChoice]} - ¡Perdiste!`;
            }
        });
    });

    document.getElementById('rps-reset').addEventListener('click', () => {
        rpsPlayerWins = 0; rpsComputerWins = 0;
        playerScoreEl.textContent = 0; computerScoreEl.textContent = 0;
        resultDiv.className = 'game-result'; resultDiv.textContent = '';
    });
}
