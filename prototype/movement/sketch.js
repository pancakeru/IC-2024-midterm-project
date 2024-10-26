let perlinGraphics;
let scrollX;
let scrollY;
let tileSize = 20;
let bullets = []
let frameDelay = 0;
let fireSpeed = 5;
function setup() {
    createCanvas(400, 400);
    perlinGraphics = createGraphics(1600, 1600); // create scrolling perlin noise canvas 
    watergraphics = createGraphics(2000, 2000); // create water border
    watergraphics.fill(128, 130, 250); // water border color
    watergraphics.rect(0, 0, 2000, 2000); // fill it with water
    image(watergraphics, 0, 0); // show water border

    // start the player in the center of the perlinGraphics
    scrollX = (perlinGraphics.width - width) / 2 + 10;
    scrollY = (perlinGraphics.height - height) / 2 + 10;

    perlinBG(); // make the perling back ground
    perlinGraphics.fill(0);
    // create a starting black 3x3 for player spawn
    perlinGraphics.rect(perlinGraphics.width / 2 - tileSize, perlinGraphics.height / 2 - tileSize, tileSize * 3, tileSize * 3);
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
    if (mouseIsPressed) {
        if (frameDelay > 60 / fireSpeed) {
            bullets.push(new Bullet())
            frameDelay = 0
        }
    }
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].display()
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
