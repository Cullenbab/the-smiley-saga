// Area info
const gameArea = document.getElementById('game');
if (!gameArea) {
    throw new Error('Game area not found');
};
const ctx = gameArea.getContext('2d');
if (!ctx) {
    throw new Error('2D context not available');
};
gameArea.width = window.innerWidth;
gameArea.height = window.innerHeight;

// Player info
const player = {
    x: Math.floor(Math.random() * (gameArea.width - 100)) + 50,
    y: Math.floor(Math.random() * (gameArea.height - 100)) + 50,
    speedX: Math.random() * 20 - 10,
    speedY: Math.random() * 20 - 10,
    width: 75,
    height: 75,
    img: new Image()
};
player.img.src = '../images/really-tuff-smiley-face.png';

// Resize canvas on window resize
window.addEventListener('resize', () => {
    gameArea.width = window.innerWidth;
    gameArea.height = window.innerHeight;
});

// Soviet Saga
if (Math.random() < 0.01) {
    gameArea.style.backgroundImage = "url('../images/soviet-saga.png')";
};

// Give me cash lol
if (Math.random() < 0.1) {
    alert('give me cash lol');
};

// Main game loop
function mainLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, gameArea.width, gameArea.height);

    // Move Player based on speed
     player.x += player.speedX;
     player.y += player.speedY;

    // Bounce
    if (player.x <= 0 || player.x >= gameArea.width - player.width) {
        player.speedX *= -1;
    };
    if (player.y <= 0 || player.y >= gameArea.height - player.height) {
        player.speedY *= -1;
    };

    // Bind player within area
    player.x = Math.max(0, Math.min(gameArea.width - player.width, player.x));
    player.y = Math.max(0, Math.min(gameArea.height - player.height, player.y));

    // Draw the player
    ctx.drawImage(player.img, player.x, player.y, player.width, player.height);

    // Request the next frame
    requestAnimationFrame(mainLoop);
};

// Run game
mainLoop();