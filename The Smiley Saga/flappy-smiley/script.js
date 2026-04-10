// Area info
const gameArea = document.getElementById('game');
if (!gameArea) {
    throw new Error('Game area not found');
};
const ctx = gameArea.getContext('2d');
if (!ctx) {
    throw new Error('2D context not available');
};
const scoreDisplay = document.getElementById('score');
if (!scoreDisplay) {
    throw new Error('Score display not found');
};
const hScoreDisplay = document.getElementById('hscore');
if (!hScoreDisplay) {
    throw new Error('High score display not found');
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
    x: 100,
    y: gameArea.height / 2 - 25,
    speedY: 0,
    width: 50,
    height: 50,
    img: new Image(),
    rotation: 0
};
player.img.src = '../images/really-tuff-smiley-face.png';

// Preload fragment images
let fragments = [];
let fragmentImages = [];
for (let i = 0; i < 7; i++) {
    fragmentImages[i] = new Image();
    fragmentImages[i].src = `../images/fragments/frag${i + 1}.png`;
};

// Enemies info
const enemies = [];
let timeUntilSpawn = 99999;

// World info
let gravity = 0.8;
let gameStarted = false;
let dead = false;
let score = 0;
let highScore = parseInt(localStorage.getItem('flappyHighScore')) || 0;

// Key states
let spaceDown = false;
let jumped = false;

// Display high score
hScoreDisplay.textContent = highScore;

// Event listeners for spacebar and click
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        spaceDown = true;
        gameStarted = true;
    }
});
window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        spaceDown = false;
        jumped = true;
    }
});
window.addEventListener('mousedown', () => {
    spaceDown = true;
    gameStarted = true;
});
window.addEventListener('mouseup', () => {
    spaceDown = false;
    jumped = true;
});

// Resize canvas on window resize
window.addEventListener('resize', () => {
    gameArea.width = window.innerWidth;
});

// Soviet Saga
if (Math.random() < 0.01) {
    gameArea.style.backgroundImage = "url('../images/soviet-saga.png')";
};


// Main game loop
function mainLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, gameArea.width, gameArea.height);

    if (!dead) {
        score++;
        if (Math.floor(score / 10) > highScore) {
            highScore = Math.floor(score / 10);
            localStorage.setItem('flappyHighScore', highScore.toString());
            hScoreDisplay.textContent = highScore;
        };
        if (gameStarted && timeUntilSpawn > 9999) {
            timeUntilSpawn = Math.random() * 100 + 50;
            score = 0;
            gravity = 0.8;
        };
        if (!gameStarted) {
            gravity = 0;
        };
        
        // Change player's y speed based on gravity and spacebar
        if (spaceDown) {
            player.speedY -= 40;
            spaceDown = false;
        };
        if (player.y < gameArea.height - 120) {
            spaceDown = false;
        };
        player.speedY += gravity;

        // Kill player if they go too high or too low
         if (player.y < 0 || player.y > gameArea.height - player.height) {
            dead = true;
            spaceDown = false;
            for (let i = 0; i < 7; i++) {
                fragments.push({
                    x: player.x + (Math.random() * player.width) - (player.width / 2),
                    y: player.y + (Math.random() * player.height) - (player.height / 2),
                    speedX: (Math.random() * 30 - 5),
                    speedY: player.speedY + (Math.random() * 30 - 15),
                    width: player.width + 10,
                    height: player.height + 10,
                    img: fragmentImages[i],
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.1
                });

            };
         };
        
        // Max speed
        if (player.speedY < -10) {
            player.speedY = -10;
        };
        
        // Update player's y position based on speed
        player.y += player.speedY;
        
        // Reset jump state when player is on the ground
        if (player.y >= gameArea.height - player.height) {
            jumped = false;
        };
        
        // Spawn enemies
        timeUntilSpawn--;
        if (timeUntilSpawn <= 0) {
            enemies.push({
                x: gameArea.width,
                y: 0,
                width: 150,
                height: Math.random() * (gameArea.height - 200) + 100,
                speedX: -7,
                img: new Image(),
            });
            enemies[enemies.length - 1].img.src = '../images/angry-frowny.png';
            timeUntilSpawn = 50;
        };
                

        // Move enemies
        for (let enemy of enemies) {
            // Move enemy left
            enemy.x += enemy.speedX;
    
            // Remove enemy if it goes off screen
            if (enemy.x + enemy.width < 0) {
                enemies.splice(enemies.indexOf(enemy), 1);
            };
    
            // Check for collision with player
            if (player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y) {
                dead = true;
                spaceDown = false;
                if (Math.floor(score / 10) > highScore) {
                    highScore = Math.floor(score / 10);
                    localStorage.setItem('flappyHighScore', highScore.toString());
                    hScoreDisplay.textContent = highScore;
                };
                for (let i = 0; i < 7; i++) {
                fragments.push({
                    x: player.x + (Math.random() * player.width) - (player.width / 2),
                    y: player.y + (Math.random() * player.height) - (player.height / 2),
                    speedX: -enemy.speedX + (Math.random() * 30 - 15),
                    speedY: player.speedY + (Math.random() * 30 - 15),
                    width: player.width + 10,
                    height: player.height + 10,
                    img: fragmentImages[i],
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.1
                });
            };
            };
        };
    
        // Draw the player
        ctx.save();
        ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
        ctx.rotate(player.rotation);
        ctx.drawImage(player.img, -player.width / 2, -player.height / 2, player.width, player.height);
        ctx.restore();
    } else {
        // Update and draw fragments
        for (let frag of fragments) {
            // Update fragment position
            frag.x += frag.speedX;
            frag.y += frag.speedY;
            frag.speedY += gravity;
            frag.rotation += frag.rotationSpeed;
        
            // Remove fallen fragments
            if (frag.y > gameArea.height + 100) {
                fragments.splice(fragments.indexOf(frag), 1);
            };
        
            // Draw fragment
            ctx.save();
            ctx.translate(frag.x + frag.width / 2, frag.y + frag.height / 2);
            ctx.rotate(frag.rotation);
            ctx.drawImage(frag.img, -frag.width / 2, -frag.height / 2, frag.width, frag.height);
            ctx.restore();
        };

        // Check for spacebar to restart
        info.style.display = 'block';
        info.innerText = 'Click or press space to restart';
        if (spaceDown) {
            player.x = 100;
            player.y = gameArea.height / 2 - 25;
            player.speedY = 0;
            player.rotation = 0;
            enemies.length = 0;
            fragments.length = 0;
            score = 0;
            gameStarted = true;
            dead = false;
        };
    };

    // Draw enemies
    for (let enemy of enemies) {
        ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    };

    // Update score display
    if (gameStarted) {
    scoreDisplay.textContent = Math.floor(score * 0.1);
    };

    // Request the next frame
    requestAnimationFrame(mainLoop);
};

// Run game
mainLoop();