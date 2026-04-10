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
let smileys = [];
for (let i = 0; i < 1; i++) {
    const nerd = {
        x: gameArea.width / 2 - 37.5,
        y: gameArea.height / 2 - 37.5,
        width: 75,
        height: 75,
        img: new Image()
    };
    nerd.img.src = '../images/really-tuff-smiley-face.png';
    smileys.push(nerd);
};

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
    for (let player of smileys) {
        if (player.x + player.width > gameArea.width) {
            player.x = gameArea.width - player.width;
        }
        if (player.y + player.height > gameArea.height) {
            player.y = gameArea.height - player.height;
        }
    }
});

// Soviet Saga
if (Math.random() < 0.01) {
    gameArea.style.backgroundImage = "url('../images/soviet-saga.png')";
};

// Detect clicks
let clicked = false;
gameArea.addEventListener('click', () => {
    clicked = true;
});
gameArea.addEventListener('touchstart', () => {
    clicked = true;
});
window.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        clicked = true;
    }
});

// Main game loop
function mainLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, gameArea.width, gameArea.height);
    
    // Update and draw smileys
    let newSmileys = [...smileys];
    for (let player of smileys) {

        // GURT
        if (smileys.length >= 4096 && smileys.length < 8192) {
            player.img.src = '../images/other-smileys/gurt.png';
        } else {
            player.img.src = '../images/really-tuff-smiley-face.png';
        };
        // Explode player if clicked
        if (clicked) {
            for (let i = 0; i < 7; i++) {
                fragments.push({
                    x: player.x + (Math.random() * player.width) - (player.width / 2),
                    y: player.y + (Math.random() * player.height) - (player.height / 2),
                    speedX: (Math.random() - 0.5) * 50,
                    speedY: (Math.random() - 0.8) * 50,
                    width: player.width + 10,
                    height: player.height + 10,
                    img: fragmentImages[i],
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.1
                });
            };

            // Add a smiley
            let newSmiley = {
                x: player.x,
                y: player.y,
                width: 75,
                height: 75,
                img: new Image()
            };
            newSmiley.img.src = '../images/really-tuff-smiley-face.png';
            newSmileys.push(newSmiley);
        };
    
        // Draw the player
        ctx.drawImage(player.img, player.x, player.y, player.width, player.height);
    };

    // Update smileys array
    smileys = newSmileys;

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
    clicked = false;

    // Request the next frame
    requestAnimationFrame(mainLoop);
};

// Run game
mainLoop();