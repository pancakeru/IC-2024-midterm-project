let perlinGraphics;
let watergraphics;
let scrollX;
let scrollY;
let playerHP = 5;
let hitEffectAlpha = 0;
let hitEffectDuration = 120;
let AD = 1;
let bootSpeed = 3;
let waveNumber = 0;
let enemiesPerWave = 5;
let tileSize = 40;
let bullets = [];
let frameDelay = 0;
let fireSpeed = 5;
let autoFire = -1;
let skeleton;
let cols, rows;
let tileset;
let spriteSheet;
let frameWidth = 200; // Width of each frame in the sprite sheet
let frameHeight = 200; // Height of each frame in the sprite sheet
let currentFrame = 0;
let totalFrames = 6;
let animationSpeed = 10; // Adjust to control animation speed
let zombieWalkFrames = [];
let zombieAttackFrames = [];
let enemies = [];
let bulletImg;
let grid = [];

function preload() {
    for (let i = 0; i < 17; i++) {
        let frame = loadImage(`./assets/export/skeleton-move_${i}.png`);
        zombieWalkFrames.push(frame);
    }
    for (let i = 0; i < 9; i++) {
        let frame = loadImage(`./assets/export/skeleton-attack_${i}.png`);
        zombieAttackFrames.push(frame);
    }
    tileset = loadImage("./assets/tilesheet.png");
}

function setup() {
    createCanvas(600, 600);
    perlinGraphics = createGraphics(2000, 2000); // create scrolling perlin noise canvas 
    watergraphics = createGraphics(2500, 2500); // create water border
    watergraphics.fill(128, 130, 250); // water border color
    watergraphics.rect(0, 0, 2000, 2000); // fill it with water
    image(watergraphics, 0, 0); // show water border

    // start the player in the center of the perlinGraphics
    scrollX = (perlinGraphics.width - width) / 2 + 10;
    scrollY = (perlinGraphics.height - height) / 2 + 10;
    perlinBG();
    perlinGraphics.fill(0);
    // create a starting black 3x3 for player spawn
    perlinGraphics.rect(perlinGraphics.width / 2 - tileSize, perlinGraphics.height / 2 - tileSize, tileSize * 3, tileSize * 3);

    // Set the starting area to walkable
    for (let y = perlinGraphics.height / 2 - tileSize; y < perlinGraphics.height / 2 - tileSize + tileSize * 3; y += tileSize) {
        let rowIndex = Math.floor(y / tileSize);
        for (let x = perlinGraphics.width / 2 - tileSize; x < perlinGraphics.width / 2 - tileSize + tileSize * 3; x += tileSize) {
            let colIndex = Math.floor(x / tileSize);
            grid[rowIndex][colIndex].walkable = true;
        }
    }

    startNewWave();
}

function draw() {
    background(220);
    image(watergraphics, 0, 0);
    image(perlinGraphics, -scrollX, -scrollY);

    for (let enemy of enemies) {
        enemy.update();
        enemy.display();
        enemy.checkProximityToPlayer();
    }

    frameDelay++;
    if (mouseIsPressed || autoFire == 1) {
        if (frameDelay > 60 / fireSpeed) {
            bullets.push(new Bullet());
            frameDelay = 0;
        }
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
        let collision = bullets[i].display();
        if (
            bullets[i].x < 0 ||
            bullets[i].x > perlinGraphics.width ||
            bullets[i].y < 0 ||
            bullets[i].y > perlinGraphics.height || collision == true
        ) {
            bullets.splice(i, 1);
        }
    }

    updateScroll();
    fill(255, 0, 0);
    rect(width / 2 - 10, height / 2 - 10, 40, 40);
    if (enemies.length === 0) {
        startNewWave();
    }
    displayUI();
    if (playerHP < 1) {
        GameOver()
    }
    if (hitEffectAlpha > 0) {
        drawHitEffect();
        hitEffectAlpha = max(0, hitEffectAlpha - 5); // Reduce alpha to fade out the effect
    }
}
function GameOver() {
    // to be filled in
}
function displayUI() {
    // Draw health bar background
    fill(0, 0, 0, 200); // Semi-transparent background
    rect(10, 10, 105, 30, 5); // Slightly rounded corners

    // Draw health bar (red rectangles for each health point)
    for (let i = 0; i < playerHP; i++) {
        fill(255, 0, 0);
        rect(15 + i * 20, 15, 15, 20); // Draw each health point as a red bar
    }

    // Display round number
    textSize(16);
    fill(0, 0, 0, 200); // Background for text
    rect(10, height - 50, 150, 45, 10); // Background for round info
    fill(255); // White text color
    textAlign(LEFT, CENTER);
    text(`Round:  ${waveNumber}`, 20, height - 35); // Display round number text
    text(`Zombies Left: ${enemies.length}`, 20, height - 20)
}

