const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Game variables
let birdY = 300;
let birdVelocity = 0;
let gravity = 0.5;
let score = 0;

let pipes = [];
let pipeGap = 150;

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
        if (pipe.x < 50 + 20 && pipe.x + 50 > 50) {
            // Check vertical collision: bird is within top and bottom pipe heights
            if (birdY < pipe.topHeight || birdY > canvas.height - pipe.bottomHeight) {
                alert("Game Over");
                resetGame();
                return;
            }
        }
    }

    // Increment score when bird passes through pipes
    if (pipes[0] && pipes[0].x === 50) score++;

    // Draw game state
    drawGame();
    requestAnimationFrame(updateGame);
}


// Draw game elements
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird (replace with an image if needed)
    ctx.fillStyle = "#e5b3fe";
    ctx.fillRect(50, birdY, 20, 20); // Draw bird as a yellow square

    // Draw pipes
    for (let pipe of pipes) {
        ctx.fillStyle = "pink";
        ctx.fillRect(pipe.x, 0, 50, pipe.topHeight);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, 50, pipe.bottomHeight);
    }

    // Draw score
    document.getElementById("score-display").innerText = `Score: ${score}`;
}

// Reset game state
function resetGame() {
    birdY = 300;
    birdVelocity = 0;
    score = 0;
    pipes = [];
}

// Listen for keyboard events (Space or Enter)
document.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Enter") {
        birdVelocity = -8; // Make the bird jump (move up)
    }
});

updateGame();
