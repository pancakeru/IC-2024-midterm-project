let sandTile;
let tileSize = 32;  // size of each tile
let cols, rows;
let spriteSheet;
let frameWidth = 200;  // Width of each frame in the sprite sheet
let frameHeight = 200; // Height of each frame in the sprite sheet
let currentFrame = 0;
let totalFrames = 6;  // Adjust this to the number of frames in your sprite sheet
let animationSpeed = 10;  // Adjust to control animation speed

function preload() {
  // Load your sand tile and sprite sheet images
  sandTile = loadImage('./assets/Sand _2.jpg');

  const idleFrames = [];
  const moveFrames = [];
  const shootFrames = [];
  const reloadFrames = [];
  const attackFrames=[]

  for (let i = 0; i <= 19; i++) {
    idleFrames.push(loadImage(`./assets/Top_Down_Survivor/handgun/idle/survivor-idle_handgun_${i}.png`));
  }
  for (let i = 0; i <= 14; i++) {
    attackFrames.push(loadImage(`./assets/Top_Down_Survivor/handgun/meleeattack/survivor-meleeattack_handgun_${i}.png`));
  }

  for (let i = 0; i <= 19; i++) {
    moveFrames.push(loadImage(`./assets/Top_Down_Survivor/handgun/move/survivor-move_handgun_${i}.png`));
  }
  for (let i = 0; i <= 2; i++) {
    shootFrames.push(loadImage(`./assets/Top_Down_Survivor/handgun/shoot/survivor-shoot_handgun_${i}.png`));
  }
  for (let i = 0; i <= 14; i++) {
    shootFrames.push(loadImage(`./assets/Top_Down_Survivor/handgun/reload/survivor-reload_handgun_${i}.png`));
  }
  soldier = new Character(idleFrames, moveFrames, shootFrames, reloadFrames);
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Set canvas size
  cols = width / tileSize;
  rows = height / tileSize;
  soldier.position.set(width / 2, height - 300);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight); // Resize canvas when window is resized
    cols = width / tileSize;
    rows = height / tileSize;
  }

function draw() {
//   background(0);

  // Draw the sand tile background
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      image(sandTile, x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  soldier.update();
  soldier.display();
}

class Character {
    constructor(idleFrames, moveFrames, shootFrames, reloadFrames) {
      this.animations = {
        idle: idleFrames,
        move: moveFrames,
        shoot: shootFrames,
        reload: reloadFrames,
      };
  
      this.currentAction = 'idle';
      this.frameIndex = 0;
      this.animationSpeed = 5;
      this.position = createVector(width / 2, height - 50); // Start at bottom center
      this.speed = 3;  // Movement speed
    }
  
    setAction(action) {
      if (this.currentAction !== action) {
        this.currentAction = action;
        this.frameIndex = 0;
      }
    }
  
    display() {
        let frames = this.animations[this.currentAction];
        if (frames && frames.length > 0) {
          push(); // Start a new drawing state
          translate(this.position.x, this.position.y); // Move origin to character's position
          rotate(-PI / 2); // Rotate 90 degrees counterclockwise (facing forward)
      
          // Draw the current frame of the animation centered at the new origin
          imageMode(CENTER);
          image(frames[this.frameIndex], 0, 0);
      
          pop(); // Restore the original drawing state
        }
      }
      
  
    update() {
      // Handle movement in all directions
      if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // A key for left
        this.setAction('move');
        this.position.x -= this.speed;
      }
      if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // D key for right
        this.setAction('move');
        this.position.x += this.speed;
      }
      if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // W key for up
        this.setAction('move');
        this.position.y -= this.speed;
      }
      if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // S key for down
        this.setAction('move');
        this.position.y += this.speed;
      }
  
      // Keep character in bounds
      this.position.x = constrain(this.position.x, 0, width - tileSize);
      this.position.y = constrain(this.position.y, 0, height - tileSize);
  
      // Update frame index for animation
      if (frameCount % this.animationSpeed === 0) {
        let frames = this.animations[this.currentAction];
        if (frames) {
          this.frameIndex = (this.frameIndex + 1) % frames.length;
        }
      }
    }
  }