function drawHitEffect() {
    push();
    let playerX = width / 2;
    let playerY = height / 2;
    noFill();
    stroke(255, 0, 0, hitEffectAlpha); // Red color with transparency
    strokeWeight(200);
    ellipse(playerX, playerY, 850); // Circle around the player
    pop();
}

function perlinBG() {
    grid = [];
    perlinGraphics.noiseDetail(24);

    for (let rowIndex = 0, y = 0; y < perlinGraphics.height; y += tileSize, rowIndex++) {
        let row = [];
        for (let colIndex = 0, x = 0; x < perlinGraphics.width; x += tileSize, colIndex++) {
            let noiseVal = noise(x / 200, y / 200);
            let walkable = true;

            // Map noiseVal to specific tile coordinates in the 8x8 grid
            let sx = 0;
            let sy = 0;

            // Reordered conditions from smallest to largest noiseVal
            if (noiseVal < 0.35) {
                // Water tile (unwalkable)
                perlinGraphics.fill(28, 163, 236);
                perlinGraphics.noStroke();
                perlinGraphics.rect(x, y, tileSize, tileSize);
                walkable = false;
            } else if (noiseVal < 0.40) {
                sx = 280;
                sy = 40;
                walkable = true;
            } else if (noiseVal < 0.45) {
                sx = 280;
                sy = 80;
                walkable = true;
            } else if (noiseVal < 0.5) {
                sx = 280;
                sy = 120;
                walkable = true;
            } else if (noiseVal < 0.55) {
                sx = 0;
                sy = 40;
                walkable = true;
            } else if (noiseVal < 0.60) {
                sx = 120;
                sy = 0;
                walkable = true;
            } else if (noiseVal < 0.65) {
                sx = 120;
                sy = 40;
                walkable = true;
            } else if (noiseVal < 0.70) {
                sx = 200;
                sy = 0;
                walkable = true;
            }
            else if (noiseVal < 0.75) {
                sx = 80;
                sy = 320;
                walkable = true;
            }
            else {
                sx = 40;
                sy = 0;
                walkable = true;
            }

            // Draw the selected tile on the perlinGraphics if it's not water
            if (walkable) {
                perlinGraphics.image(tileset, x, y, tileSize, tileSize, sx, sy, tileSize, tileSize);
            }

            // Create grid node with row and col indices
            let node = {
                x: x,
                y: y,
                row: rowIndex,
                col: colIndex,
                walkable: walkable,
            };
            row.push(node);
        }
        grid.push(row);
    }
}

