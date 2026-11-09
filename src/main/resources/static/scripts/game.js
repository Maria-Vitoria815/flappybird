const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const birdImg = new Image();
birdImg.src = "/images/bird.png";

const birdWidth = 32;
const birdHeight = 32;
const birdX = 50;

canvas.width = 400;
canvas.height = 600;

const bestScoreElement = document.getElementById("best-score-display");

// Game variables
let birdY = 300;
let birdVelocity = 0;
let gravity = 0.5;
let score = 0;
let bestScore = 0;
let gameStarted = false;
let gameOver = false;

let pipes = [];
let pipeGap = 150;

async function loadBestScore() {
    try {
        const response = await fetch('/api/game/best-score');
        const data = await response.json();
        bestScore = Number(data.bestScore || 0);
        bestScoreElement.textContent = `Record: ${bestScore}`;
    } catch (error) {
        console.error('Erro ao carregar recorde:', error);
    }
}

async function saveBestScoreIfNeeded() {
    if (score <= bestScore) {
        return;
    }

    bestScore = score;
    bestScoreElement.textContent = `Record: ${bestScore}`;

    try {
        await fetch('/api/game/best-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ score: bestScore, playerName: 'Player' })
        });
    } catch (error) {
        console.error('Erro ao salvar recorde:', error);
    }
}

// Initialize pipes
function createPipes() {
    let pipeHeight = Math.random() * (canvas.height / 2);
    pipes.push({
        x: canvas.width,
        topHeight: pipeHeight,
        bottomHeight: canvas.height - pipeHeight - pipeGap,
    });
}
// Update game state
function updateGame() {
    if (gameOver) return; // Interrompe o loop se o jogo acabou
    // Bird physics
    birdVelocity += gravity;
    birdY += birdVelocity;

    // Pipes movement
    for (let pipe of pipes) {
        pipe.x -= 2;
        if (pipe.x + 50 < 0) pipes.shift();  // Remove pipe if it's off-screen
    }

    // Add new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipes();
    }

    // Collision detection
    for (let pipe of pipes) {
        // Check if bird is inside the horizontal bounds of the pipe
        if (pipe.x < birdX + birdWidth && pipe.x + 50 > birdX) {
            // Check vertical collision: bird is within top and bottom pipe heights
            if (birdY < pipe.topHeight || birdY + birdHeight > canvas.height - pipe.bottomHeight) {
                alert("Game Over");
                resetGame();
                return;
            }
        }
    }

    // Increment score when bird passes through pipes
    if (pipes[0] && pipes[0].x === 50) {
        score++;
        saveBestScoreIfNeeded();
    }

    // Draw game state
    drawGame();
    requestAnimationFrame(updateGame);
}


// Draw game elements
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (birdImg.complete && birdImg.naturalWidth > 0) {
        ctx.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);
    } else {
        ctx.fillStyle = "#e5b3fe";
        ctx.fillRect(birdX, birdY, birdWidth, birdHeight);
    }

    // Draw pipes
    for (let pipe of pipes) {
        ctx.fillStyle = "pink";
        ctx.fillRect(pipe.x, 0, 50, pipe.topHeight);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, 50, pipe.bottomHeight);
    }

    // Draw score
    document.getElementById("score-display").innerText = `Score: ${score}`;
    bestScoreElement.textContent = `Record: ${bestScore}`;
}


// Reset game state
function resetGame() {
    birdY = 300;
    birdVelocity = 0;
    score = 0;
    pipes = [];
    gameStarted = false;
    gameOver = false;

// Clean canva and restart the score
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("score-display").innerText = "Score: 0";
    bestScoreElement.textContent = `Record: ${bestScore}`;
window.addEventListener('load', async () => {
    await loadBestScore();
    bestScoreElement.textContent = `Record: ${bestScore}`;
});

document.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Enter") {
        birdVelocity = -8; // Make the bird jump (move up)

        if(!gameStarted){
           gameStarted = true;
           updateGame(); //inicia o jogo apenas na primeira interação

        }
    }
});