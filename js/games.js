// Using popular GitHub game implementations as reference:
// Memory Game: https://github.com/code-sketch/memory-game
// Snake Game: https://github.com/patorjk/JavaScript-Snake
// Quiz Game: https://github.com/WebDevSimplified/JavaScript-Quiz-App

const GameUtils = {
    playSound(name) {
        if (!this.sounds) {
            // Using public sound effects from mixkit.co
            this.sounds = {
                flip: new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'),
                match: new Audio('https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3'),
                point: new Audio('https://assets.mixkit.co/active_storage/sfx/2566/2566-preview.mp3'),
                win: new Audio('https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3'),
                lose: new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3')
            };
            // Preload sounds
            Object.values(this.sounds).forEach(sound => {
                sound.load();
                sound.volume = 0.3;
            });
        }
        this.sounds[name]?.play().catch(() => {});
    },

    saveScore(game, score) {
        const scores = JSON.parse(localStorage.getItem('gameScores') || '{}');
        if (!scores[game] || score > scores[game]) {
            scores[game] = score;
            localStorage.setItem('gameScores', JSON.stringify(scores));
            return true;
        }
        return false;
    }
};

class MemoryGame {
    constructor(container) {
        this.container = container;
        this.cards = [];
        this.flipped = [];
        this.matches = 0;
        this.moves = 0;
        this.locked = false;
        // Using Font Awesome icons for better visibility
        this.symbols = ['fa-code', 'fa-bug', 'fa-coffee', 'fa-terminal', 
                       'fa-keyboard', 'fa-laptop-code', 'fa-database', 'fa-wifi'];
        this.init();
    }

    init() {
        const cards = [...this.symbols, ...this.symbols]
            .sort(() => Math.random() - 0.5);

        this.container.innerHTML = `
            <div class="game-header">
                <span class="moves">Moves: 0</span>
                <span class="matches">Matches: 0/8</span>
                <button class="btn btn-sm btn-outline-primary restart-btn">
                    <i class="fas fa-redo"></i> Restart
                </button>
            </div>
            <div class="memory-grid">
                ${cards.map((symbol, i) => `
                    <div class="memory-card" data-index="${i}" data-symbol="${symbol}">
                        <div class="card-inner">
                            <div class="card-front"></div>
                            <div class="card-back">
                                <i class="fas ${symbol} fa-2x"></i>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add event listeners
        this.container.querySelector('.restart-btn').addEventListener('click', () => this.restart());
        this.container.querySelectorAll('.memory-card').forEach(card => {
            card.addEventListener('click', () => this.flipCard(card));
        });
    }

    destroy() {
        // Remove event listeners and clear intervals
        this.container.querySelectorAll('.memory-card').forEach(card => {
            card.removeEventListener('click', this.flipCard);
        });
    }

    restart() {
        this.destroy();
        this.init();
    }

    flipCard(card) {
        if (this.locked || this.flipped.includes(card) || card.classList.contains('matched')) return;
        
        GameUtils.playSound('flip');
        card.classList.add('flipped');
        this.flipped.push(card);

        if (this.flipped.length === 2) {
            this.locked = true;
            this.moves++;
            this.container.querySelector('.moves').textContent = `Moves: ${this.moves}`;
            this.checkMatch();
        }
    }

    checkMatch() {
        const [card1, card2] = this.flipped;
        const match = card1.dataset.symbol === card2.dataset.symbol;

        if (match) {
            GameUtils.playSound('match');
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.matches++;
            this.container.querySelector('.matches').textContent = `Matches: ${this.matches}/8`;
            
            if (this.matches === 8) {
                this.gameWon();
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1000);
        }

        setTimeout(() => {
            this.flipped = [];
            this.locked = false;
        }, 1000);
    }

    gameWon() {
        const score = Math.round(1000 * (8 / this.moves));
        const isHighScore = GameUtils.saveScore('memory', score);
        
        GameUtils.playSound('win');
        setTimeout(() => {
            this.container.innerHTML = `
                <div class="game-won">
                    <h3>Congratulations! 🎉</h3>
                    <p>You won in ${this.moves} moves</p>
                    <p>Score: ${score}</p>
                    ${isHighScore ? '<p class="high-score">New High Score!</p>' : ''}
                    <button class="btn btn--primary" onclick="new MemoryGame(this.closest('.game-content'))">
                        Play Again
                    </button>
                </div>
            `;
        }, 500);
    }
}

