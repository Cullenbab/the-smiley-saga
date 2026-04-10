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
for (let i = 0; i < 3; i++) {
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
});

// Soviet Saga
if (Math.random() < 0.01) {
    gameArea.style.backgroundImage = "url('../images/soviet-saga.png')";
};

// Detect clicks
let clicked = false;
let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousedown', (e) => {
    clicked = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Main game loop
function mainLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, gameArea.width, gameArea.height);
    
    // Update and draw smileys
    let newSmileys = [...smileys];
    for (let player of smileys) {
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

        // Keep smiley within bounds
        player.x = Math.max(0, Math.min(player.x, gameArea.width - player.width));
        player.y = Math.max(0, Math.min(player.y, gameArea.height - player.height));

        // Explode smiley if clicked
        let dead = false;
        if (clicked &&
            mouseX >= player.x && mouseX <= player.x + player.width &&
            mouseY >= player.y && mouseY <= player.y + player.height
        ) {
            clicked = false;
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

            // Remove the old smiley and add a new one
            newSmileys.splice(smileys.indexOf(player), 1);
            let newSmiley = {
                x: Math.floor(Math.random() * (gameArea.width - 100)),
                y: Math.floor(Math.random() * (gameArea.height - 100)),
                speedX: Math.random() * 20 - 10,
                speedY: Math.random() * 20 - 10,
                width: 75,
                height: 75,
                img: new Image()
            };
            newSmiley.img.src = '../images/really-tuff-smiley-face.png';
            newSmileys.push(newSmiley);
            dead = true;
        };
    
        // Draw the smiley
        if (!dead) {
            ctx.drawImage(player.img, player.x, player.y, player.width, player.height);
        };
    };

    // Update smileys array
    smileys = newSmileys;

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

    clicked = false;

    // Request the next frame
    requestAnimationFrame(mainLoop);
};

// Run game
mainLoop();