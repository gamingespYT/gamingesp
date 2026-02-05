/**
 * Gaming España - Juegos Component
 * Modern Game Selector with Mini Games
 * Version 3.0 - Refactored
 */

// ===================================
// DOM REFERENCES
// ===================================
const gameSelector = document.getElementById('game-selector');
const gameContainer = document.getElementById('game-container');
const gameCards = document.querySelectorAll('.game-card');

// ===================================
// GAME STATE
// ===================================
let currentGame = null;

// ===================================
// GAME SELECTOR INITIALIZATION
// ===================================
gameCards.forEach(card => {
    card.addEventListener('click', () => {
        const gameName = card.dataset.game;

        // Update visual state - use 'selected' instead of 'active' to avoid reveal conflict
        gameCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        // Load the game
        loadGame(gameName);
    });
});

// ===================================
// GAME LOADER
// ===================================
function loadGame(selectedGame) {
    currentGame = selectedGame;
    gameContainer.innerHTML = '';

    // Animation trigger
    gameContainer.style.animation = 'none';
    gameContainer.offsetHeight;
    gameContainer.style.animation = 'fadeIn 0.3s ease';

    // Remove welcome screen class if present
    gameContainer.classList.remove('has-welcome');

    const games = {
        'guess-number': loadGuessNumberGame,
        'rock-paper-scissors': loadRockPaperScissorsGame,
        'memory-game': loadMemoryGame,
        'hangman': loadHangmanGame,
        'dino-game': loadDinoGame,
        'tic-tac-toe': loadTicTacToeGame,
        'minesweeper': loadMinesweeperGame,
        'connect4': loadConnect4Game
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
// GUESS NUMBER GAME
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
        <button id="guess-reset" class="game-reset-btn">Nuevo Juego</button>
    `);

    const guessInput = document.getElementById('guess-input');
    const guessBtn = document.getElementById('guess-btn');
    const resultDiv = document.getElementById('guess-result');
    const attemptsCount = document.getElementById('attempts-count');
    const resetBtn = document.getElementById('guess-reset');

    function handleGuess() {
        const guess = parseInt(guessInput.value);

        if (isNaN(guess) || guess < 1 || guess > 100) {
            resultDiv.className = 'game-result warning';
            resultDiv.textContent = 'Introduce un número válido entre 1 y 100';
            return;
        }

        attempts++;
        attemptsCount.textContent = attempts;

        if (guess === secretNumber) {
            resultDiv.className = 'game-result success';
            resultDiv.textContent = `¡Correcto! 🎉 Lo adivinaste en ${attempts} intentos`;
            guessBtn.disabled = true;
            guessInput.disabled = true;
        } else if (guess < secretNumber) {
            resultDiv.className = 'game-result info';
            resultDiv.textContent = '📈 El número es MAYOR';
        } else {
            resultDiv.className = 'game-result info';
            resultDiv.textContent = '📉 El número es MENOR';
        }

        guessInput.value = '';
        guessInput.focus();
    }

    guessBtn.addEventListener('click', handleGuess);
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleGuess();
    });

    resetBtn.addEventListener('click', () => loadGuessNumberGame());
    guessInput.focus();
}

// ===================================
// ROCK PAPER SCISSORS GAME
// ===================================
let rpsPlayerWins = 0;
let rpsComputerWins = 0;

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
        <button id="rps-reset" class="game-reset-btn">Reiniciar Puntuación</button>
    `);

    const choiceButtons = document.querySelectorAll('.rps-btn');
    const resultDiv = document.getElementById('rps-result');
    const playerScoreEl = document.getElementById('player-score');
    const computerScoreEl = document.getElementById('computer-score');
    const resetBtn = document.getElementById('rps-reset');

    choiceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const userChoice = btn.dataset.choice;
            const choices = ['piedra', 'papel', 'tijera'];
            const computerChoice = choices[Math.floor(Math.random() * 3)];

            const emojis = { piedra: '🪨', papel: '📄', tijera: '✂️' };

            if (userChoice === computerChoice) {
                resultDiv.className = 'game-result info';
                resultDiv.innerHTML = `${emojis[userChoice]} vs ${emojis[computerChoice]} - ¡Empate!`;
            } else if (
                (userChoice === 'piedra' && computerChoice === 'tijera') ||
                (userChoice === 'papel' && computerChoice === 'piedra') ||
                (userChoice === 'tijera' && computerChoice === 'papel')
            ) {
                rpsPlayerWins++;
                playerScoreEl.textContent = rpsPlayerWins;
                resultDiv.className = 'game-result success';
                resultDiv.innerHTML = `${emojis[userChoice]} vs ${emojis[computerChoice]} - ¡Ganaste! 🎉`;
            } else {
                rpsComputerWins++;
                computerScoreEl.textContent = rpsComputerWins;
                resultDiv.className = 'game-result error';
                resultDiv.innerHTML = `${emojis[userChoice]} vs ${emojis[computerChoice]} - ¡Perdiste!`;
            }
        });
    });

    resetBtn.addEventListener('click', () => {
        rpsPlayerWins = 0;
        rpsComputerWins = 0;
        playerScoreEl.textContent = 0;
        computerScoreEl.textContent = 0;
        resultDiv.className = 'game-result';
        resultDiv.textContent = '';
    });
}

