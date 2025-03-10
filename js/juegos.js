// juegos.js

// Selección del selector y contenedor del juego
const gameSelector = document.getElementById('game-selector');
const gameContainer = document.getElementById('game-container');

// Detectar el cambio en la selección del juego
gameSelector.addEventListener('change', loadGame);

// Función para cargar el juego correspondiente
function loadGame() {
    const selectedGame = gameSelector.value;
    gameContainer.innerHTML = ''; // Limpiar el contenedor

    if (selectedGame === '') {
        // Mostrar las descripciones de los juegos
        gameContainer.innerHTML = `
            <h2>¡Bienvenido a los Juegos!</h2>
            <div class="game-descriptions">
                <div class="game-description">
                    <h3>🎯 Adivina el Número</h3>
                    <p>Intenta adivinar el número secreto entre 1 y 100. ¡Te diremos si es mayor o menor!</p>
                </div>
                <div class="game-description">
                    <h3>✌️ Piedra, Papel o Tijera</h3>
                    <p>El clásico juego contra la computadora. ¡Elige sabiamente!</p>
                </div>
                <div class="game-description">
                    <h3>🤔 Memory</h3>
                    <p>Encuentra todas las parejas de cartas. ¡Pon a prueba tu memoria!</p>
                </div>
                <div class="game-description">
                    <h3>🔤 Ahorcado</h3>
                    <p>Adivina la palabra antes de que se complete el dibujo del ahorcado.</p>
                </div>
                <div class="game-description">
                    <h3>🦖 Juego del Dinosaurio</h3>
                    <p>¡Salta y esquiva obstáculos en el clásico juego del dinosaurio de Chrome!</p>
                </div>
                <div class="game-description">
                    <h3>⭕ Tres en Raya</h3>
                    <p>El clásico juego de X y O. ¡Consigue tres en línea para ganar!</p>
                </div>
                <div class="game-description">
                    <h3>💣 Buscaminas</h3>
                    <p>El clásico juego de evitar las minas. ¡Usa tu lógica para descubrir las casillas seguras!</p>
                </div>
            </div>
        `;
    } else if (selectedGame === 'guess-number') {
        loadGuessNumberGame();
    } else if (selectedGame === 'rock-paper-scissors') {
        loadRockPaperScissorsGame();
    } else if (selectedGame === 'memory-game') {
        loadMemoryGame();
    } else if (selectedGame === 'hangman') {
        loadHangmanGame();
    } else if (selectedGame === 'dino-game') {
        loadDinoGame();
    } else if (selectedGame === 'tic-tac-toe') {
        loadTicTacToeGame();
    } else if (selectedGame === 'minesweeper') {
    loadMinesweeperGame();
    }
}

// Juego: Adivina el Número
function loadGuessNumberGame() {
    let numeroSecreto = Math.floor(Math.random() * 100) + 1;
    let intentos = 0;

    gameContainer.innerHTML = `
        <h2>Adivina el Número</h2>
        <p>Estoy pensando en un número entre 1 y 100. ¿Puedes adivinarlo?</p>
        <input type="number" id="guess" placeholder="Escribe tu número" />
        <button id="submit-btn">Adivinar</button>
        <div id="resultado"></div>
        <p>Intentos: <span id="contador">0</span></p>
    `;

    const submitBtn = document.getElementById('submit-btn');
    const guessInput = document.getElementById('guess');
    const resultadoDiv = document.getElementById('resultado');
    const contadorDiv = document.getElementById('contador');

    submitBtn.addEventListener('click', () => {
        handleGuess();
    });

    guessInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleGuess();
        }
    });

    function handleGuess() {
        const guess = parseInt(guessInput.value);
        if (isNaN(guess) || guess < 1 || guess > 100) {
            resultadoDiv.textContent = 'Por favor, introduce un número válido entre 1 y 100.';
            return;
        }

        intentos++;
        contadorDiv.textContent = intentos;

        if (guess === numeroSecreto) {
            resultadoDiv.textContent = `¡Felicidades! Has adivinado el número en ${intentos} intentos.`;
        } else if (guess < numeroSecreto) {
            resultadoDiv.textContent = 'El número es mayor, intenta de nuevo.';
        } else {
            resultadoDiv.textContent = 'El número es menor, intenta de nuevo.';
        }
    }
}

