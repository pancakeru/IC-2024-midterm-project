let sandTile, soldier;
let tileSize = 32; // size of each tile
let cols, rows;
let spriteSheet;
let frameWidth = 200; // Width of each frame in the sprite sheet
let frameHeight = 200; // Height of each frame in the sprite sheet
let currentFrame = 0;
let totalFrames = 6; // Adjust this to the number of frames in your sprite sheet
let animationSpeed = 10; // Adjust to control animation speed
let idleFrames = [];
let moveFrames = [];
let shootFrames = [];
let reloadFrames = [];
let attackFrames = [];
let enemies = [];
let bulletImg;
function preload() {
  // Load your sand tile and sprite sheet images
  sandTile = loadImage("./assets/Sand _2.jpg");
  skeletonSpriteIdle = loadImage("./assets/enemies/Skeleton/Skeleton_Idle.png");
  goblinImg = loadImage("./assets/enemies/goblinsword.png");
  golemImg = loadImage("./assets/enemies/golem-walk.png");
  bulletImg = loadImage("./assets/bullet.png");
  //   const idleFrames = [];
  //   const moveFrames = [];
  //   const shootFrames = [];
  //   const reloadFrames = [];
  //   const attackFrames=[]

  for (let i = 0; i <= 19; i++) {
    idleFrames.push(
      loadImage(
        `./assets/Top_Down_Survivor/handgun/idle/survivor-idle_handgun_${i}.png`
      )
    );
  }
  for (let i = 0; i <= 14; i++) {
    attackFrames.push(
      loadImage(
        `./assets/Top_Down_Survivor/handgun/meleeattack/survivor-meleeattack_handgun_${i}.png`
      )
    );
  }

  for (let i = 0; i <= 19; i++) {
    moveFrames.push(
      loadImage(
        `./assets/Top_Down_Survivor/handgun/move/survivor-move_handgun_${i}.png`
      )
    );
  }
  for (let i = 0; i <= 2; i++) {
    shootFrames.push(
      loadImage(
        `./assets/Top_Down_Survivor/handgun/shoot/survivor-shoot_handgun_${i}.png`
      )
    );
  }
  for (let i = 0; i <= 14; i++) {
    shootFrames.push(
      loadImage(
        `./assets/Top_Down_Survivor/handgun/reload/survivor-reload_handgun_${i}.png`
      )
    );
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Set canvas size
  cols = width / tileSize;
  rows = height / tileSize;
  soldier = new Character(idleFrames, moveFrames, shootFrames, reloadFrames);
  soldier.position.set(width / 2, height - 150);

 

// Create multiple enemies
  // Create multiple goblin enemies
  for (let i = 0; i < 5; i++) {
    let goblin = new Enemy(goblinImg, 29, 145, 11, 3) // Parameters for goblin (11 frames, 29x145)
    enemies.push(goblin);
  }

  // Create multiple golem enemies
  for (let i = 0; i < 5; i++) {
    let golem = new Enemy(golemImg, 46, 183, 7, 2.5); // Parameters for golem (7 frames, 46x183)
    enemies.push(golem);
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resize canvas when window is resized
  cols = width / tileSize;
  rows = height / tileSize;
}

function draw() {
  background(0);

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      image(sandTile, x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  soldier.update();
  soldier.display();

  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];
    enemy.update();
    enemy.display();

    // Check collision with bullets
    for (let j = soldier.bullets.length - 1; j >= 0; j--) {
      let bullet = soldier.bullets[j];
      if (bullet.hits(enemy)) {
        enemies.splice(i, 1); // Remove enemy
        soldier.bullets.splice(j, 1); // Remove bullet
        break; // Exit bullet loop since enemy is removed
      }
    }
  }
}

class Enemy {
    constructor(spriteSheet, frameWidth, frameHeight, cols, scale) {
      this.spriteSheet = spriteSheet;
      this.frameWidth = frameWidth;     // Width of each frame in the sprite sheet
      this.frameHeight = frameHeight;   // Height of each frame in the sprite sheet
      this.cols = cols;                 // Number of columns (frames) in a row
      this.currentFrame = 0;
      this.animationSpeed = 7;          // Speed of animation
      this.position = createVector(random(width), random(height / 2)); // Start enemy at a random x and y position in upper half of the screen
      this.scale = scale;               // Scale factor for displaying the enemy larger
    }
  
    display() {
      // Calculate the column in the sprite sheet for the current frame
      let col = this.currentFrame % this.cols;
      let row = 0; // Use the first row since it's a single row sheet
  
      // Draw the current frame from the sprite sheet
      image(
        this.spriteSheet,
        this.position.x,
        this.position.y,
        this.frameWidth * this.scale,   // Apply scaling factor to width
        this.frameHeight * this.scale,  // Apply scaling factor to height
        col * this.frameWidth,          // X position in sprite sheet
        row * this.frameHeight,         // Y position in sprite sheet (0 for the first row)
        this.frameWidth,                // Frame width
        this.frameHeight                // Frame height
      );
    }
  
    update() {
      if (frameCount % this.animationSpeed === 0) {
        // Cycle through frames in the first row
        this.currentFrame = (this.currentFrame + 1) % this.cols;
      }
  
      // Move the enemy downward
      this.position.y += 1;
  
      // Reset position if the enemy moves off the screen (bottom)
      if (this.position.y > height) {
        this.position.y = -this.frameHeight * this.scale; // Reset to just above the canvas
        this.position.x = random(0, width);               // Random x position
      }
    }
  }
  

class Character {
  constructor(idleFrames, moveFrames, shootFrames, reloadFrames) {
    this.animations = {
      idle: idleFrames,
      move: moveFrames,
      shoot: shootFrames,
      reload: reloadFrames,
    };
    this.currentAction = "idle";
    this.frameIndex = 0;
    this.animationSpeed = 5;
    this.position = createVector(width / 2, height - 50);
    this.speed = 3;
    this.scale = 0.75;
    this.bullets = []; // Array to hold bullets
    this.lastShotTime = 0; // Time since last shot
    this.shootCooldown = 15; // Frames to wait between shots
  }

  setAction(action) {
    if (this.currentAction !== action) {
      this.currentAction = action;
      this.frameIndex = 0;
    }
  }

  shoot() {
    if (frameCount - this.lastShotTime >= this.shootCooldown) {
      // Define the offset position of the bullet relative to the character
      let offsetX = 31; // Adjust horizontally (e.g., 20 pixels to the right)
      let offsetY = -90; // Adjust vertically (e.g., 20 pixels above the character)

      // Set initial position of the bullet with offsets
      let initialX = this.position.x + offsetX;
      let initialY = this.position.y + offsetY;

      // Define the bullet's direction (upward, in this example)
      let angle = -PI / 2; // Upward direction

      // Create and add the bullet to the bullets array
      this.bullets.push(new Bullet(initialX, initialY, angle));
      this.lastShotTime = frameCount; // Reset the cooldown timer
    }
  }
  display() {
    let frames = this.animations[this.currentAction];
    if (frames && frames.length > 0) {
      push();
      translate(this.position.x, this.position.y);
      rotate(-PI / 2);
      imageMode(CENTER);
      image(
        frames[this.frameIndex],
        0,
        0,
        frames[this.frameIndex].width * this.scale,
        frames[this.frameIndex].height * this.scale
      );
      pop();
    }

    // Display bullets
    for (let bullet of this.bullets) {
      bullet.display();
    }
  }

  update() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.setAction("move");
      this.position.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.setAction("move");
      this.position.x += this.speed;
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      this.setAction("move");
      this.position.y -= this.speed;
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      this.setAction("move");
      this.position.y += this.speed;
    }

    if (keyIsPressed && key === " ") {
      this.shoot(); // Call shoot() only if cooldown has passed
    }

    this.position.x = constrain(this.position.x, 0, width - tileSize);
    this.position.y = constrain(this.position.y, 0, height - tileSize);

    if (frameCount % this.animationSpeed === 0) {
      let frames = this.animations[this.currentAction];
      if (frames) {
        this.frameIndex = (this.frameIndex + 1) % frames.length;
      }
    }

    // Update bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      let bullet = this.bullets[i];
      bullet.update();
      if (bullet.isOffScreen()) {
        this.bullets.splice(i, 1); // Remove bullet if it's off screen
      }
    }
  }
}

class Bullet {
  constructor(x, y, angle) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.fromAngle(angle).mult(10); // Bullet speed
    this.size = 20; // Bullet size
  }

  // Update bullet position
  update() {
    this.position.add(this.velocity);
  }

  // Display the bullet
  display() {
    image(bulletImg, this.position.x, this.position.y, this.size);
  }

  // Check if bullet is off screen
  isOffScreen() {
    return (
      this.position.x < 0 ||
      this.position.x > width ||
      this.position.y < 0 ||
      this.position.y > height
    );
  }

  // Check if bullet hits an enemy
  hits(enemy) {
    // Calculate distance to enemy center
    let bulletRadius = this.size / 2;
    let enemyRadius = (enemy.frameWidth * enemy.scale) / 2;

    // Calculate the distance between bullet and enemy centers
    let distance = dist(
      this.position.x,
      this.position.y,
      enemy.position.x,
      enemy.position.y
    );

    // Collision if the distance is less than the sum of their radii
    return distance <= bulletRadius + enemyRadius;
  }
}
