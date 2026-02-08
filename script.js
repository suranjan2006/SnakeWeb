const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");

const box = 20;
let snake, dir, food, score, speed, running, loop;
let mouthOpen = false;

let bestScore = localStorage.getItem("bestScore") || 0;
document.getElementById("best").innerText = "Best Score: " + bestScore;

// ---------------- START GAME ----------------
function startGame() {
  clearInterval(loop);
  snake = [{ x: 200, y: 200 }];
  dir = "RIGHT";
  food = randomFood();
  score = 0;
  speed = 120;
  running = true;

  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("gameOver").style.display = "none";
  startBtn.style.display = "none";

  loop = setInterval(draw, speed);
}

startBtn.onclick = startGame;

// ---------------- CONTROLS ----------------
document.addEventListener("keydown", e => {
  if (!running) return;
  if (e.key === "ArrowUp" && dir !== "DOWN") dir = "UP";
  if (e.key === "ArrowDown" && dir !== "UP") dir = "DOWN";
  if (e.key === "ArrowLeft" && dir !== "RIGHT") dir = "LEFT";
  if (e.key === "ArrowRight" && dir !== "LEFT") dir = "RIGHT";
});

function setDir(d) {
  if (!running) return;
  if (d === "UP" && dir !== "DOWN") dir = d;
  if (d === "DOWN" && dir !== "UP") dir = d;
  if (d === "LEFT" && dir !== "RIGHT") dir = d;
  if (d === "RIGHT" && dir !== "LEFT") dir = d;
}

// ---------------- FOOD ----------------
function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

// ---------------- TURBO ----------------
function turbo() {
  if (!running || score <= 0) return;
  clearInterval(loop);
  speed = 60;
  score--;
  document.getElementById("score").innerText = "Score: " + score;
  loop = setInterval(draw, speed);

  setTimeout(() => {
    clearInterval(loop);
    speed = 120;
    loop = setInterval(draw, speed);
  }, 800);
}

// ---------------- DRAW HEAD ----------------
function drawHead(x, y) {
  ctx.fillStyle = "#22c55e";
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#22c55e";
  ctx.fillRect(x, y, box, box);

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(x + 6, y + 6, 3, 0, Math.PI * 2);
  ctx.arc(x + 14, y + 6, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(x + 6, y + 6, 1.5, 0, Math.PI * 2);
  ctx.arc(x + 14, y + 6, 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (mouthOpen) ctx.arc(x + 10, y + 14, 6, 0, Math.PI);
  else {
    ctx.moveTo(x + 5, y + 14);
    ctx.lineTo(x + 15, y + 14);
  }
  ctx.stroke();
}

// ---------------- DRAW ----------------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.forEach((s, i) => {
    if (i === 0) drawHead(s.x, s.y);
    else {
      ctx.fillStyle = "#4ade80";
      ctx.fillRect(s.x, s.y, box, box);
    }
  });

  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(food.x + 10, food.y + 10, 8, 0, Math.PI * 2);
  ctx.fill();

  let head = { ...snake[0] };
  if (dir === "UP") head.y -= box;
  if (dir === "DOWN") head.y += box;
  if (dir === "LEFT") head.x -= box;
  if (dir === "RIGHT") head.x += box;

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    mouthOpen = true;
    setTimeout(() => mouthOpen = false, 200);
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    food = randomFood();
  } else snake.pop();
}

// ---------------- END GAME ----------------
function endGame() {
  clearInterval(loop);
  running = false;

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }

  document.getElementById("best").innerText = "Best Score: " + bestScore;
  document.getElementById("finalScore").innerText = "Score: " + score;
  document.getElementById("gameOver").style.display = "flex";
  startBtn.style.display = "inline-block";
}

