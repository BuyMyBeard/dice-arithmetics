
class Dice {
  constructor(type) {
    if (type == 'P' || type == 'R' || type == 'B') {
      this.type = type;
    } else {
      throw 'type must be P, R, or B';
    }
  }

  recycle(top, north, west, x, y) {
    if (top == north || north == west || west == top) {
      throw "can't have 2 sides with the same number";
    }
    if (top < 1 || top > 6 || north < 1 || north > 6 || west < 1 || west > 6) {
      throw "can't have sides with number less than 1 or more than 6";
    }
    this.t = top;
    this.n = north;
    this.w = west;
    this.x = x;
    this.y = y;
    this.disabled = false;
  }

  roll(direction) {
    let newTop, newNorth, newWest;
    switch (direction) {
      case 'N':
        newTop = this.getSide('S');
        newNorth = this.getSide('T');
        newWest = this.getSide('W');
        break;

      case 'W':
        newTop = this.getSide('E');
        newNorth = this.getSide('N');
        newWest = this.getSide('T');
        break;

      case 'S':
        newTop = this.getSide('N');
        newNorth = this.getSide('B');
        newWest = this.getSide('W');
        break;

      case 'E':
        newTop = this.getSide('W');
        newNorth = this.getSide('N');
        newWest = this.getSide('B');
        break;

      default:
        throw `${direction} not a valid direction`;
    }
    this.t = newTop;
    this.n = newNorth;
    this.w = newWest;
  }


  move(direction) {
    let vect = directionDict[direction];
    if (map.getContent(vect.x + this.x, vect.y + this.y) == 7) {
      return false;
    }

    for (let dice of map.objects) {
      if (dice.type != 'P') {
        if (vect.x + this.x == dice.x && vect.y + this.y == dice.y) {
          return false;
        }
      }
    }
    this.x += vect.x;
    this.y += vect.y;
    this.roll(direction);
    return true;
  }
  getPossibleMovement() {
    let available = '';
    let vectors = [
      new Vector(this.x, this.y - 1, 'N'),
      new Vector(this.x, this.y + 1, 'S'),
      new Vector(this.x - 1, this.y, 'E'),
      new Vector(this.x + 1, this.y, 'W')
    ];
    for(let v of vectors) {
      if (map.getContent(v.x, v.y) == 0) {
        let collision = false;
        for (let d of map.objects) {
          if (d.collides(v)) {
            collision = true;
          }
        }
        if (!collision) {
          available += v.direction;
        }
      }
    }
    return available;
  }

  moveRandomly() {
    if (!this.disabled && (this.type == 'B' || turn % 2 == 0)) {
      let possibleMovement = this.getPossibleMovement()
      if (possibleMovement != ''){
        let selectedMovement = possibleMovement[randomIntegerGenerator(0, possibleMovement.length - 1)];
        let vect = directionDict[selectedMovement];
        this.x += vect.x;
        this.y += vect.y;
        this.roll(selectedMovement);
      }
    }
  }

  collides(vector) {
    if (vector.x == this.x && vector.y == this.y) {
      return true;
    }
    return false;
  }

  getSide(side) {
    switch (side) {
      case 'T':
        return this.t;
      
      case 'N':
        return this.n;

      case 'W':
        return this.w;

      case 'B':
        return 7 - this.t;

      case 'S':
        return 7 - this.n;

      case 'E':
        return 7 - this.w;

      default:
        throw `${side} not a valid side`;
    }
  }
  checkNeightbour() {
    let vectors = [
      new Vector(this.x, this.y - 1, 'N'),
      new Vector(this.x, this.y + 1, 'S'),
      new Vector(this.x - 1, this.y, 'E'),
      new Vector(this.x + 1, this.y, 'W')
    ];
    let neightbour = [];
    for(let v of vectors) {
      for (let d of map.objects) {
        if (d.collides(v)) {
          neightbour.push(d);
        }
      }
    }
    return neightbour;
  }
  disable() {
    this.disabled = true;
    this.x = -1;
    this.y = -1;
  }
}
class Map {
  constructor(tileSize) {
    this.tileSize = tileSize;
    this.load(1);
    this.textures = {
      wall: this.#image('wall.png'),
      floor: this.#image('floor.png'),
      dice: [
      this.#image('dice1.png'), 
      this.#image('dice2.png'), 
      this.#image('dice3.png'), 
      this.#image('dice4.png'), 
      this.#image('dice5.png'), 
      this.#image('dice6.png'),
      this.#image('rdice1.png'),
      this.#image('rdice2.png'),
      this.#image('rdice3.png'),
      this.#image('rdice4.png'),
      this.#image('rdice5.png'),
      this.#image('rdice6.png'),
      this.#image('bdice1.png'),
      this.#image('bdice2.png'),
      this.#image('bdice3.png'),
      this.#image('bdice4.png'),
      this.#image('bdice5.png'),
      this.#image('bdice6.png'),
      ]
    }
    this.overlay = 0;
  }

