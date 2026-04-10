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

// Instructions
const info = document.getElementById('info');
window.addEventListener('keydown', () => {
    info.style.display = 'none';
});
window.addEventListener('click', () => {
    info.style.display = 'none';
});

// Player info
const player = {
    x: gameArea.width / 2 - 25,
    y: gameArea.height / 2 - 25,
    width: 50,
    height: 50,
    img: new Image()
};
player.img.src = '../images/really-tuff-smiley-face.png';

// Key states
const keys = {
    ArrowUp: false,
    w: false,
    ArrowDown: false,
    s: false,
    ArrowLeft: false,
    a: false,
    ArrowRight: false,
    d: false
};

// Event listeners for key presses
window.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (keys.hasOwnProperty(key)) {
        keys[key] = true;
    }
});
window.addEventListener('keyup', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (keys.hasOwnProperty(key)) {
        keys[key] = false;
    }
});

// Resize canvas on window resize
window.addEventListener('resize', () => {
    gameArea.width = window.innerWidth;
    gameArea.height = window.innerHeight;
});

// Soviet Saga
if (Math.random() < 0.01) {
    gameArea.style.backgroundImage = "url('../images/soviet-saga.png')";
};


// Main game loop
function mainLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, gameArea.width, gameArea.height);

    // Change player position based on key presses
    if (keys.ArrowUp || keys.w) player.y -= 5;
    if (keys.ArrowDown || keys.s) player.y += 5;
    if (keys.ArrowLeft || keys.a) player.x -= 5;
    if (keys.ArrowRight || keys.d) player.x += 5;

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