// ===================================
// MEMORY GAME
// ===================================
function loadMemoryGame() {
    const emojis = ['🎮', '🕹️', '🎲', '🎯', '⚔️', '🛡️', '🔫', '🚀'];
    const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let canFlip = true;

    gameContainer.innerHTML = createGameHTML('🧠 Memory', `
        <p class="game-description">Encuentra todas las parejas de cartas</p>
        <div class="memory-board">
            ${cards.map((card, i) => `
                <div class="memory-card" data-card="${card}" data-index="${i}">
                    <div class="memory-card-inner">
                        <div class="memory-card-front">?</div>
                        <div class="memory-card-back">${card}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="game-stats">
            <span class="stat">Movimientos: <strong id="memory-moves">0</strong></span>
            <span class="stat">Parejas: <strong id="memory-pairs">0</strong>/8</span>
        </div>
        <div id="memory-result" class="game-result"></div>
        <button id="memory-reset" class="game-reset-btn">Nuevo Juego</button>
    `);

    const cardElements = document.querySelectorAll('.memory-card');
    const movesEl = document.getElementById('memory-moves');
    const pairsEl = document.getElementById('memory-pairs');
    const resultEl = document.getElementById('memory-result');
    const resetBtn = document.getElementById('memory-reset');

    cardElements.forEach(card => {
        card.addEventListener('click', () => {
            if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) return;

            card.classList.add('flipped');
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                moves++;
                movesEl.textContent = moves;
                canFlip = false;

                const [card1, card2] = flippedCards;

                if (card1.dataset.card === card2.dataset.card) {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    matchedPairs++;
                    pairsEl.textContent = matchedPairs;
                    flippedCards = [];
                    canFlip = true;

                    if (matchedPairs === 8) {
                        resultEl.className = 'game-result success';
                        resultEl.textContent = `¡Ganaste en ${moves} movimientos! 🎉`;
                    }
                } else {
                    setTimeout(() => {
                        card1.classList.remove('flipped');
                        card2.classList.remove('flipped');
                        flippedCards = [];
                        canFlip = true;
                    }, 1000);
                }
            }
        });
    });

    resetBtn.addEventListener('click', () => loadMemoryGame());
}

// ===================================
// HANGMAN GAME
// ===================================
function loadHangmanGame() {
    const words = ['fortnite', 'gaming', 'espana', 'videojuegos', 'gamer', 'joystick', 'jugador', 'partida', 'victoria', 'streaming'];
    const word = words[Math.floor(Math.random() * words.length)];
    let guessedLetters = [];
    let mistakes = 0;
    const maxMistakes = 6;

    function renderWord() {
        return word.split('').map(letter =>
            guessedLetters.includes(letter) ? letter : '_'
        ).join(' ');
    }

    function getHangmanSVG(errors) {
        const parts = [
            errors >= 1 ? '<circle cx="50" cy="25" r="10" stroke="currentColor" stroke-width="2" fill="none"/>' : '', // cabeza
            errors >= 2 ? '<line x1="50" y1="35" x2="50" y2="60" stroke="currentColor" stroke-width="2"/>' : '', // cuerpo
            errors >= 3 ? '<line x1="50" y1="40" x2="35" y2="55" stroke="currentColor" stroke-width="2"/>' : '', // brazo izq
            errors >= 4 ? '<line x1="50" y1="40" x2="65" y2="55" stroke="currentColor" stroke-width="2"/>' : '', // brazo der
            errors >= 5 ? '<line x1="50" y1="60" x2="35" y2="80" stroke="currentColor" stroke-width="2"/>' : '', // pierna izq
            errors >= 6 ? '<line x1="50" y1="60" x2="65" y2="80" stroke="currentColor" stroke-width="2"/>' : '', // pierna der
        ];

        return `
            <svg viewBox="0 0 100 100" class="hangman-svg">
                <!-- Estructura -->
                <line x1="10" y1="95" x2="40" y2="95" stroke="currentColor" stroke-width="2"/>
                <line x1="25" y1="95" x2="25" y2="5" stroke="currentColor" stroke-width="2"/>
                <line x1="25" y1="5" x2="50" y2="5" stroke="currentColor" stroke-width="2"/>
                <line x1="50" y1="5" x2="50" y2="15" stroke="currentColor" stroke-width="2"/>
                ${parts.join('')}
            </svg>
        `;
    }

    gameContainer.innerHTML = createGameHTML('🔤 Ahorcado', `
        <div class="hangman-figure" id="hangman-figure">${getHangmanSVG(0)}</div>
        <div class="hangman-word" id="hangman-word">${renderWord()}</div>
        <div class="hangman-keyboard" id="hangman-keyboard">
            ${'abcdefghijklmnñopqrstuvwxyz'.split('').map(letter =>
        `<button class="keyboard-key" data-letter="${letter}">${letter.toUpperCase()}</button>`
    ).join('')}
        </div>
        <div class="game-stats">
            <span class="stat">Errores: <strong id="hangman-mistakes">0</strong>/${maxMistakes}</span>
        </div>
        <div id="hangman-result" class="game-result"></div>
        <button id="hangman-reset" class="game-reset-btn">Nueva Palabra</button>
    `);

    const figureEl = document.getElementById('hangman-figure');
    const wordEl = document.getElementById('hangman-word');
    const mistakesEl = document.getElementById('hangman-mistakes');
    const resultEl = document.getElementById('hangman-result');
    const keyboard = document.getElementById('hangman-keyboard');
    const resetBtn = document.getElementById('hangman-reset');

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
            mistakes++;
            mistakesEl.textContent = mistakes;
            figureEl.innerHTML = getHangmanSVG(mistakes);

            if (mistakes >= maxMistakes) {
                resultEl.className = 'game-result error';
                resultEl.textContent = `¡Perdiste! La palabra era: ${word.toUpperCase()}`;
                wordEl.textContent = word.split('').join(' ');
                disableKeyboard();
            }
        }
    });

    function disableKeyboard() {
        keyboard.querySelectorAll('.keyboard-key').forEach(key => key.disabled = true);
    }

    resetBtn.addEventListener('click', () => loadHangmanGame());
}

// ===================================
// DINO GAME
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
// TIC TAC TOE GAME
// ===================================
function loadTicTacToeGame() {
    let board = Array(9).fill('');
    let currentPlayer = 'X';
    let gameActive = true;
    let vsComputer = false;
    let difficulty = 'medium';

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    gameContainer.innerHTML = createGameHTML('⭕ Tres en Raya', `
        <div class="ttt-modes">
            <button class="ttt-mode-btn active" data-mode="2p">👥 2 Jugadores</button>
            <button class="ttt-mode-btn" data-mode="1p">🤖 vs CPU</button>
        </div>
        <div class="ttt-difficulty" id="ttt-difficulty" style="display: none;">
            <button class="ttt-diff-btn" data-diff="easy">Fácil</button>
            <button class="ttt-diff-btn active" data-diff="medium">Medio</button>
            <button class="ttt-diff-btn" data-diff="hard">Difícil</button>
        </div>
        <div id="ttt-status" class="game-status-text">Turno de X</div>
        <div class="ttt-board" id="ttt-board">
            ${Array(9).fill('').map((_, i) => `<div class="ttt-cell" data-index="${i}"></div>`).join('')}
        </div>
        <button id="ttt-reset" class="game-reset-btn">Nuevo Juego</button>
    `);

    const boardEl = document.getElementById('ttt-board');
    const cells = boardEl.querySelectorAll('.ttt-cell');
    const statusEl = document.getElementById('ttt-status');
    const modeButtons = document.querySelectorAll('.ttt-mode-btn');
    const difficultyEl = document.getElementById('ttt-difficulty');
    const diffButtons = document.querySelectorAll('.ttt-diff-btn');
    const resetBtn = document.getElementById('ttt-reset');

    function checkWinner() {
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return board.includes('') ? null : 'tie';
    }

    function computerMove() {
        if (!gameActive) return;

        let move;
        const random = Math.random();

        if (difficulty === 'hard' || (difficulty === 'medium' && random < 0.7)) {
            move = getBestMove();
        } else {
            const empty = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
            move = empty[Math.floor(Math.random() * empty.length)];
        }

        setTimeout(() => {
            if (move !== undefined) makeMove(move);
        }, 400);
    }

    function getBestMove() {
        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, 0, false);
                board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }

    function minimax(b, depth, isMax) {
        const winner = checkWinner();
        if (winner === 'O') return 10 - depth;
        if (winner === 'X') return depth - 10;
        if (winner === 'tie') return 0;

        if (isMax) {
            let best = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (b[i] === '') {
                    b[i] = 'O';
                    best = Math.max(best, minimax(b, depth + 1, false));
                    b[i] = '';
                }
            }
            return best;
        } else {
            let best = Infinity;
            for (let i = 0; i < 9; i++) {
                if (b[i] === '') {
                    b[i] = 'X';
                    best = Math.min(best, minimax(b, depth + 1, true));
                    b[i] = '';
                }
            }
            return best;
        }
    }

    function makeMove(index) {
        if (board[index] !== '' || !gameActive) return;

        board[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        cells[index].classList.add(currentPlayer.toLowerCase());

        const winner = checkWinner();
        if (winner) {
            gameActive = false;
            if (winner === 'tie') {
                statusEl.textContent = '¡Empate!';
            } else {
                statusEl.textContent = vsComputer ?
                    (winner === 'X' ? '¡Ganaste! 🎉' : '¡Perdiste!') :
                    `¡Jugador ${winner} gana! 🎉`;
            }
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusEl.textContent = vsComputer ?
            (currentPlayer === 'X' ? 'Tu turno (X)' : 'Turno de CPU...') :
            `Turno de ${currentPlayer}`;

        if (vsComputer && currentPlayer === 'O') {
            computerMove();
        }
    }

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (vsComputer && currentPlayer === 'O') return;
            makeMove(parseInt(cell.dataset.index));
        });
    });

    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            vsComputer = btn.dataset.mode === '1p';
            difficultyEl.style.display = vsComputer ? 'flex' : 'none';
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

    function resetGame() {
        board = Array(9).fill('');
        currentPlayer = 'X';
        gameActive = true;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
        statusEl.textContent = vsComputer ? 'Tu turno (X)' : 'Turno de X';
    }

    resetBtn.addEventListener('click', resetGame);
}

// ===================================
// MINESWEEPER GAME
// ===================================
function loadMinesweeperGame() {
    const GRID = 8;
    const MINES = 10;
    let grid = [];
    let revealed = [];
    let flagged = [];
    let gameOver = false;
    let firstClick = true;
    let safeCells = GRID * GRID - MINES;

    function init() {
        grid = Array(GRID).fill().map(() => Array(GRID).fill(0));
        revealed = Array(GRID).fill().map(() => Array(GRID).fill(false));
        flagged = Array(GRID).fill().map(() => Array(GRID).fill(false));
        gameOver = false;
        firstClick = true;
        safeCells = GRID * GRID - MINES;

        gameContainer.innerHTML = createGameHTML('💣 Buscaminas', `
            <div class="mines-info">
                <span>🚩 Minas: <strong id="mines-count">${MINES}</strong></span>
            </div>
            <div class="mines-grid" id="mines-grid"></div>
            <div class="mines-help">
                <p>🖱️ Click = Revelar | Click derecho = Bandera</p>
            </div>
            <div id="mines-result" class="game-result"></div>
            <button id="mines-reset" class="game-reset-btn">Nuevo Juego</button>
        `);

        renderGrid();

        document.getElementById('mines-reset').addEventListener('click', init);
    }

    function placeMines(safeX, safeY) {
        let placed = 0;
        while (placed < MINES) {
            const x = Math.floor(Math.random() * GRID);
            const y = Math.floor(Math.random() * GRID);
            if (grid[y][x] !== -1 && (Math.abs(x - safeX) > 1 || Math.abs(y - safeY) > 1)) {
                grid[y][x] = -1;
                placed++;
            }
        }

        for (let y = 0; y < GRID; y++) {
            for (let x = 0; x < GRID; x++) {
                if (grid[y][x] !== -1) {
                    grid[y][x] = countMines(x, y);
                }
            }
        }
    }

    function countMines(x, y) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const ny = y + dy, nx = x + dx;
                if (ny >= 0 && ny < GRID && nx >= 0 && nx < GRID && grid[ny][nx] === -1) {
                    count++;
                }
            }
        }
        return count;
    }

    function renderGrid() {
        const gridEl = document.getElementById('mines-grid');
        gridEl.innerHTML = '';
        gridEl.style.gridTemplateColumns = `repeat(${GRID}, 1fr)`;

        for (let y = 0; y < GRID; y++) {
            for (let x = 0; x < GRID; x++) {
                const cell = document.createElement('div');
                cell.className = 'mines-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;

                if (revealed[y][x]) {
                    cell.classList.add('revealed');
                    if (grid[y][x] === -1) {
                        cell.textContent = '💣';
                        cell.classList.add('mine');
                    } else if (grid[y][x] > 0) {
                        cell.textContent = grid[y][x];
                        cell.dataset.num = grid[y][x];
                    }
                } else if (flagged[y][x]) {
                    cell.textContent = '🚩';
                }

                cell.addEventListener('click', () => reveal(x, y));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    toggleFlag(x, y);
                });

                gridEl.appendChild(cell);
            }
        }
    }

    function reveal(x, y) {
        if (gameOver || revealed[y][x] || flagged[y][x]) return;

        if (firstClick) {
            placeMines(x, y);
            firstClick = false;
        }

        revealed[y][x] = true;

        if (grid[y][x] === -1) {
            gameOver = true;
            revealAll();
            document.getElementById('mines-result').className = 'game-result error';
            document.getElementById('mines-result').textContent = '¡Boom! Perdiste 💥';
            return;
        }

        safeCells--;
        if (safeCells === 0) {
            gameOver = true;
            document.getElementById('mines-result').className = 'game-result success';
            document.getElementById('mines-result').textContent = '¡Ganaste! 🎉';
        }

        if (grid[y][x] === 0) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const ny = y + dy, nx = x + dx;
                    if (ny >= 0 && ny < GRID && nx >= 0 && nx < GRID) {
                        reveal(nx, ny);
                    }
                }
            }
        }

        renderGrid();
    }

    function toggleFlag(x, y) {
        if (gameOver || revealed[y][x]) return;
        flagged[y][x] = !flagged[y][x];
        const count = flagged.flat().filter(f => f).length;
        document.getElementById('mines-count').textContent = MINES - count;
        renderGrid();
    }

    function revealAll() {
        for (let y = 0; y < GRID; y++) {
            for (let x = 0; x < GRID; x++) {
                if (grid[y][x] === -1) revealed[y][x] = true;
            }
        }
        renderGrid();
    }

    init();
}

// ===================================
// CONNECT 4 GAME
// ===================================
function loadConnect4Game() {
    const ROWS = 6, COLS = 7;
    let board = Array(ROWS).fill().map(() => Array(COLS).fill(''));
    let currentPlayer = 'red';
    let gameActive = true;
    let vsComputer = false;

    gameContainer.innerHTML = createGameHTML('🔴 Conecta 4', `
        <div class="c4-modes">
            <button class="c4-mode-btn active" data-mode="2p">👥 2 Jugadores</button>
            <button class="c4-mode-btn" data-mode="1p">🤖 vs CPU</button>
        </div>
        <div id="c4-status" class="game-status-text">Turno: 🔴 Rojo</div>
        <div class="c4-board" id="c4-board">
            ${Array(ROWS * COLS).fill('').map((_, i) =>
        `<div class="c4-cell" data-col="${i % COLS}"></div>`
    ).join('')}
        </div>
        <button id="c4-reset" class="game-reset-btn">Nuevo Juego</button>
    `);

    const boardEl = document.getElementById('c4-board');
    const cells = boardEl.querySelectorAll('.c4-cell');
    const statusEl = document.getElementById('c4-status');
    const modeButtons = document.querySelectorAll('.c4-mode-btn');
    const resetBtn = document.getElementById('c4-reset');

    function dropPiece(col) {
        if (!gameActive) return false;

        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row][col] === '') {
                board[row][col] = currentPlayer;
                updateBoard();

                if (checkWin(row, col)) {
                    gameActive = false;
                    const emoji = currentPlayer === 'red' ? '🔴' : '🟡';
                    statusEl.textContent = vsComputer ?
                        (currentPlayer === 'red' ? '¡Ganaste! 🎉' : '¡Perdiste!') :
                        `¡${emoji} gana!`;
                    return true;
                }

                if (board[0].every(cell => cell !== '')) {
                    gameActive = false;
                    statusEl.textContent = '¡Empate!';
                    return true;
                }

                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
                const emoji = currentPlayer === 'red' ? '🔴 Rojo' : '🟡 Amarillo';
                statusEl.textContent = vsComputer ?
                    (currentPlayer === 'red' ? 'Tu turno 🔴' : 'CPU pensando...') :
                    `Turno: ${emoji}`;
                return true;
            }
        }
        return false;
    }

    function checkWin(row, col) {
        const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
        const color = board[row][col];

        for (const [dy, dx] of directions) {
            let count = 1;
            for (let dir = -1; dir <= 1; dir += 2) {
                let r = row + dy * dir, c = col + dx * dir;
                while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === color) {
                    count++;
                    r += dy * dir;
                    c += dx * dir;
                }
            }
            if (count >= 4) return true;
        }
        return false;
    }

    function computerMove() {
        if (!gameActive) return;

        setTimeout(() => {
            // Try to win or block
            for (let col = 0; col < COLS; col++) {
                const row = getDropRow(col);
                if (row === -1) continue;

                // Check win
                board[row][col] = 'yellow';
                if (checkWin(row, col)) {
                    board[row][col] = '';
                    dropPiece(col);
                    return;
                }
                board[row][col] = '';

                // Check block
                board[row][col] = 'red';
                if (checkWin(row, col)) {
                    board[row][col] = '';
                    dropPiece(col);
                    return;
                }
                board[row][col] = '';
            }

            // Random valid move
            const valid = [];
            for (let c = 0; c < COLS; c++) {
                if (board[0][c] === '') valid.push(c);
            }
            if (valid.length) dropPiece(valid[Math.floor(Math.random() * valid.length)]);
        }, 500);
    }

    function getDropRow(col) {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row][col] === '') return row;
        }
        return -1;
    }

    function updateBoard() {
        cells.forEach((cell, i) => {
            const row = Math.floor(i / COLS);
            const col = i % COLS;
            cell.className = `c4-cell ${board[row][col]}`;
        });
    }

    function resetGame() {
        board = Array(ROWS).fill().map(() => Array(COLS).fill(''));
        currentPlayer = 'red';
        gameActive = true;
        updateBoard();
        statusEl.textContent = vsComputer ? 'Tu turno 🔴' : 'Turno: 🔴 Rojo';
    }

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (vsComputer && currentPlayer === 'yellow') return;
            const col = parseInt(cell.dataset.col);
            if (dropPiece(col) && vsComputer && gameActive) {
                computerMove();
            }
        });
    });

    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            vsComputer = btn.dataset.mode === '1p';
            resetGame();
        });
    });

    resetBtn.addEventListener('click', resetGame);
}