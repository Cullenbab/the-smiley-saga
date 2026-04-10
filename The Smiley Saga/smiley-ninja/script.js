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

// Players' info
const players = [];

// Preload fragment images
let fragments = [];
let fragmentImages = [];
for (let i = 0; i < 7; i++) {
    fragmentImages[i] = new Image();
    fragmentImages[i].src = `../images/fragments/frag${i + 1}.png`;
};

// World info
let gravity = 0.8;

// Key states
let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
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

let score = 0;
let highScore = parseInt(localStorage.getItem('tossHighScore')) || 0;
hScoreDisplay.innerText = highScore;


// Main game loop
function mainLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, gameArea.width, gameArea.height);

    // Add new players occasionally
    if (Math.random() < 0.02) {
        const newPlayer = {
            x: Math.random() * (gameArea.width - 50),
            y: gameArea.height + 10,
            rotation: Math.random() * Math.PI * 2,
            speedX: Math.random() * 8 - 4,
            speedY: -1 * (20 + Math.random() * 25),
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            width: 75,
            height: 75,
            img: new Image()
        };
        newPlayer.img.src = '../images/really-tuff-smiley-face.png';
        players.push(newPlayer);
    };

    // Update and draw players
    for (let player of players) {

        // Explode player if hovered over
        if (mouseX >= player.x && mouseX <= player.x + player.width &&
            mouseY >= player.y && mouseY <= player.y + player.height
        ) {
            for (let i = 0; i < 7; i++) {
                fragments.push({
                    x: player.x + (Math.random() * player.width) - (player.width / 2),
                    y: player.y + (Math.random() * player.height) - (player.height / 2),
                    speedX: player.speedX + (Math.random() * 30 - 15),
                    speedY: player.speedY + (Math.random() * 30 - 15),
                    width: player.width + 10,
                    height: player.height + 10,
                    img: fragmentImages[i],
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.1
                });
            };
            players.splice(players.indexOf(player), 1);
            score++;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('tossHighScore', highScore.toString());
                hScoreDisplay.innerText = highScore;
            };
        };

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
            score--;
        };

        
        // Draw player
        ctx.save();
        ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
        ctx.rotate(player.rotation);
        ctx.drawImage(player.img, -player.width / 2, -player.height / 2, player.width, player.height);
        ctx.restore();
    };

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

    // Update score display
    scoreDisplay.textContent = `${score}`;

    // Request the next frame
    requestAnimationFrame(mainLoop);
};

// Run game
mainLoop();