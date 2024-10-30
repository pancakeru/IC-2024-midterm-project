let perlinGraphics;
let scrollX;
let scrollY;
let tileSize = 20;
let bullets = []
let frameDelay = 0;
let fireSpeed = 5;
let autoFire = -1;
let sandTile, soldier;
let cols, rows;
let spriteSheet;
let frameWidth = 200; // Width of each frame in the sprite sheet
let frameHeight = 200; // Height of each frame in the sprite sheet
let currentFrame = 0;
let totalFrames = 6; 
let animationSpeed = 10; // Adjust to control animation speed
let idleFrames = [];
let moveFrames = [];
let shootFrames = [];
let reloadFrames = [];
let attackFrames = [];
let enemies = [];
let bulletImg;

function preload(){
    sandTile = loadImage("./assets/Sand _2.jpg");
    skeletonSpriteIdle = loadImage("./assets/enemies/Skeleton/Skeleton_Idle.png");
    goblinImg = loadImage("./assets/enemies/goblinsword.png");
    golemImg = loadImage("./assets/enemies/golem-walk.png");
    bulletImg = loadImage("./assets/bullet.png");

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
    createCanvas(400, 400);
    perlinGraphics = createGraphics(1600, 1600); // create scrolling perlin noise canvas 
    watergraphics = createGraphics(2000, 2000); // create water border
    watergraphics.fill(128, 130, 250); // water border color
    watergraphics.rect(0, 0, 2000, 2000); // fill it with water
    image(watergraphics, 0, 0); // show water border
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
    // start the player in the center of the perlinGraphics
    scrollX = (perlinGraphics.width - width) / 2 + 10;
    scrollY = (perlinGraphics.height - height) / 2 + 10;

    perlinBG(); // make the perling back ground
    perlinGraphics.fill(0);
    // create a starting black 3x3 for player spawn
    perlinGraphics.rect(perlinGraphics.width / 2 - tileSize, perlinGraphics.height / 2 - tileSize, tileSize * 3, tileSize * 3);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight); 
    cols = width / tileSize;
    rows = height / tileSize;
  }

function draw() {
    background(220);
    // display perlin background
    image(perlinGraphics, -scrollX, -scrollY);
    // player (red square for now)
    fill(255, 0, 0);
    // put in center of screen
    rect(width / 2 - 10, height / 2 - 10, 20, 20);
    frameDelay++;
    if (mouseIsPressed || autoFire == 1) {
        if (frameDelay > 60 / fireSpeed) {
            bullets.push(new Bullet())
            frameDelay = 0
        }
    }
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].display()
    }
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].display();
        if (bullets[i].x < 0 || bullets[i].x > perlinGraphics.width ||
            bullets[i].y < 0 || bullets[i].y > perlinGraphics.height) {
            bullets.splice(i, 1);
        }
    }
    // essentially the player move function
    updateScroll();
}

function perlinBG() {
    perlinGraphics.noiseDetail(24);

    // for each tile
    for (let y = 0; y < perlinGraphics.height; y += tileSize) {
        for (let x = 0; x < perlinGraphics.width; x += tileSize) {
            let noiseVal = noise(x / 100, y / 100); // scale and calculate the noise function
            let colour = map(noiseVal, 0, 1, 0, 255); // map to greyscale
            if (colour < 100) { // if less than 100 map to water color
                colour = color(128, 197, 222); // water color
            }
            // draw tiles with color
            perlinGraphics.fill(colour);
            perlinGraphics.noStroke();
            perlinGraphics.rect(x, y, tileSize, tileSize);
        }
    }
}

function updateScroll() {
    let playerX = scrollX + width / 2; // find player position in perlinGraphics canvas
    let playerY = scrollY + height / 2; // think of it as a coordinate transformation from main canvas coordinates to perlinGraphics canvas


    // move right and check if at right border or color to the right of the player is water
    if (keyIsDown(68) && scrollX < perlinGraphics.width - 210) {
        if (perlinGraphics.get(playerX + 10, playerY)[1] != 197)
            // push the canvas to the left (signs are inverted above)
            scrollX += 3;
    }
    // move left and check if at left border or color to the left is water
    else if (keyIsDown(65) && scrollX > -190) {
        if (perlinGraphics.get(playerX - 15, playerY)[1] != 197)
            // push canvas to the right (signs are inverted above)
            scrollX -= 3;
    }

    // move up and check if at top border or color up is water
    if (keyIsDown(87) && scrollY > -190) {
        if (perlinGraphics.get(playerX, playerY - 15)[1] != 197)
            // push the canvas downwards (signs inverted above)
            scrollY -= 3;
    }
    // move down and check if at bottom border or color down is water
    else if (keyIsDown(83) && scrollY < perlinGraphics.height - 210) {
        if (perlinGraphics.get(playerX, playerY + 10)[1] != 197)
            // push the canvas upward (signs inverted above)
            scrollY += 3;
    }

}

class Bullet {
    constructor() {
        this.x = scrollX + width / 2
        this.y = scrollY + width / 2
        this.bulletPos = createVector(this.x, this.y)
        this.mouseDir = createVector(mouseX + scrollX, mouseY + scrollY).sub(this.bulletPos);
        this.mouseDir.setMag(5);
    }
    display() {
        fill(0)
        ellipse(this.bulletPos.x - scrollX, this.bulletPos.y - scrollY, 5, 5);
        this.bulletPos.add(this.mouseDir)
        this.x = this.bulletPos.x;
        this.y = this.bulletPos.y;
    }
}


function keyPressed() {
    if (key == "I" || key == "i") {
        autoFire *= -1
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
        this.frameWidth * this.scale,   
        this.frameHeight * this.scale,
        col * this.frameWidth,
        row * this.frameHeight,        
        this.frameWidth,                
        this.frameHeight                
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
        this.position.y = -this.frameHeight * this.scale; 
        this.position.x = random(0, width);       
      }
    }
  }