class SnakeGame {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.ctx = this.canvas.getContext('2d');
        this.tileSize = 20;
        this.snake = [{x: 10, y: 10}];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.food = null;
        this.score = 0;
        this.gameLoop = null;
        this.speed = 150;
        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div class="game-header">Score: <span class="score">0</span></div>
        `;
        this.container.appendChild(this.canvas);
        this.spawnFood();
        this.setupControls();
        this.gameLoop = setInterval(() => this.update(), this.speed);
        this.draw();
    }

    destroy() {
        clearInterval(this.gameLoop);
        document.removeEventListener('keydown', this.handleInput);
    }

    setupControls() {
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'w': 'up',
            's': 'down',
            'a': 'left',
            'd': 'right'
        };

        document.addEventListener('keydown', (e) => {
            const newDirection = keyMap[e.key];
            if (newDirection) this.changeDirection(newDirection);
        });

        // Touch controls
        let touchStart = null;
        this.canvas.addEventListener('touchstart', (e) => {
            touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: true });

        this.canvas.addEventListener('touchmove', (e) => {
            if (!touchStart) return;
            
            const touchEnd = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            const dx = touchEnd.x - touchStart.x;
            const dy = touchEnd.y - touchStart.y;

            if (Math.abs(dx) > Math.abs(dy)) {
                this.changeDirection(dx > 0 ? 'right' : 'left');
            } else {
                this.changeDirection(dy > 0 ? 'down' : 'up');
            }
        }, { passive: true });
    }

    changeDirection(newDirection) {
        const opposites = { up: 'down', down: 'up', left: 'right', right: 'left' };
        if (opposites[newDirection] !== this.direction) {
            this.nextDirection = newDirection;
        }
    }

    spawnFood() {
        do {
            this.food = {
                x: Math.floor(Math.random() * (this.canvas.width / this.tileSize)),
                y: Math.floor(Math.random() * (this.canvas.height / this.tileSize))
            };
        } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
    }

    update() {
        this.direction = this.nextDirection;
        const head = { ...this.snake[0] };

        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check collision with walls or self
        if (head.x < 0 || head.x >= this.canvas.width / this.tileSize ||
            head.y < 0 || head.y >= this.canvas.height / this.tileSize ||
            this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            GameUtils.playSound('point');
            this.score += 10;
            this.container.querySelector('.score').textContent = this.score;
            this.spawnFood();
            if (this.speed > 50) this.speed -= 2;
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake
        this.snake.forEach((segment, i) => {
            this.ctx.fillStyle = i === 0 ? '#2ecc71' : '#27ae60';
            this.ctx.fillRect(
                segment.x * this.tileSize,
                segment.y * this.tileSize,
                this.tileSize - 1,
                this.tileSize - 1
            );
        });

        // Draw food
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(
            this.food.x * this.tileSize,
            this.food.y * this.tileSize,
            this.tileSize - 1,
            this.tileSize - 1
        );
    }

    gameOver() {
        clearInterval(this.gameLoop);
        GameUtils.playSound('lose');
        const isHighScore = GameUtils.saveScore('snake', this.score);
        
        this.container.innerHTML = `
            <div class="game-over">
                <h3>Game Over!</h3>
                <p>Score: ${this.score}</p>
                ${isHighScore ? '<p class="high-score">New High Score!</p>' : ''}
                <button class="btn btn--primary" onclick="new SnakeGame(this.closest('.game-content'))">
                    Try Again
                </button>
            </div>
        `;
    }
}

class TechQuiz {
    constructor(container) {
        this.container = container;
        this.currentQuestion = 0;
        this.score = 0;
        // Add more relevant tech questions
        this.questions = [
            {
                question: "What is the latest version of HTML?",
                options: ["HTML4", "HTML5", "HTML6", "HTML2023"],
                correct: 1,
                explanation: "HTML5 is the latest version, introducing many new features like semantic elements and better multimedia support."
            },
            {
                question: "What does API stand for?",
                options: [
                    "Application Programming Interface",
                    "Advanced Programming Integration",
                    "Automated Program Interface",
                    "Application Process Integration"
                ],
                correct: 0
            },
            {
                question: "Which of these is a CSS preprocessor?",
                options: [
                    "jQuery",
                    "SASS",
                    "React",
                    "Express"
                ],
                correct: 1
            },
            {
                question: "What is the purpose of semantic HTML?",
                options: [
                    "To make text bold and italic",
                    "To create animations",
                    "To provide meaning to webpage content",
                    "To style webpage elements"
                ],
                correct: 2
            },
            {
                question: "Which is NOT a JavaScript framework?",
                options: [
                    "Angular",
                    "React",
                    "Vue",
                    "MySQL"
                ],
                correct: 3
            },
            {
                question: "What does SSL stand for?",
                options: [
                    "Secure Sockets Layer",
                    "System Service Layer",
                    "Simple Script Language",
                    "Server Side Logic"
                ],
                correct: 0
            }
        ];
        this.init();
    }

    init() {
        this.showQuestion();
    }

    destroy() {
        // Remove any event listeners or intervals
    }

    showQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.showResults();
            return;
        }

        const question = this.questions[this.currentQuestion];
        this.container.innerHTML = `
            <div class="quiz-container">
                <div class="quiz-progress">Question ${this.currentQuestion + 1}/${this.questions.length}</div>
                <h3>${question.question}</h3>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <button class="quiz-option" onclick="this.closest('.game-content').quiz.checkAnswer(${index})">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        this.container.quiz = this;
    }

    checkAnswer(answer) {
        const correct = answer === this.questions[this.currentQuestion].correct;
        if (correct) {
            GameUtils.playSound('point');
            this.score++;
        }
        this.currentQuestion++;
        this.showQuestion();
    }

    showResults() {
        const percentage = (this.score / this.questions.length) * 100;
        const isHighScore = GameUtils.saveScore('quiz', percentage);
        
        if (percentage >= 80) GameUtils.playSound('win');
        
        this.container.innerHTML = `
            <div class="quiz-results">
                <h3>Quiz Complete!</h3>
                <p>Score: ${this.score}/${this.questions.length} (${percentage}%)</p>
                ${isHighScore ? '<p class="high-score">New High Score!</p>' : ''}
                <button class="btn btn--primary" onclick="new TechQuiz(this.closest('.game-content'))">
                    Try Again
                </button>
            </div>
        `;
    }
}