  load(level) {
    gameLost = false;
    gameWon = false;
    turn = 0;
    let layout;
    switch (level) {
      case 1:
        layout = [
        [7,7,7,7,7,7,7],
        [7,0,0,0,0,0,7],
        [7,0,0,0,0,0,7],
        [7,0,0,0,0,0,7],
        [7,0,0,0,0,0,7],
        [7,7,7,7,7,7,7]]
        playerDice.recycle(1, 2, 3, 1, 4);
        redDice1.recycle(4, 5, 6, 5, 1);
        this.objects = [playerDice, redDice1];
        break;

      case 2:
        layout = [
        [7,7,7,7,7,7,7,7,7],
        [7,0,0,7,7,7,0,7,7],
        [7,0,0,7,7,0,0,0,7],
        [7,0,0,7,0,0,0,0,7],
        [7,0,0,0,0,0,0,7,7],
        [7,7,7,7,7,7,7,7,7]]
        playerDice.recycle(2, 1, 4, 1, 1);
        redDice1.recycle(2, 1, 4, 7, 2);
        this.objects = [playerDice, redDice1];
        break;
      
      case 3:
        layout = [
        [7,7,7,7,7,7,7,7,7],
        [7,0,0,0,0,0,0,0,7],
        [7,0,0,0,0,0,0,0,7],
        [7,0,7,7,7,7,7,0,7],
        [7,0,0,0,0,0,0,0,7],
        [7,7,7,7,7,7,7,7,7]]
        playerDice.recycle(4, 2, 1, 1, 1);
        redDice1.recycle(5, 1, 4, 7, 2);
        redDice2.recycle(6, 2, 3, 5, 4);
        this.objects = [playerDice, redDice1, redDice2];
        break;

      case 4:
        layout = [
        [7,7,7,7,7,7,7,7,7],
        [7,0,0,0,0,0,0,0,7],
        [7,0,7,0,7,0,0,0,7],
        [7,0,0,0,7,0,7,0,7],
        [7,0,0,0,0,0,0,0,7],
        [7,7,7,7,7,7,7,7,7]]
        playerDice.recycle(1, 2, 3, 1, 1);
        blueDice1.recycle(5, 6, 4, 7, 2);

        this.objects = [playerDice, blueDice1];
        break;

      case 5:
        layout = [
        [7,7,7,7,7,7,7,7,7],
        [7,0,0,7,0,0,0,0,7],
        [7,0,0,7,0,0,0,0,7],
        [7,0,0,0,0,7,0,0,7],
        [7,0,0,0,0,7,0,0,7],
        [7,7,7,7,7,7,7,7,7]]
        playerDice.recycle(2, 1, 4, 4, 2);
        blueDice1.recycle(2, 1, 4, 1, 2);
        blueDice2.recycle(2, 1, 4, 7, 4)
        this.objects = [playerDice, blueDice1, blueDice2];
        break;

      case 6:
        layout = [
        [7,7,7,7,7,7,7,7,7,7,7],
        [7,0,0,0,0,0,0,0,0,0,7],
        [7,0,0,7,0,0,0,7,0,0,7],
        [7,0,7,7,0,0,0,7,0,7,7],
        [7,0,0,0,0,0,0,7,0,0,7],
        [7,0,0,7,0,0,0,0,0,0,7],
        [7,7,7,7,7,7,7,7,7,7,7]]
        playerDice.recycle(2, 1, 4, 5, 4);
        redDice1.recycle(2, 1, 4, 9, 1);
        redDice2.recycle(3, 1, 2, 1, 5);
        blueDice1.recycle(1,2,3,1,1);
        blueDice2.recycle(4,6,2,9,5)
        this.objects = [playerDice, redDice1, redDice2, blueDice1, blueDice2];
        break;
        
    }
    this.layout = layout;
    setTimeout(() => {
      map.draw(canvas,ctx);
    }, 50);
  }
  