// Juego: Piedra, Papel o Tijera
let playerWins = 0;
let computerWins = 0;

function loadRockPaperScissorsGame() {
    gameContainer.innerHTML = `
        <h2>Piedra, Papel o Tijera</h2>
        <p>Selecciona tu opción:</p>
        <button class="choice-btn" data-choice="piedra">🪨 Piedra</button>
        <button class="choice-btn" data-choice="papel">📄 Papel</button>
        <button class="choice-btn" data-choice="tijera">✂️ Tijera</button>
        <div id="resultado"></div>
        <div id="score">
            <p>Jugador: <span id="player-score">0</span> | Computadora: <span id="computer-score">0</span></p>
        </div>
    `;

    const choiceButtons = document.querySelectorAll('.choice-btn');
    const resultadoDiv = document.getElementById('resultado');
    const playerScore = document.getElementById('player-score');
    const computerScore = document.getElementById('computer-score');

    choiceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const userChoice = button.getAttribute('data-choice');
            const computerChoice = ['piedra', 'papel', 'tijera'][Math.floor(Math.random() * 3)];

            // Determinar el ganador
            if (userChoice === computerChoice) {
                resultadoDiv.textContent = `Empate! Ambos eligieron ${userChoice}.`;
            } else if (
                (userChoice === 'piedra' && computerChoice === 'tijera') ||
                (userChoice === 'papel' && computerChoice === 'piedra') ||
                (userChoice === 'tijera' && computerChoice === 'papel')
            ) {
                playerWins++;
                playerScore.textContent = playerWins;
                resultadoDiv.textContent = `¡Ganaste! ${userChoice.charAt(0).toUpperCase() + userChoice.slice(1)} vence a ${computerChoice}.`;
            } else {
                computerWins++;
                computerScore.textContent = computerWins;
                resultadoDiv.textContent = `Perdiste! ${computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1)} vence a ${userChoice}.`;
            }
        });
    });
}

function loadMemoryGame() {
    const cards = [
        '🎮', '🎮', '🕹️', '🕹️', '🎲', '🎲', '🎯', '🎯', 
        '⚔️', '⚔️', '🛡️', '🛡️', '🔫', '🔫', '🚀', '🚀'
    ];
    let shuffledCards = cards.sort(() => Math.random() - 0.5);
    let flippedCards = [];
    let matchedCards = 0;
    let canFlip = true;

    gameContainer.innerHTML = `
        <h2>Juego de Memoria</h2>
        <p>¡Encuentra las parejas de cartas!</p>
        <div id="memory-board" class="memory-board">
            ${shuffledCards.map((card, index) => `<div class="memory-card hidden" data-card="${card}" data-index="${index}">${card}</div>`).join('')}
        </div>
        <p>Cartas emparejadas: <span id="matched-count">0</span></p>
        <p id="game-status"></p>
    `;

    const memoryBoard = document.getElementById('memory-board');
    const matchedCount = document.getElementById('matched-count');
    const gameStatus = document.getElementById('game-status');
    const cards_elements = document.querySelectorAll('.memory-card');

    // Añadir interactive inmediatamente para poder empezar a jugar
    memoryBoard.classList.add('interactive');

    memoryBoard.addEventListener('click', (e) => {
        if (!memoryBoard.classList.contains('interactive') || !canFlip) return;
        
        const clickedCard = e.target;
        if (clickedCard.classList.contains('memory-card') && 
            !flippedCards.includes(clickedCard) && 
            clickedCard.classList.contains('hidden')) {
            
            clickedCard.classList.remove('hidden');
            flippedCards.push(clickedCard);

            if (flippedCards.length === 2) {
                canFlip = false;
                const [card1, card2] = flippedCards;

                if (card1.getAttribute('data-card') === card2.getAttribute('data-card')) {
                    matchedCards++;
                    matchedCount.textContent = matchedCards;
                    flippedCards = [];
                    canFlip = true;

                    if (matchedCards === cards.length / 2) {
                        gameStatus.textContent = '¡Felicidades! ¡Has ganado!';
                    }
                } else {
                    setTimeout(() => {
                        card1.classList.add('hidden');
                        card2.classList.add('hidden');
                        flippedCards = [];
                        canFlip = true;
                    }, 1000);
                }
            }
        }
    });
}

