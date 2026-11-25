
function showTab(tabName, btn) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + tabName).classList.add('active');
  btn.classList.add('active');
}
const gCanvas = document.getElementById('gameCanvas');
const gCtx = gCanvas.getContext('2d');
let player = { x: 385, y: gCanvas.height -45, size: 30, speed: 7 };
let enemies = [];
let gameScore = 0;
let gameOver = false;
let keys = {};

window.addEventListener('keydown', e => {
  keys[e.key] = true;
  // stop arrow keys from scrolling the page while playing
  if (e.key.startsWith('Arrow')) e.preventDefault();
});
window.addEventListener('keyup', e => keys[e.key] = false);

function resetGame() {
  player.x = gCanvas.width / 2 - player.size / 2;
  enemies = [];
  gameScore = 0;
  gameOver = false;
}

function updateGame() {
  if (!gameOver) {
    if ((keys['ArrowLeft'] || keys['a']) && player.x > 0) player.x -= player.speed;
    if ((keys['ArrowRight'] || keys['d']) && player.x < gCanvas.width - player.size) player.x += player.speed;

    // Spawn obstacles
    if (Math.random() < 0.04) {
      enemies.push({ x: Math.random() * (gCanvas.width - 30), y: -30, size: 30, speed: 4 + Math.random() * 3 });
    }

    // Move obstacles
    for (let i = enemies.length - 1; i >= 0; i--) {
      enemies[i].y += enemies[i].speed;

      // Collision detection
      if (
        player.x < enemies[i].x + enemies[i].size &&
        player.x + player.size > enemies[i].x &&
        player.y < enemies[i].y + enemies[i].size &&
        player.y + player.size > enemies[i].y
      ) {
        gameOver = true;
      }

      if (enemies[i].y > gCanvas.height) {
        enemies.splice(i, 1);
        gameScore++;
      }
    }
  }

  // Render
  gCtx.fillStyle = '#050811';
  gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height);

  gCtx.fillStyle = '#38bdf8';
  gCtx.fillRect(player.x, player.y, player.size, player.size);

  gCtx.fillStyle = '#ef4444';
  enemies.forEach(e => gCtx.fillRect(e.x, e.y, e.size, e.size));

  gCtx.fillStyle = '#94a3b8';
  gCtx.font = '14px monospace';
  gCtx.fillText(`Score: ${gameScore}`, 10, 20);

  if (gameOver) {
    gCtx.fillStyle = '#f8fafc';
    gCtx.font = 'bold 28px sans-serif';
    gCtx.textAlign = 'center';
    gCtx.fillText('GAME OVER - Press Restart', gCanvas.width / 2, gCanvas.height / 2);
    gCtx.textAlign = 'left';
  }

  requestAnimationFrame(updateGame);
}
requestAnimationFrame(updateGame);


const reactBox = document.getElementById('reactBox');
const reactBest = document.getElementById('reactBest');
let reactState = 'idle';   // idle, waiting, go
let reactTimer, reactStart, bestTime = null;

function reactClick() {
  if (reactState === 'idle') {
    reactState = 'waiting';
    reactBox.className = 'react-box ready';
    reactBox.textContent = 'Wait for green...';
    reactTimer = setTimeout(() => {
      reactState = 'go';
      reactBox.className = 'react-box go';
      reactBox.textContent = 'CLICK!';
      reactStart = Date.now();
    }, 1000 + Math.random() * 3000);
  } else if (reactState === 'waiting') {
    clearTimeout(reactTimer);
    reactState = 'idle';
    reactBox.className = 'react-box wait';
    reactBox.textContent = 'Too early! Click to try again';
  } else if (reactState === 'go') {
    const ms = Date.now() - reactStart;
    reactState = 'idle';
    reactBox.className = 'react-box wait';
    reactBox.textContent = `${ms} ms. Click to play again`;
    if (bestTime === null || ms < bestTime) {
      bestTime = ms;
      reactBest.textContent = `Best: ${bestTime} ms`;
    }
  }
}
const demoModal = document.getElementById('demoModal');
const demoTitle = document.getElementById('demoTitle');
const demoContainer = document.getElementById('demoContainer');
const closeDemoBtn = document.getElementById('closeDemoBtn');

function openDemo(src, title) {
  demoTitle.textContent = title;
  if (src.endsWith('.mp4')) {
    demoContainer.innerHTML = `<video class="demo-media" src="${src}" controls autoplay muted loop playsinline></video>`;
  } else {
    demoContainer.innerHTML = `<img class="demo-media" src="${src}" alt="${title}">`;
  }
  demoModal.classList.add('is-open');
}

function closeDemo() {
  demoModal.classList.remove('is-open');
  demoContainer.innerHTML = ''; // stops video playback on close
}

if (demoModal) {
  closeDemoBtn.addEventListener('click', closeDemo);
  demoModal.addEventListener('click', (e) => {
    if (e.target === demoModal) closeDemo();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && demoModal.classList.contains('is-open')) {
      closeDemo();
    }
  });
}