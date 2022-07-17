function lose() {
  gameLost = true;
  playerDice.disable();
  setTimeout(() => {
    map.draw(canvas, ctx);
  }, 500);
  setTimeout(displayLoseScreen, 1000);
}

function displayLoseScreen() {
  ctx.font='800 30px Arial';
  ctx.fillStyle='red';
  ctx.fillText('You lost!' ,10, 100);
  ctx.fillText('Press any key to retry', 10, 130);
  document.addEventListener('keydown', () => {
    map.load(level);
  }, {once: true});
}

function win() {
  gameWon = true;
  setTimeout(() => {
    map.draw(canvas, ctx);
  }, 500);
  setTimeout(displayWinScreen, 1000);
}

function displayWinScreen() {
  if (level == 6) {
    ctx.font='800 30px Arial';
    ctx.fillStyle='red';
    ctx.fillText('You completed all the levels!' ,10, 100);
    ctx.fillText('Thanks for playing!', 10, 130);
  } else {
    ctx.font='800 30px Arial';
    ctx.fillStyle='red';
    ctx.fillText('You completed the level!' ,10, 100);
    ctx.fillText('Press any key to continue', 10, 130);
    ctx.fillText('to the next level', 10, 160);
    
    document.addEventListener('keydown', () => {
      level++;
      map.load(level);
    }, {once: true});
  }
}

function gameLoop() {
  turn++;
  for (let i = 1; i < map.objects.length; i++) {
    map.objects[i].moveRandomly();
  }
  map.draw(canvas, ctx);
  let neightbours = playerDice.checkNeightbour();
  if (neightbours[0] != null) {
    for (let n of neightbours) {
      switch (level) {
        case 1:
          if (playerDice.getSide('T') + n.getSide('T') >= 10) {
            n.disable();
          } else {
            lose();
            return 0;
          }
          break;

        case 2:
          if (playerDice.getSide('T') == n.getSide('T')) {
            n.disable();
          } else {
            lose();
            return 0;
          }
          break;

        case 3:
          if (playerDice.getSide('T') % 2 == 1 && n.getSide('T') % 2 == 1) {
            n.disable();
          } else {
            lose();
            return 0;
          }
          break;

        case 4:
          if (playerDice.getSide('T') + n.getSide('T') % 10 == 2) {
            n.disable();
          } else {
            lose();
            return 0;
          }
          break;

        case 5:
          if (n.getSide('T') - playerDice.getSide('T') >= 3) {
            n.disable();
          } else {
            lose();
            return 0;
          }
          break;

        case 6:
          if (playerDice.getSide('T') == 2 * n.getSide('T')) {
            n.disable();
          } else {
            lose();
            return 0;
          }
          break; 
      }
      setTimeout(() => {
        map.draw(canvas, ctx);
      }, 500);
    }
    let disabledCount = 0;
    for (let i = 1; i < map.objects.length; i++) {
      if (map.objects[i].disabled) {
        disabledCount++;
      }
    }
    if (disabledCount == map.objects.length - 1) {
      win();
    }
  }
}

function randomIntegerGenerator(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

function initializeKeyboardEvents() {
  document.addEventListener('keydown', (e) => {
    if (!gameLost && !gameWon) {
      let direction;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          direction = 'N';
          break;
  
        case 'ArrowDown':
        case 's':
          direction = 'S';
          break;
          
        case 'ArrowLeft':
        case 'a':
          direction = 'E';
          break;
  
        case 'ArrowRight':
        case 'd':
          direction = 'W';
          break;
  
        case ' ':
          map.overlay++;
          map.changeOverlay();
          break;
  
        case 'z':
        case 'm':
          changeOverlayMode();
          break;
      }
      if (direction != null) {
        if (playerDice.move(direction)) {
          map.overlay = 0;
          gameLoop();
        }
      }
    }
  });
}