// Juego: Ahorcado
function loadHangmanGame() {
    const words = [
        'fortnite',
        'llama',
        'pico',
        'skin',
        'emote',
        'escuadron',
        'tormenta',
        'videojuegos',
        'gamer',
        'joystick',
        'pixel',
        'multijugador',
        'noob',
        'lag',
        'competitividad'
    ];
    const word = words[Math.floor(Math.random() * words.length)];
    let guessedLetters = [];
    let mistakes = 0;
    const maxMistakes = 6;

    const hangmanStages = [
        `
      
      
      
      
      
      
=========`,
        `
      |
      |
      |
      |
      |
      |
=========`,
        `
  +---+
      |
      |
      |
      |
      |
=========`,
        `
  +---+
  |   |
      |
      |
      |
      |
=========`,
        `
  +---+
  |   |
  😮  |
      |
      |
      |
=========`,
        `
  +---+
  |   |
  😮  |
 /|\\  |
      |
      |
=========`,
        `
  +---+
  |   |
  😵  |
 /|\\  |
 / \\  |
      |
=========`
    ];

    // Agregar el HTML necesario
    gameContainer.innerHTML = `
        <h2>Ahorcado</h2>
        <div id="hangman-drawing" class="hangman-drawing"></div>
        <div id="word-display" class="word-display"></div>
        <div class="controls">
            <input type="text" id="letter-input" maxlength="1" placeholder="Ingresa una letra">
            <button id="guess-btn">Adivinar</button>
        </div>
        <div id="used-letters">Letras usadas: </div>
        <div id="hangman-status"></div>
    `;

    // Obtener referencias a los elementos del DOM
    const hangmanDrawing = document.getElementById('hangman-drawing');
    const wordDisplay = document.getElementById('word-display');
    const letterInput = document.getElementById('letter-input');
    const guessBtn = document.getElementById('guess-btn');
    const usedLetters = document.getElementById('used-letters');
    const hangmanStatus = document.getElementById('hangman-status');

    function updateWordDisplay() {
        wordDisplay.textContent = word.split('').map(letter => 
            guessedLetters.includes(letter) ? letter : '_').join(' ');
    }

    function updateHangmanDrawing() {
        hangmanDrawing.textContent = hangmanStages[mistakes];
    }

    function checkGameStatus() {
        if (mistakes >= maxMistakes) {
            hangmanStatus.textContent = `¡Perdiste! La palabra era "${word}".`;
            guessBtn.disabled = true;
            letterInput.disabled = true;
        } else if (word.split('').every(letter => guessedLetters.includes(letter))) {
            hangmanStatus.textContent = '¡Felicidades! Has adivinado la palabra.';
            guessBtn.disabled = true;
            letterInput.disabled = true;
        }
    }

    guessBtn.addEventListener('click', () => {
        const letter = letterInput.value.toLowerCase();
        letterInput.value = '';

        if (!letter || guessedLetters.includes(letter)) {
            return;
        }

        guessedLetters.push(letter);
        usedLetters.textContent = 'Letras usadas: ' + guessedLetters.join(', ');

        if (word.includes(letter)) {
            updateWordDisplay();
        } else {
            mistakes++;
            updateHangmanDrawing();
        }

        checkGameStatus();
    });

    letterInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            guessBtn.click();
        }
    });

    updateHangmanDrawing();
    updateWordDisplay();
}