  display() {
    for(let row of this.layout) {
      console.log(row);
    }
  }
  #image(fileName) {
    const img = new Image();
    img.src = `sprites/${fileName}`;
    return img;
  }

  draw(canvas, ctx) {
    this.#setCanvasSize(canvas);
    this.#clearCanvas(canvas, ctx);
    this.#drawMap(ctx);
    this.#drawObjects(ctx);
    this.#drawText(ctx);
  }

  #drawMap(ctx) {
    for (let row = 0; row < this.layout.length; row++) {
      for (let column = 0; column < this.layout[row].length; column++) {
        const tile = this.layout[row][column];
        let image = null;
        switch (tile) {
          case 0:
            image = this.textures.floor;
            break;
          case 7:
            image = this.textures.wall;
            break;

        }

        if (image != null)
          ctx.drawImage(
            image,
            column * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            this.tileSize
          );
      }
    }
  }
  #drawObjects(ctx) {
    this.objects.forEach((d) => {
      let offset = -1;
      if (d.type == 'R') {
        offset += 6;
      } else if (d.type == 'B') {
        offset += 12;
      }
      ctx.drawImage(
        this.textures.dice[d.getSide('T') + offset],
        d.x * this.tileSize,
        d.y * this.tileSize,
        this.tileSize,
        this.tileSize
      );
    });
  }
  #drawOverlay(ctx, x, y, face, type) {
    let offset = -1;
    if (type == 'R') {
      offset += 6;
    } else if (type == 'B') {
      offset += 12;
    }
    ctx.drawImage(
      this.textures.dice[face + offset],
      x * this.tileSize,
      y * this.tileSize,
      this.tileSize,
      this.tileSize
    );
  }
  #drawText(ctx) {
    ctx.font='400 20px Arial';
    ctx.fillStyle='white';
    ctx.fillText(objectiveList[level - 1] ,10, 30);
    ctx.font='200 15px Arial';
    ctx.fillText(overlayModeText, 10, canvas.height - 10)
  }

  #clearCanvas(canvas, ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  #setCanvasSize(canvas) {
    canvas.height = this.layout.length * this.tileSize;
    canvas.width = this.layout[0].length * this.tileSize;
  }
  getContent(x, y) {
    return this.layout[y][x];
  }

  changeOverlay() {
    map.draw(canvas, ctx);
    let overlayNumber = this.overlay % (this.objects.length + 1);
    if (overlayNumber != 0) {
      let dice = this.objects[overlayNumber - 1];
      let directions = 'NSEW';
      for (let d of directions) {
        let vect = directionDict[d];
        let face;
        if (predictionMode) {
          face = dice.getSide(reverseDirectionDict[d]);
        } else {
          face = dice.getSide(d);
        }
        this.#drawOverlay(ctx, vect.x + dice.x, vect.y + dice.y, face, dice.type);
      }
    }
  }
}
class Vector {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
  }
}



const directionDict = {
  'N': new Vector(0, -1),
  'S': new Vector(0, 1),
  'E': new Vector(-1, 0),
  'W': new Vector(1, 0)
};

const reverseDirectionDict = {
  'N': 'S',
  'S': 'N',
  'E': 'W',
  'W': 'E'
};

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.textAlign = 'center';
const tileSize = 64;
let turn;
let predictionMode = true;
let level = 1;
let gameLost = false;
let gameWon = false;
let overlayModeText = '(Spacebar) Overlay mode: Prediction (z / m to change)';

const playerDice = new Dice('P');
const redDice2 = new Dice('R');
const redDice1 = new Dice('R');
const blueDice1 = new Dice('B');
const blueDice2 = new Dice('B');
const map = new Map(tileSize);

function changeOverlayMode() {
  predictionMode = !predictionMode;
  if (predictionMode) {
    overlayModeText = '(Spacebar) Overlay mode: Prediction (z / m to change)';
  } else {
    overlayModeText = '(Spacebar) Overlay mode: Dissasembly (z / m to change)';
  }
  map.changeOverlay();
}

initializeKeyboardEvents();

const music = new Howl({
  src: 'music/CasinoNight.wav',
  loop: true,
  autoplay: true,
});

objectiveList = [
  'To defeat: White dice + red dice >= 10',
  'To defeat: White dice = red dice',
  'To defeat: Odd numbers',
  'To defeat: Sum = 2 Or sum = 12',
  'To defeat: Blue Dice - white dice >=3',
  'To defeat: White dice = 2x blue/red dice'
];