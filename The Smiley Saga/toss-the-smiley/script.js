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

// Players' info
const players = [];

// World info
let gravity = 0.8;

// Key states
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ' ': false
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

    // Change gravity with arrow keys
    if (keys['ArrowUp']) {
        gravity += 0.1;
    } else if (keys['ArrowDown']) {
        gravity -= 0.1;
    };

    // Add new players if space is pressed
    if (keys[' ']) {
        const newPlayer = {
            x: Math.random() * (gameArea.width - 50),
            y: gameArea.height + 10,
            rotation: Math.random() * Math.PI * 2,
            speedX: Math.random() * 8 - 4,
            speedY: -1 * (10 + Math.random() * 30),
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            width: 50,
            height: 50,
            img: new Image()
        };
        newPlayer.img.src = '../images/really-tuff-smiley-face.png';
        if (Math.random() < 0.001) {
            newPlayer.img.src = '../images/other-smileys/GURT.png';
        };
        players.push(newPlayer);
        keys[' '] = false; // MAKE IT STOP PLEASE
    };

    // Update and draw players
    for (let player of players) {
        // Update player position
        player.x += player.speedX;
        player.y += player.speedY;
        player.speedY += gravity;
        player.rotation += player.rotationSpeed;

        // Bounce off walls
        if (player.x < 0) {
            player.x = 0;
            player.speedX *= -0.8;
            if (player.speedY < -1) {
                player.rotationSpeed -= 0.1;
            } else {
                player.rotationSpeed += 0.1;
            };
        };
        if (player.x + player.width > gameArea.width) {
            player.x = gameArea.width - player.width;
            player.speedX *= -0.8;
            if (player.speedY < -1) {
                player.rotationSpeed += 0.1;
            } else {
                player.rotationSpeed -= 0.1;
            };
        };

        // Remove fallen players
        if (player.y > gameArea.height + 100) {
            players.splice(players.indexOf(player), 1);
        };

        // Draw player
        ctx.save();
        ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
        ctx.rotate(player.rotation);
        ctx.drawImage(player.img, -player.width / 2, -player.height / 2, player.width, player.height);
        ctx.restore();
    };

    // Request the next frame
    requestAnimationFrame(mainLoop);
};

// Run game
mainLoop();