function startNewWave() {
    for (let i = 0; i < enemiesPerWave * waveNumber + 5; i++) { // Increase enemy count with each wave
        enemies.push(new Enemy());
    }
    waveNumber++; // Increment wave number after each spawn
}
function updateScroll() {
    let moveSpeed = bootSpeed;

    // Handle horizontal movement independently
    if (keyIsDown(68)) { // D key
        let tempScrollX = scrollX + moveSpeed;
        let newPlayerX = tempScrollX + width / 2 + 28;
        let newPlayerY = scrollY + height / 2;
        let playerNode = getNode(newPlayerX, newPlayerY);
        if (playerNode && playerNode.walkable) {
            scrollX = tempScrollX;
            scrollX = constrain(scrollX, 0 - width, perlinGraphics.width + width);
        }
    }
    if (keyIsDown(65)) { // A key
        let tempScrollX = scrollX - moveSpeed;
        let newPlayerX = tempScrollX + width / 2 - 9;
        let newPlayerY = scrollY + height / 2;
        let playerNode = getNode(newPlayerX, newPlayerY);
        if (playerNode && playerNode.walkable) {
            scrollX = tempScrollX;
            scrollX = constrain(scrollX, 0 - width, perlinGraphics.width + width - tileSize / 2);
        }
    }

    // Handle vertical movement independently
    if (keyIsDown(87)) { // W key
        let tempScrollY = scrollY - moveSpeed;
        let newPlayerX = scrollX + width / 2;
        let newPlayerY = tempScrollY + height / 2 - 9;
        let playerNode = getNode(newPlayerX, newPlayerY);
        if (playerNode && playerNode.walkable) {
            scrollY = tempScrollY;
            scrollY = constrain(scrollY, 0 - width + tileSize / 2, perlinGraphics.height + height - tileSize / 2);
        }
    }
    if (keyIsDown(83)) { // S key
        let tempScrollY = scrollY + moveSpeed;
        let newPlayerX = scrollX + width / 2;
        let newPlayerY = tempScrollY + height / 2 + 26;
        let playerNode = getNode(newPlayerX, newPlayerY);
        if (playerNode && playerNode.walkable) {
            scrollY = tempScrollY;
            scrollY = constrain(scrollY, 0 - width, perlinGraphics.height + height - tileSize);
        }
    }
}

function getNode(x, y) {
    let col = Math.floor(x / tileSize);
    let row = Math.floor(y / tileSize);
    if (
        col >= 0 &&
        col < grid[0].length &&
        row >= 0 &&
        row < grid.length
    ) {
        return grid[row][col];
    } else {
        return null;
    }
}

class Bullet {
    constructor() {
        this.x = scrollX + width / 2;
        this.y = scrollY + height / 2;
        this.bulletPos = createVector(this.x, this.y);
        this.mouseDir = createVector(mouseX + scrollX - this.x, mouseY + scrollY - this.y);
        this.mouseDir.setMag(5);
    }
    display() {
        fill(0);
        ellipse(this.bulletPos.x - scrollX, this.bulletPos.y - scrollY, 5, 5);
        this.bulletPos.add(this.mouseDir);
        this.x = this.bulletPos.x;
        this.y = this.bulletPos.y;
        for (let i = enemies.length - 1; i >= 0; i--) {
            let enemy = enemies[i];

            // Check if the distance between the bullet and enemy is less than 10
            if (this.bulletPos.copy().sub(enemy.position).mag() < 35) {
                enemy.Health -= AD;
                if (enemy.Health < 1) {
                    enemies.splice(i, 1); // Remove the enemy from the array by index
                }
                return true;
            }
        }
        return false;
    }
}

function keyPressed() {
    if (key == "I" || key == "i") {
        autoFire *= -1;
    }
}

