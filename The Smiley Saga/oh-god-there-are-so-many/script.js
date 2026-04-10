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

// Smileys info
const nerd = {
    x: Math.floor(Math.random() * (gameArea.width - 100)) + 50,
    y: Math.floor(Math.random() * (gameArea.height - 100)) + 50,
    speedX: Math.random() * 20 - 10,
    speedY: Math.random() * 20 - 10,
    width: 75,
    height: 75,
    img: new Image(),
    spawnTime: 0
};
nerd.img.src = '../images/really-tuff-smiley-face.png';
const smileys = [nerd];

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
    
    for (let player of smileys) {
        // Change the amount of time the player has been alive
        player.spawnTime++;

        // Move Player based on speed
         player.x += player.speedX;
         player.y += player.speedY;
    
        // Bounce
        if (player.x <= 0 || player.x >= gameArea.width - player.width) {
            player.speedX *= -1;
            player.height += 5;

            // Spawn new smiley if some time has passed
            if (player.spawnTime >=20) { // We delay so that smileys don't immediatly create copies off spawn
                const newSmiley = {
                    x: player.x,
                    y: player.y,
                    speedX: Math.random() * 20 - 10,
                    speedY: Math.random() * 20 - 10,
                    width: 75,
                    height: 75,
                    img: player.img,
                    spawnTime: 0
                };
                smileys.push(newSmiley);
            };
        };
        if (player.y <= 0 || player.y >= gameArea.height - player.height) {
            player.speedY *= -1;
            player.width += 5;
            
            // Spawn new smiley if some time has passed
            if (player.spawnTime >=20) { // We delay so that smileys don't immediatly create copies of spawn
                const newSmiley = {
                    x: player.x,
                    y: player.y,
                    speedX: Math.random() * 20 - 10,
                    speedY: Math.random() * 20 - 10,
                    width: 75,
                    height: 75,
                    img: player.img,
                    spawnTime: 0
                };
                smileys.push(newSmiley);
            };
        };
    
        // Bind player within area
        player.x = Math.max(0, Math.min(gameArea.width - player.width, player.x));
        player.y = Math.max(0, Math.min(gameArea.height - player.height, player.y));
    
        // Draw the player
        ctx.drawImage(player.img, player.x, player.y, player.width, player.height);
    };


    // Request the next frame
    requestAnimationFrame(mainLoop);
};

// Run game
mainLoop();