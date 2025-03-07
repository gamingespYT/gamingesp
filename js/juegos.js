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
                    <h3>🎮 Juego de Memoria</h3>
                    <p>Encuentra todas las parejas de cartas. ¡Pon a prueba tu memoria!</p>
                </div>
            </div>
        `;
    } else if (selectedGame === 'guess-number') {
        loadGuessNumberGame();
    } else if (selectedGame === 'rock-paper-scissors') {
        loadRockPaperScissorsGame();
    } else if (selectedGame === 'memory-game') {
        loadMemoryGame();
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
