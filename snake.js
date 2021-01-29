let direction = "right";
// Save the positions of the squares
let snakeBody = [];
let snakeLength, suggestedPoint, interval;
let allowPressKeys = true;
let pauseClicked = false;
let restartClicked = false;
let resumeClicked = false;

// Check if browser support the <canvas> tag
const checkSupported = () => {
  canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
    // Set grid size
    this.gridSize = 10;
    start();
  } else {
    alert("This browser does not support canvas tag.");
  }
};

// Snake movements controlled by keyboard
document.onkeydown = (e) => {
  let keyCode;

  if (!allowPressKeys) return null;

  if (e == null) {
    keyCode = window.event.keyCode;
  } else {
    keyCode = e.keyCode;
  }

  // Generate new xy coordinates with every move
  switch (keyCode) {
    // left
    case 37:
      if (direction != "right") moveLeft();
      // drawSnake();
      break;

    // up
    case 38:
      if (direction != "down") moveUp();
      // drawSnake();
      break;

    // right
    case 39:
      if (direction != "left") moveRight();
      // drawSnake();
      break;

    // down
    case 40:
      if (direction != "up") moveDown();
      // drawSnake();
      break;

    default:
      break;
  }
};

/* Game Status */
const start = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Position
  this.currentPosition = { x: 50, y: 50 };

  // let x = 50;
  // let y = 50;
  // let width = 10;
  // let height = 10;
  // // Draw square
  // ctx.fillRect(x, y, width, height);

  snakeBody = [];
  snakeLength = 3;
  updateScore();
  makeFoodItem();
  drawSnake();
  direction = "right";
  play();
};

const play = () => {
  interval = setInterval(moveSnake, 1000);
  allowPressKeys = true;

  if (resumeClicked) {
    document.getElementById("play_menu").style.display = "none";
    document.getElementById("pause_menu").style.display = "block";
  }
};

const pause = () => {
  clearInterval(interval);
  allowPressKeys = false;
  pauseClicked = true;

  document.getElementById("pause_menu").style.display = "none";
  document.getElementById("play_menu").style.display = "block";
};

const gameOver = () => {
  let score = (snakeLength - 3) * 10;
  clearInterval(interval);
  snakeBody = [];
  snakeLength = 3;
  allowPressKeys = false;
  alert(`Game Over. Your score was ${score}.`);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  document.getElementById("play_menu").style.display = "none";
  document.getElementById("restart_menu").style.display = "block";
};

const restart = () => {
  if (restartClicked) {
    document.getElementById("play_menu").style.display = "none";
    document.getElementById("pause_menu").style.display = "block";
  }

  pause();
  start();
};

/* Movement Control */
const leftPosition = () => {
  return currentPosition["x"] - gridSize;
};

const rightPosition = () => {
  return currentPosition["x"] + gridSize;
};

const upPosition = () => {
  return currentPosition["y"] - gridSize;
};

const downPosition = () => {
  return currentPosition["y"] + gridSize;
};

const moveUp = () => {
  if (upPosition() >= 0) {
    executeMove("up", "y", upPosition());
  } else {
    whichWayToGo("x");
  }
};
const moveDown = () => {
  if (downPosition() < canvas.height) {
    executeMove("down", "y", downPosition());
  } else {
    whichWayToGo("x");
  }
};
const moveLeft = () => {
  if (leftPosition() >= 0) {
    executeMove("left", "x", leftPosition());
  } else {
    whichWayToGo("y");
  }
};
const moveRight = () => {
  if (rightPosition() < canvas.width) {
    executeMove("right", "x", rightPosition());
  } else {
    whichWayToGo("y");
  }
};
const executeMove = (dirVal, axisType, axisVal) => {
  direction = dirVal;
  currentPosition[axisType] = axisVal;
  drawSnake();
};

/* Snake related control */
const drawSnake = () => {
  if (snakeBody.some(hasEatenItself)) {
    gameOver();
    return false;
  }

  // pauseClicked = !pauseClicked;
  // restartClicked = !restartClicked;
  // resumeClicked = !resumeClicked;

  snakeBody.push([currentPosition["x"], currentPosition["y"]]);
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(currentPosition["x"], currentPosition["y"], gridSize, gridSize);

  // "Drag" the body of the snake
  if (snakeBody.length > snakeLength) {
    let itemToRemove = snakeBody.shift();
    ctx.clearRect(itemToRemove[0], itemToRemove[1], gridSize, gridSize);
  }

  if (
    currentPosition["x"] == suggestedPoint[0] &&
    currentPosition["y"] == suggestedPoint[1]
  ) {
    makeFoodItem();
    snakeLength += 1;
    updateScore();
  }
};

const hasEatenItself = (element, index, array) => {
  return (
    element[0] == currentPosition["x"] && element[1] == currentPosition["y"]
  );
};

const moveSnake = () => {
  switch (direction) {
    case "up":
      moveUp();
      break;

    case "down":
      moveDown();
      break;

    case "left":
      moveLeft();
      break;

    case "right":
      moveRight();
      break;
  }
};

// Cannot go further once hits the edge
const whichWayToGo = (axisType) => {
  if (axisType == "x") {
    a = currentPosition["x"] > canvas.width / 2 ? moveLeft() : moveRight();
  } else {
    // if hits the right border => go up or down =>
    // if position is above middle of canvas => moveDown : below middle => moveUp
    a = currentPosition["y"] > canvas.width / 2 ? moveUp() : moveDown();
  }
};

const makeFoodItem = () => {
  suggestedPoint = [
    Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
  ];

  //   Check if the snake has "eaten" the square => make another
  if (snakeBody.some(hasPoint)) {
    makeFoodItem();
  } else {
    ctx.fillStyle = "greenyellow";
    ctx.fillRect(suggestedPoint[0], suggestedPoint[1], gridSize, gridSize);
  }
};

const hasPoint = (element, index, array) => {
  return element[0] == suggestedPoint[0] && element[1] == suggestedPoint[1];
};

/* Score */
const updateScore = () => {
  let score = (snakeLength - 3) * 10;
  document.getElementById("number").innerText = score;
};
