const { GRID_SIZE } = require("./constants");

// function for creation of gameState and generation of food in the grid/state
function initGame() {
  const state = createGameState();
  randomFood(state);
  return state;
}

function createGameState() {
  return {
    players: [
      {
        pos: {
          x: 3,
          y: 10,
        },
        vel: {
          x: 1,
          y: 0,
        },
        snake: [
          { x: 1, y: 10 },
          { x: 2, y: 10 },
          { x: 3, y: 10 },
        ],
      },
      {
        pos: {
          x: 18,
          y: 10,
        },
        vel: {
          x: 0,
          y: 0,
        },
        snake: [
          { x: 20, y: 10 },
          { x: 19, y: 10 },
          { x: 18, y: 10 },
        ],
      },
    ],
    food: {},
    gridsize: GRID_SIZE,
  };
}

function gameLoop(state) {
  if (!state) {
    return;
  }

  const playerOne = state.players[0];
  const playerTwo = state.players[1];

  //   update players position based on velocity
  playerOne.pos.x += playerOne.vel.x;
  playerOne.pos.y += playerOne.vel.y;

  playerTwo.pos.x += playerTwo.vel.x;
  playerTwo.pos.y += playerTwo.vel.y;

  // check if player's position is in the grid, if not in grid ie he/she has touched the wall, and he lost so make other player the winner by returning the number
  if (
    playerOne.pos.x < 0 ||
    playerOne.pos.x > GRID_SIZE ||
    playerOne.pos.y < 0 ||
    playerOne.pos.y > GRID_SIZE
  ) {
    return 2;
  }

  if (
    playerTwo.pos.x < 0 ||
    playerTwo.pos.x > GRID_SIZE ||
    playerTwo.pos.y < 0 ||
    playerTwo.pos.y > GRID_SIZE
  ) {
    return 1;
  }

  //   if both players are in grid, check if player has just eaten food, ie check if player is on the same position as the food
  if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
    // make player(snake) bigger by adding one element
    playerOne.snake.push({ ...playerOne.pos });

    // increment the position, ahead of the food
    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;

    // place food on random position
    randomFood(state);
  }

  if (state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y) {
    playerTwo.snake.push({ ...playerTwo.pos });
    playerTwo.pos.x += playerTwo.vel.x;
    playerTwo.pos.y += playerTwo.vel.y;
    randomFood(state);
  }

  if (playerOne.vel.x || playerOne.vel.y) {
    // check if the player(snake) has not bumped/touched himself by looping into each cell/element of the snake and checking current position of player
    for (let cell of playerOne.snake) {
      // if bumped/touched himself
      if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
        // make other player winner
        return 2;
      }
    }

    // move the player forward, we add an element into the snake and pop the last element from the snake
    playerOne.snake.push({ ...playerOne.pos });
    playerOne.snake.shift();
  }

  if (playerTwo.vel.x || playerTwo.vel.y) {
    for (let cell of playerTwo.snake) {
      if (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) {
        return 1;
      }
    }

    playerTwo.snake.push({ ...playerTwo.pos });
    playerTwo.snake.shift();
  }

  // both players are still in game(didn't bump or go out of the grid), return false as winnner
  return false;
}

function randomFood(state) {
  // get random number between 0 and grid_size
  food = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };

  //check if the random food is not in the place of snake/player
  for (let cell of state.players[0].snake) {
    // check food is not on the player/snake's any cell
    if (cell.x === food.x && cell.y === food.y) {
      return randomFood(state);
    }
  }

  for (let cell of state.players[1].snake) {
    if (cell.x === food.x && cell.y === food.y) {
      return randomFood(state);
    }
  }

  state.food = food;
}

function getUpdatedVelocity(keyCode) {
  switch (keyCode) {
    case 37: {
      // left-arrow
      return { x: -1, y: 0 };
    }
    case 38: {
      // down-arrow
      return { x: 0, y: -1 };
    }
    case 39: {
      // right-arrow
      return { x: 1, y: 0 };
    }
    case 40: {
      // up-arrow
      return { x: 0, y: 1 };
    }
  }
}

module.exports = {
  initGame,
  gameLoop,
  getUpdatedVelocity,
};