function loadDinoGame() {
    gameContainer.innerHTML = `
        <h2>Juego del Dinosaurio</h2>
        <div class="dino-container">
            <iframe src="https://chromedino.com/" frameborder="0" scrolling="no" width="100%" height="400px" loading="lazy"></iframe>
        </div>
        <div class="dino-link">
            <span class="copy-text" onclick="copyDinoURL()">¿No carga? Abre una nueva pestaña en Chrome y escribe: chrome://dino</span>
        </div>
    `;

    // Función para copiar al portapapeles
    window.copyDinoURL = function() {
        navigator.clipboard.writeText('chrome://dino').then(() => {
            const copyText = document.querySelector('.copy-text');
            const originalText = copyText.textContent;
            copyText.textContent = '¡Copiado al portapapeles!';
            setTimeout(() => {
                copyText.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Error al copiar: ', err);
        });
    }
}

function loadTicTacToeGame() {
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let vsComputer = false;
    let difficulty = 'easy';

    gameContainer.innerHTML = `
        <h2>Tres en Raya</h2>
        <div class="game-mode-selector">
            <button class="mode-btn active" data-mode="2p">2 Jugadores</button>
            <button class="mode-btn" data-mode="1p">1 Jugador</button>
        </div>
        <div class="difficulty-selector" style="display: none;">
            <button class="diff-btn" data-diff="easy">Fácil</button>
            <button class="diff-btn" data-diff="hard">Medio</button>
            <button class="diff-btn" data-diff="impossible">Imposible</button>
        </div>
        <div class="game-status"></div>
        <div class="tic-tac-toe">
            ${Array(9).fill('').map((_, i) => `
                <div class="cell" data-index="${i}"></div>
            `).join('')}
        </div>
        <button class="reset-button">Reiniciar Juego</button>
    `;

    const gameStatus = gameContainer.querySelector('.game-status');
    const cells = gameContainer.querySelectorAll('.cell');
    const resetButton = gameContainer.querySelector('.reset-button');
    const modeButtons = gameContainer.querySelectorAll('.mode-btn');
    const difficultySelector = gameContainer.querySelector('.difficulty-selector');
    const difficultyButtons = gameContainer.querySelectorAll('.diff-btn');

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6] // Diagonales
    ];

    function computerMove() {
        if (!gameActive) return;

        let index;
        switch (difficulty) {
            case 'impossible':
                index = getBestMove();
                break;
            case 'hard':
                // 95% de probabilidad de movimiento inteligente
                index = Math.random() < 0.95 ? getBestMove() : getRandomMove();
                break;
            default: // easy
                // 60% de probabilidad de movimiento inteligente
                index = Math.random() < 0.6 ? getBestMove() : getRandomMove();
        }

        setTimeout(() => {
            if (index !== null) {
                const cell = cells[index];
                gameBoard[index] = 'O';
                cell.textContent = 'O';
                cell.classList.add('o');

                if (checkWin()) {
                    gameStatus.textContent = '¡La computadora ha ganado!';
                    gameActive = false;
                    return;
                }

                if (checkDraw()) {
                    gameStatus.textContent = '¡Empate!';
                    gameActive = false;
                    return;
                }

                currentPlayer = 'X';
                gameStatus.textContent = 'Tu turno';
            }
        }, 500);
    }

    function getBestMove() {
        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < 9; i++) {
            if (gameBoard[i] === '') {
                gameBoard[i] = 'O';
                let score = minimax(gameBoard, 0, false);
                gameBoard[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }

    function minimax(board, depth, isMaximizing) {
        let winner = checkWinForMinimax();
        if (winner !== null) {
            return winner === 'O' ? 1 : -1;
        }
        if (checkDraw()) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function getRandomMove() {
        const emptyCells = gameBoard.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    function handleCellClick(e) {
        const cell = e.target;
        const index = cell.getAttribute('data-index');

        if (gameBoard[index] !== '' || !gameActive) return;
        if (vsComputer && currentPlayer === 'O') return;

        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        if (checkWin()) {
            gameStatus.textContent = `¡${vsComputer ? 'Has ganado!' : 'Jugador ' + currentPlayer + ' ha ganado!'}`;
            gameActive = false;
            return;
        }

        if (checkDraw()) {
            gameStatus.textContent = '¡Empate!';
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        gameStatus.textContent = vsComputer ? 
            (currentPlayer === 'X' ? 'Tu turno' : 'Turno de la computadora') : 
            `Turno del jugador ${currentPlayer}`;

        if (vsComputer && currentPlayer === 'O') {
            computerMove();
        }
    }

    function checkWin() {
        return winningConditions.some(condition => {
            return condition.every(index => gameBoard[index] === currentPlayer);
        });
    }

    function checkWinForMinimax() {
        for (let condition of winningConditions) {
            if (condition.every(index => gameBoard[index] === 'O')) return 'O';
            if (condition.every(index => gameBoard[index] === 'X')) return 'X';
        }
        return null;
    }

    function checkDraw() {
        return gameBoard.every(cell => cell !== '');
    }

    function resetGame() {
        currentPlayer = 'X';
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        gameStatus.textContent = vsComputer ? 'Tu turno' : `Turno del jugador ${currentPlayer}`;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
    }

    // Event Listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetButton.addEventListener('click', resetGame);

    modeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            vsComputer = btn.getAttribute('data-mode') === '1p';
            difficultySelector.style.display = vsComputer ? 'block' : 'none';
            resetGame();
        });
    });

    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            difficultyButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            difficulty = btn.getAttribute('data-diff');
            resetGame();
        });
    });

    // Inicializar el estado del juego
    gameStatus.textContent = 'Turno del jugador X';
}
function loadMinesweeperGame() {
    const GRID_SIZE = 10;
    const MINES_COUNT = 15;
    let grid = [];
    let revealed = [];
    let flagged = [];
    let gameOver = false;
    let minesLeft = MINES_COUNT;
    let safeCellsLeft = GRID_SIZE * GRID_SIZE - MINES_COUNT;
    let isFirstClick = true;

    gameContainer.innerHTML = `
    <h2>Buscaminas</h2>
    <div style="margin-top: 5px;">
        <div class="game-info">
            <span>Minas restantes: <span id="mines-left">${minesLeft}</span></span>
        </div>
        <div class="minesweeper-grid"></div>
        <button id="reset-minesweeper" class="reset-button">Nuevo Juego</button>
        <div class="instructions">
            <p>🖱️ Click izquierdo: Revelar casilla</p>
            <p>🚩 Click derecho: Marcar/Desmarcar bandera</p>
        </div>
        <div id="game-message"></div>
    </div>
`;

    const minesweeperGrid = gameContainer.querySelector('.minesweeper-grid');
    const minesLeftDisplay = gameContainer.querySelector('#mines-left');
    const resetButton = gameContainer.querySelector('#reset-minesweeper');
    const gameMessage = gameContainer.querySelector('#game-message');

    function initializeGame() {
        grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
        revealed = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false));
        flagged = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false));
        gameOver = false;
        minesLeft = MINES_COUNT;
        safeCellsLeft = GRID_SIZE * GRID_SIZE - MINES_COUNT;
        isFirstClick = true;
        minesLeftDisplay.textContent = minesLeft;
        
        // Limpiar mensaje y restaurar instrucciones
        gameMessage.textContent = '';
        gameMessage.className = ''; // Elimina las clases de estilo del mensaje
        
        // Mostrar las instrucciones nuevamente
        const instructions = gameContainer.querySelector('.instructions');
        if (instructions) {
            instructions.style.display = 'block';
        }
        
        renderGrid();
    }

    function placeMines(firstX, firstY) {
        let minesPlaced = 0;
        while (minesPlaced < MINES_COUNT) {
            const x = Math.floor(Math.random() * GRID_SIZE);
            const y = Math.floor(Math.random() * GRID_SIZE);
            if (grid[y][x] !== -1 && 
                (Math.abs(x - firstX) > 1 || Math.abs(y - firstY) > 1)) {
                grid[y][x] = -1;
                minesPlaced++;
            }
        }

        // Calculate numbers
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (grid[y][x] !== -1) {
                    grid[y][x] = countAdjacentMines(x, y);
                }
            }
        }
    }

    function countAdjacentMines(x, y) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const newY = y + dy;
                const newX = x + dx;
                if (newY >= 0 && newY < GRID_SIZE && newX >= 0 && newX < GRID_SIZE) {
                    if (grid[newY][newX] === -1) count++;
                }
            }
        }
        return count;
    }

    function renderGrid() {
        minesweeperGrid.innerHTML = '';
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = document.createElement('div');
                cell.className = 'mine-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;

                if (revealed[y][x]) {
                    cell.classList.add('revealed');
                    if (grid[y][x] === -1) {
                        cell.innerHTML = '💣';
                        cell.classList.add('mine');
                    } else if (grid[y][x] > 0) {
                        cell.textContent = grid[y][x];
                        cell.classList.add(`number-${grid[y][x]}`);
                    }
                } else if (flagged[y][x]) {
                    cell.innerHTML = '🚩';
                }

                minesweeperGrid.appendChild(cell);
            }
        }
    }

    function showMessage(message, type) {
        gameMessage.textContent = message;
        gameMessage.className = `game-message ${type}`;
        
        // Ocultar las instrucciones cuando el juego termina
        const instructions = gameContainer.querySelector('.instructions');
        if (instructions) {
            instructions.style.display = 'none';
        }
    }

    function revealCell(x, y) {
        if (revealed[y][x] || flagged[y][x] || gameOver) return;

        if (isFirstClick) {
            placeMines(x, y);
            isFirstClick = false;
        }

        revealed[y][x] = true;
        if (grid[y][x] === -1) {
            gameOver = true;
            revealAllMines();
            showMessage('¡Game Over! Has encontrado una mina 💣', 'error');
            return;
        }

        safeCellsLeft--;
        if (safeCellsLeft === 0) {
            gameOver = true;
            showMessage('¡Felicidades! Has ganado 🎉', 'success');
            return;
        }

        if (grid[y][x] === 0) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const newY = y + dy;
                    const newX = x + dx;
                    if (newY >= 0 && newY < GRID_SIZE && newX >= 0 && newX < GRID_SIZE) {
                        if (!revealed[newY][newX]) {
                            revealCell(newX, newY);
                        }
                    }
                }
            }
        }

        renderGrid();
    }

    function toggleFlag(x, y) {
        if (revealed[y][x] || gameOver) return;

        flagged[y][x] = !flagged[y][x];
        minesLeft += flagged[y][x] ? -1 : 1;
        minesLeftDisplay.textContent = minesLeft;
        renderGrid();
    }

    function revealAllMines() {
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (grid[y][x] === -1) {
                    revealed[y][x] = true;
                }
            }
        }
        renderGrid();
    }

    minesweeperGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('mine-cell')) {
            const x = parseInt(e.target.dataset.x);
            const y = parseInt(e.target.dataset.y);
            revealCell(x, y);
        }
    });

    minesweeperGrid.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('mine-cell')) {
            const x = parseInt(e.target.dataset.x);
            const y = parseInt(e.target.dataset.y);
            toggleFlag(x, y);
        }
    });

    resetButton.addEventListener('click', initializeGame);

    const style = document.createElement('style');
    style.textContent = `
        .minesweeper-grid {
            display: grid;
            grid-template-columns: repeat(${GRID_SIZE}, 30px);
            gap: 1px;
            background-color: #ccc;
            padding: 10px;
            border-radius: 5px;
            margin: 20px auto;
        }
        .mine-cell {
            width: 30px;
            height: 30px;
            background-color: #eee;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            cursor: pointer;
            user-select: none;
            transition: background-color 0.2s;
        }
        .mine-cell:hover {
            background-color: #ddd;
        }
        .mine-cell.revealed {
            background-color: #fff;
        }
        .mine-cell.mine {
            background-color: #ff9999;
        }
        .number-1 { color: blue; }
        .number-2 { color: green; }
        .number-3 { color: red; }
        .number-4 { color: darkblue; }
        .number-5 { color: darkred; }
        .number-6 { color: teal; }
        .number-7 { color: black; }
        .number-8 { color: gray; }
        .instructions {
            margin-top: 20px;
            text-align: center;
            font-size: 0.9em;
            color: #666;
        }
        .game-info {
            text-align: center;
            margin: 5px 0;
            font-size: 1.2em;
        }
        .game-message {
            text-align: center;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            font-weight: bold;
            animation: fadeIn 0.3s ease-in;
        }
        .game-message.error {
            background-color: #ffebee;
            color: #c62828;
            border: 1px solid #ffcdd2;
        }
        .game-message.success {
            background-color: #e8f5e9;
            color: #2e7d32;
            border: 1px solid #c8e6c9;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    initializeGame();
}