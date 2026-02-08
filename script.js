const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");

const box = 20;

let snake, dir, food, score, speed;
let gameRunning = false;
let skinColor = "#22c55e";

let bestScore = localStorage.getItem("bestScore") || 0;
document.getElementById("best").innerText = "Best Score: " + bestScore;

// ---------------- START GAME ----------------
startBtn.onclick = () => {
  resetGame();
  gameRunning = true;
  startBtn.style.display = "none";
};

function resetGame() {
  snake = [{ x: 200, y: 200 }];
  dir = "RIGHT";
  food = randomFood();
  score = 0;
  speed = 120;
  document.getElementById("score").innerText = "Score: 0";
}

// ---------------- CONTROLS ----------------
document.addEventListener("keydown", e => {
  if (!gameRunning) return;
  if (e.key === "ArrowUp" && dir !== "DOWN") dir = "UP";
  if (e.key === "ArrowDown" && dir !== "UP") dir = "DOWN";
  if (e.key === "ArrowLeft" && dir !== "RIGHT") dir = "LEFT";
  if (e.key === "ArrowRight" && dir !== "LEFT") dir = "RIGHT";
});

function setDir(d) {
  if (!gameRunning) return;
  if (d === "UP" && dir !== "DOWN") dir = d;
  if (d === "DOWN" && dir !== "UP") dir = d;
  if (d === "LEFT" && dir !== "RIGHT") dir = d;
  if (d === "RIGHT" && dir !== "LEFT") dir = d;
}

function changeSkin(color) {
  skinColor = color;
}

function turbo() {
  if (!gameRunning || score <= 0) return;
  speed = 60;
  score--;
  document.getElementById("score").innerText = "Score: " + score;
  setTimeout(() => speed = 120, 800);
}

// ---------------- FOOD ----------------
function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

// ---------------- GAME LOOP ----------------
function draw() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = skinColor;
  snake.forEach(s => ctx.fillRect(s.x, s.y, box, box));

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

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
    gameRunning = false;
    startBtn.style.display = "inline-block";

    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem("bestScore", bestScore);
    }
    document.getElementById("best").innerText = "Best Score: " + bestScore;
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    food = randomFood();
  } else {
    snake.pop();
  }
}

function gameLoop() {
  draw();
  setTimeout(gameLoop, speed);
}
gameLoop();