class Enemy {
    constructor() {
        let spawnEdge = Math.floor(random(4)); // 0: top, 1: bottom, 2: left, 3: right
        if (spawnEdge === 0) {
            // Top border
            this.position = createVector(random(0, perlinGraphics.width), 0);
        } else if (spawnEdge === 1) {
            // Bottom border
            this.position = createVector(random(0, perlinGraphics.width), perlinGraphics.height - tileSize);
        } else if (spawnEdge === 2) {
            // Left border
            this.position = createVector(0, random(0, perlinGraphics.height));
        } else if (spawnEdge === 3) {
            // Right border
            this.position = createVector(perlinGraphics.width - tileSize, random(0, perlinGraphics.height));
        }

        // Ensure the enemy spawns on a walkable tile
        let startNode = getNode(this.position.x, this.position.y);
        while (!startNode || !startNode.walkable) {
            if (spawnEdge === 0) {
                this.position = createVector(random(0, perlinGraphics.width), 0);
            } else if (spawnEdge === 1) {
                this.position = createVector(random(0, perlinGraphics.width), perlinGraphics.height - tileSize);
            } else if (spawnEdge === 2) {
                this.position = createVector(0, random(0, perlinGraphics.height));
            } else if (spawnEdge === 3) {
                this.position = createVector(perlinGraphics.width - tileSize, random(0, perlinGraphics.height));
            }
            startNode = getNode(this.position.x, this.position.y);
        }

        // initialize variables\
        this.Health = 3;
        this.velocity = createVector(0, 0);
        this.maxSpeed = 4.0;
        this.maxForce = 0.5;
        this.path = [];
        this.currentStep = 0;
        this.lastCalculation = 0;
        this.pathRecalcInterval = 30; // update path every 30 frames
        this.hitTimer = 0;
        this.frame = 0;
        this.attackMode = 0;
    }
    checkProximityToPlayer() {
        let playerPos = createVector(scrollX + width / 2, scrollY + height / 2);
        if (p5.Vector.dist(this.position, playerPos) < 150) {
            this.attackMode = 1;
        }
        else {
            this.attackMode = 0;
        }
        this.hitTimer++;
        if (p5.Vector.dist(this.position, playerPos) < 35 && this.hitTimer > 120) {
            playerHP = max(0, playerHP - 1); // Reduce health and prevent negative values
            this.hitTimer = 0;
            hitEffectAlpha = 150;
        }
    }
    update() {
        let playerPos = createVector(scrollX + width / 2, scrollY + height / 2);
        let distanceToPlayer = p5.Vector.dist(this.position, playerPos);

        // Recalculate path less frequently if enemy is far from the player
        let recalculationInterval = distanceToPlayer < 200 ? 30 : 80;

        if (
            frameCount - this.lastCalculation > recalculationInterval ||
            this.path.length === 0 ||
            this.currentStep >= this.path.length
        ) {
            let startNode = getNode(this.position.x, this.position.y);
            let goalNode = getNode(playerPos.x, playerPos.y);

            if (!startNode || !goalNode || !startNode.walkable || !goalNode.walkable) {
                this.path = [];
                return;
            }

            // Recalculate path and reset the current step
            this.path = this.findPath(startNode, goalNode);
            this.currentStep = 0;
            this.lastCalculation = frameCount;
        }

        // Follow the calculated path
        this.followPath();
    }



    followPath() {
        if (this.path.length > 0 && this.currentStep < this.path.length) {
            let nextNode = this.path[this.currentStep];
            let targetPos = createVector(
                nextNode.x + tileSize / 2,
                nextNode.y + tileSize / 2
            );

            // Increase the threshold distance to 15 for transitioning to the next node
            if (p5.Vector.dist(this.position, targetPos) < 15) {
                this.currentStep++;
            }

            // Smooth movement toward the target node
            this.seek(targetPos);
        } else {
            // If at the end of the path, seek the player's position directly
            let playerPos = createVector(scrollX + width / 2, scrollY + height / 2);
            this.seek(playerPos);
        }
    }



    seek(target) {
        let desired = p5.Vector.sub(target, this.position);
        let distance = desired.mag();

        if (distance === 0) return; // Avoid division by zero

        desired.normalize();

        // Dynamically reduce speed when close to the target to prevent jittery movement
        let speed = distance < 50 ? map(distance, 0, 50, 0, this.maxSpeed) : this.maxSpeed;
        desired.mult(speed);

        // Apply damping to smooth out changes in direction
        let damping = distance < 50 ? 0.1 : 1.0; // Apply damping if close to the target
        let steer = p5.Vector.sub(desired, this.velocity).mult(damping);
        steer.limit(this.maxForce);

        this.velocity.add(steer);
        this.velocity.limit(this.maxSpeed); // Limit velocity to max speed

        // Update position smoothly
        this.position.add(this.velocity);
    }



