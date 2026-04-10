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
    img: new Image()
};
nerd.img.src = '../images/really-tuff-smiley-face.png';
const smileys = [nerd];

// Preload fragment images
let fragments = [];
let fragmentImages = [];
const gravity = 0.8;
for (let i = 0; i < 7; i++) {
    fragmentImages[i] = new Image();
    fragmentImages[i].src = `../images/fragments/frag${i + 1}.png`;
};

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
    
    // Update and draw smileys
    for (let player of smileys) {
        let dead = false;
        // Move Player based on speed
         player.x += player.speedX;
         player.y += player.speedY;
    
        // Bounce
        if (player.x <= 0 || player.x >= gameArea.width - player.width) {
            player.speedX *= -1;
            player.height += 5;
        };
        if (player.y <= 0 || player.y >= gameArea.height - player.height) {
            player.speedY *= -1;
            player.width += 5;
        };

        // Explode the player if too big
        if (player.width >= 500 || player.height >= 500) {
            for (let i = 0; i < 7; i++) {
                fragments.push({
                    x: player.x + (Math.random() * player.width) - (player.width / 2) + player.speedX,
                    y: player.y + (Math.random() * player.height) - (player.height / 2) + player.speedY,
                    speedX: player.speedX + (Math.random() * 30 - 15),
                    speedY: player.speedY + (Math.random() * 30 - 15),
                    width: player.width + 10,
                    height: player.height + 10,
                    img: fragmentImages[i],
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.1
                });
            };

            // Draw two new smileys and remove the old one
            smileys.splice(smileys.indexOf(player), 1);
            let newSmiley = {
                x: player.x,
                y: player.y,
                speedX: Math.random() * 20 - 10,
                speedY: Math.random() * 20 - 10,
                width: 75,
                height: 75,
                img: new Image()
            };
            newSmiley.img.src = '../images/really-tuff-smiley-face.png';
            smileys.push(newSmiley);
            newSmiley = {
                x: player.x,
                y: player.y,
                speedX: Math.random() * 20 - 10,
                speedY: Math.random() * 20 - 10,
                width: 75,
                height: 75,
                img: new Image()
            };
            newSmiley.img.src = '../images/really-tuff-smiley-face.png';
            smileys.push(newSmiley);
            dead = true;
        };

        // Bind player within area
        player.x = Math.max(0, Math.min(gameArea.width - player.width, player.x));
        player.y = Math.max(0, Math.min(gameArea.height - player.height, player.y));
    
        // Draw the player
        if (!dead) {
            ctx.drawImage(player.img, player.x, player.y, player.width, player.height);
        };
    };

    // Update and draw fragments
    for (let frag of fragments) {
        // Update player position
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
    
    // Request the next frame
    requestAnimationFrame(mainLoop);
};

// Run game
mainLoop();