// Initialize games with error handling and loading states
document.addEventListener('DOMContentLoaded', () => {
    const gameCards = document.querySelectorAll('.game-card');
    if (!gameCards.length) return;

    gameCards.forEach(card => {
        const playBtn = card.querySelector('.play-btn');
        const gameContent = card.querySelector('.game-content');
        
        if (!playBtn || !gameContent) return;

        playBtn.addEventListener('click', () => {
            try {
                gameContent.innerHTML = '<div class="loading-spinner"></div>';
                gameContent.classList.add('active');
                card.querySelector('.game-card__front').style.display = 'none';

                setTimeout(() => {
                    const gameType = card.dataset.game;
                    switch(gameType) {
                        case 'memory': new MemoryGame(gameContent); break;
                        case 'snake': new SnakeGame(gameContent); break;
                        case 'quiz': new TechQuiz(gameContent); break;
                    }
                }, 500);
            } catch (error) {
                console.error('Game initialization error:', error);
                gameContent.innerHTML = `
                    <div class="error-message">
                        <p>Failed to load game. Please try again.</p>
                        <button class="btn btn-primary" onclick="location.reload()">
                            Reload
                        </button>
                    </div>
                `;
            }
        });
    });
});

// Update modal handling
function initGameModal() {
    const modal = document.getElementById('gameModal');
    if (!modal) return;

    modal.addEventListener('shown.bs.modal', function (e) {
        const button = e.relatedTarget;
        const game = button.getAttribute('data-game');
        const container = document.getElementById('gameContent');
        
        // Reset content
        container.innerHTML = '<div class="loading-spinner"></div>';
        
        // Initialize appropriate game
        setTimeout(() => {
            switch(game) {
                case 'memory': new MemoryGame(container); break;
                case 'snake': new SnakeGame(container); break;
                case 'quiz': new TechQuiz(container); break;
            }
        }, 500);
    });

    // Cleanup on modal close
    modal.addEventListener('hidden.bs.modal', function () {
        const container = document.getElementById('gameContent');
        container.innerHTML = '';
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initGameModal);