    display() {
        // Determine the correct frames array based on attack mode
        const frames = this.attackMode === 0 ? zombieWalkFrames : zombieAttackFrames;

        // Increment frame only if the array is non-empty
        if (frames.length > 0 && frameCount % animationSpeed === 0) {
            this.frame = (this.frame + 1) % frames.length;
        }

        push();
        translate(this.position.x - scrollX, this.position.y - scrollY);
        if (this.velocity.mag() > 0) {
            rotate(this.velocity.heading());
        }
        imageMode(CENTER);

        // Display the correct frame based on the attack mode
        if (frames[this.frame]) {
            image(frames[this.frame], 0, 0, tileSize * 2, tileSize * 2);
        } else {
            this.frame = 0;
            image(frames[this.frame], 0, 0, tileSize * 2, tileSize * 2);

        }

        pop();
    }



    findPath(startNode, goalNode) {
        let openSet = [];
        let closedSet = new Set();
        let cameFrom = {};
        let gScore = {};
        let fScore = {};

        let startKey = nodeKey(startNode);
        gScore[startKey] = 0;
        fScore[startKey] = this.heuristic(startNode, goalNode);
        openSet.push(startNode);

        while (openSet.length > 0) {
            let current = openSet.reduce((a, b) => {
                return fScore[nodeKey(a)] < fScore[nodeKey(b)] ? a : b;
            });

            if (current === goalNode) {
                return this.reconstructPath(cameFrom, current);
            }

            openSet.splice(openSet.indexOf(current), 1);
            closedSet.add(nodeKey(current));

            for (let neighborInfo of this.getNeighbors(current)) {
                let neighbor = neighborInfo.node;
                let moveCost = neighborInfo.cost;
                let neighborKey = nodeKey(neighbor);

                if (!neighbor.walkable || closedSet.has(neighborKey)) {
                    continue;
                }

                let tentativeGScore = gScore[nodeKey(current)] + moveCost;

                if (!(neighborKey in gScore) || tentativeGScore < gScore[neighborKey]) {
                    cameFrom[neighborKey] = current;
                    gScore[neighborKey] = tentativeGScore;
                    fScore[neighborKey] =
                        gScore[neighborKey] + this.heuristic(neighbor, goalNode);

                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            }
        }
        return [];
    }

    heuristic(a, b) {
        // Use Manhattan distance for grid-based pathfinding
        return abs(a.col - b.col) + abs(a.row - b.row);
    }

    reconstructPath(cameFrom, current) {
        let totalPath = [current];
        while (nodeKey(current) in cameFrom) {
            current = cameFrom[nodeKey(current)];
            totalPath.unshift(current);
        }
        return totalPath;
    }

    getNeighbors(node) {
        let neighbors = [];
        let row = node.row;
        let col = node.col;

        let directions = [
            { dr: -1, dc: 0, cost: 1 }, // Up
            { dr: 1, dc: 0, cost: 1 }, // Down
            { dr: 0, dc: -1, cost: 1 }, // Left
            { dr: 0, dc: 1, cost: 1 }, // Right
            { dr: -1, dc: -1, cost: Math.SQRT2 }, // Up-Left
            { dr: -1, dc: 1, cost: Math.SQRT2 }, // Up-Right
            { dr: 1, dc: -1, cost: Math.SQRT2 }, // Down-Left
            { dr: 1, dc: 1, cost: Math.SQRT2 } // Down-Right
        ];

        for (let dir of directions) {
            let newRow = row + dir.dr;
            let newCol = col + dir.dc;
            if (
                newRow >= 0 &&
                newRow < grid.length &&
                newCol >= 0 &&
                newCol < grid[0].length
            ) {
                let neighbor = grid[newRow][newCol];

                if (dir.dr !== 0 && dir.dc !== 0) {
                    let node1 = grid[row][newCol];
                    let node2 = grid[newRow][col];
                    if (!node1.walkable || !node2.walkable) {
                        continue; // Can't move diagonally if adjacent nodes are not walkable
                    }
                }

                neighbors.push({ node: neighbor, cost: dir.cost });
            }
        }
        return neighbors;
    }
}

function nodeKey(node) {
    return `${node.row},${node.col}`;
}
