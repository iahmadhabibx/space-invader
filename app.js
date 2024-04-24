const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");
const gridSize = 9;
const width = 150;
const alinesRemoved = [];
let currentShooterIndex = 200;
let interval = null;
let isGoingRidht = true;
let direction = 1;
let score = 0;

for (let i = 0; i < width * width; i++) {
  const square = document.createElement("div");
  square.classList.add("square");
  grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".square"));

const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39,
];

const draw = () => {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!alinesRemoved.includes(i))
      squares[alienInvaders[i]].classList.add("invader");
  }
};

draw();
squares[currentShooterIndex].classList.add("shooter");

const remove = () => {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove("invader");
  }
};

const moveShooter = (e) => {
  squares[currentShooterIndex].classList.remove("shooter");
  switch (e.key) {
    case "ArrowLeft":
      if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
      break;
    case "ArrowRight":
      if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
      break;
  }
  squares[currentShooterIndex].classList.add("shooter");
};

document.addEventListener("keydown", moveShooter);

const moveInvaders = () => {
  const leftEdge = alienInvaders[0] & (width === 0);
  const rightEdge =
    alienInvaders[alienInvaders.length - 1] & (width === width - 1);

  remove();

  if (rightEdge && isGoingRidht) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
      direction = -1;
      isGoingRidht = false;
    }
  }
  if (leftEdge && !isGoingRidht) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] -= width - 1;
      direction = 1;
      isGoingRidht = true;
    }
  }
  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }
  draw();

  if (squares[currentShooterIndex].classList.contains("invader")) {
    resultDisplay.innerHTML = "Game Over";
    clearInterval(interval);
  }

  if (alinesRemoved.length === alienInvaders.length) {
    resultDisplay.innerHTML = "You Won";
    clearInterval(interval);
  }
};

interval = setInterval(moveInvaders, 600);

const shoot = (e) => {
  let laserId;
  let currentLaserIndex = currentShooterIndex;

  const moveLaser = () => {
    if (!squares[currentLaserIndex]) return;
    squares[currentLaserIndex].classList.remove("laser");
    currentLaserIndex -= width;
    squares[currentLaserIndex].classList.add("laser");

    if (squares[currentLaserIndex].classList.contains("invader")) {
      squares[currentLaserIndex].classList.remove("laser");
      squares[currentLaserIndex].classList.remove("invader");
      squares[currentLaserIndex].classList.add("boom");

      let timer = setTimeout(() => {
        clearTimeout(timer);
        squares[currentLaserIndex].classList.remove("boom");
      }, 300);
      clearInterval(laserId);
      const alienRemove = alienInvaders.indexOf(currentLaserIndex);
      alinesRemoved.push(alienRemove);
      score++;
      resultDisplay.innerHTML = score;
    }
  };

  if (e.key === "ArrowUp") laserId = setInterval(moveLaser, 100);
};

document.addEventListener("keydown", shoot);
