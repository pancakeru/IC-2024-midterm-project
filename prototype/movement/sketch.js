let perlinGraphics;
let scrollX;
let scrollY;
let tileSize = 20;
let bullets = [];
let frameDelay = 0;
let fireSpeed = 5;
let autoFire = -1;
let enemies = [];
let grid = [];

function setup() {
    createCanvas(400, 400);
    perlinGraphics = createGraphics(1600, 1600);
    watergraphics = createGraphics(2000, 2000);
    watergraphics.fill(128, 130, 250);
    watergraphics.noStroke();
    watergraphics.rect(0, 0, 2000, 2000);
    scrollX = (perlinGraphics.width - width) / 2 + 10;
    scrollY = (perlinGraphics.height - height) / 2 + 10;
    perlinBG();
    perlinGraphics.fill(0);
    perlinGraphics.noStroke();
    perlinGraphics.rect(
        perlinGraphics.width / 2 - tileSize,
        perlinGraphics.height / 2 - tileSize,
        tileSize * 3,
        tileSize * 3
    );

    for (let i = 0; i < 5; i++) {
        enemies.push(new Enemy());
    }
}

function draw() {
    background(220);
    image(watergraphics, 0, 0);
    image(perlinGraphics, -scrollX, -scrollY);

    for (let enemy of enemies) {
        enemy.update();
        enemy.display();
    }

    frameDelay++;
    if (mouseIsPressed || autoFire == 1) {
        if (frameDelay > 60 / fireSpeed) {
            bullets.push(new Bullet());
            frameDelay = 0;
        }
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].display();
        if (
            bullets[i].x < 0 ||
            bullets[i].x > perlinGraphics.width ||
            bullets[i].y < 0 ||
            bullets[i].y > perlinGraphics.height
        ) {
            bullets.splice(i, 1);
        }
    }

    updateScroll();
    fill(255, 0, 0);
    rect(width / 2 - 10, height / 2 - 10, 20, 20);
}

function perlinBG() {
    grid = [];
    perlinGraphics.noiseDetail(24);
    for (let y = 0; y < perlinGraphics.height; y += tileSize) {
        let row = [];
        for (let x = 0; x < perlinGraphics.width; x += tileSize) {
            let noiseVal = noise(x / 100, y / 100);
            let colour = map(noiseVal, 0, 1, 0, 255);
            let walkable = true;
            if (colour < 95) {
                colour = color(128, 197, 222);
                walkable = false;
            }
            perlinGraphics.fill(colour);
            perlinGraphics.noStroke();
            perlinGraphics.rect(x, y, tileSize, tileSize);

            // Create grid node
            let node = {
                x: x,
                y: y,
                walkable: walkable
            };
            row.push(node);
        }
        grid.push(row);
    }
}

function updateScroll() {
    let playerX = scrollX + width / 2;
    let playerY = scrollY + height / 2;

    if (keyIsDown(68) && scrollX < perlinGraphics.width - 210) {
        if (perlinGraphics.get(playerX + 12, playerY)[1] != 197) scrollX += 3;
    } else if (keyIsDown(65) && scrollX > -190) {
        if (perlinGraphics.get(playerX - 12, playerY)[1] != 197) scrollX -= 3;
    }

    if (keyIsDown(87) && scrollY > -190) {
        if (perlinGraphics.get(playerX, playerY - 12)[1] != 197) scrollY -= 3;
    } else if (keyIsDown(83) && scrollY < perlinGraphics.height - 210) {
        if (perlinGraphics.get(playerX, playerY + 12)[1] != 197) scrollY += 3;
    }
}

class Bullet {
    constructor() {
        this.x = scrollX + width / 2;
        this.y = scrollY + height / 2;
        this.bulletPos = createVector(this.x, this.y);
        this.mouseDir = createVector(mouseX + scrollX, mouseY + scrollY).sub(this.bulletPos);
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
            
            // Check if the distance between the bullet and enemy is less than 3
            if (this.bulletPos.copy().sub(enemy.position).mag() < 10) {
                enemies.splice(i, 1); // Remove the enemy from the array by index
            }
        }
}
}

function keyPressed() {
    if (key == "I" || key == "i") {
        autoFire *= -1;
    }
}

class Enemy {
    constructor() {
        // random enemy spawn location (currently)
        this.position = createVector(
            random(0, perlinGraphics.width),
            random(0, perlinGraphics.height)
        );

        // ensure the enemy starts on a walkable tile
        let startNode = this.getNode(this.position.x, this.position.y);
        while (!startNode.walkable) {
            this.position = createVector(
                random(0, perlinGraphics.width),
                random(0, perlinGraphics.height)
            );
            startNode = this.getNode(this.position.x, this.position.y);
        }
        // all code above is currently placeholder
        // initalize variables
        this.velocity = createVector(0, 0);
        this.maxSpeed = 5.0; 
        this.maxForce = 0.1; 
        this.path = [];
        this.currentStep = 0;
        this.lastCalculation = 0;
        this.pathRecalcInterval = 20; // update path every 20 frames
    }

    update() {
        // get vector to player pos
        let playerPos = createVector(scrollX + width / 2, scrollY + height / 2);

        // recalculate path if necessary
        if (
            frameCount - this.lastCalculation > this.pathRecalcInterval ||
            this.path.length === 0 ||
            this.currentStep >= this.path.length
        ) {
            // represent player and enemy as nodes
            let startNode = this.getNode(this.position.x, this.position.y);
            let goalNode = this.getNode(playerPos.x, playerPos.y);

            if (!startNode.walkable || !goalNode.walkable) {
                this.path = [];
                return;
            }
            // call find path
            this.path = this.findPath(startNode, goalNode);
            this.currentStep = 0;
            // update last calculation's frame count
            this.lastCalculation = frameCount;
        }
        // call follow path
        this.followPath();
    }
// gpt
    followPath() {
        if (this.path.length > 0 && this.currentStep < this.path.length) {
            let nextNode = this.path[this.currentStep];
            let targetPos = createVector(
                nextNode.x + tileSize / 2,
                nextNode.y + tileSize / 2
            );

            this.seek(targetPos);

            // Check if reached the current target node
            if (p5.Vector.dist(this.position, targetPos) < 5) {
                this.currentStep++;
            }
        } else {
            // No path or reached the end, seek the player's current position
            let playerPos = createVector(scrollX + width / 2, scrollY + height / 2);
            this.seek(playerPos);
        }
    }
// gpt
    seek(target) {
        let desired = p5.Vector.sub(target, this.position);
        let distance = desired.mag();

        if (distance === 0) {
            return; // avoid division by zero
        }

        desired.normalize();

        // slow down when close to target to prevent overshooting
        if (distance < 50) {
            let m = map(distance, 0, 50, 0, this.maxSpeed);
            desired.mult(m);
        } else {
            desired.mult(this.maxSpeed);
        }

        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);

        this.velocity.add(steer);
        this.velocity.limit(this.maxSpeed);

        // Predict next position
        let nextPosition = p5.Vector.add(this.position, this.velocity);

        // Check if next position is walkable
        let nextNode = this.getNode(nextPosition.x, nextPosition.y);
        if (nextNode && nextNode.walkable) {
            // Move to next position
            this.position = nextPosition;
        } else {
            // Adjust velocity to prevent moving into water
            this.velocity.mult(0); // Stop movement
        }
    }

    display() {
        fill(0, 255, 0);
        push();
        translate(this.position.x - scrollX, this.position.y - scrollY);
        if (this.velocity.mag() > 0) {
            rotate(this.velocity.heading());
        }
        rectMode(CENTER);
        rect(0, 0, tileSize, tileSize);
        pop();
    }

    getNode(x, y) {
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
        return p5.Vector.dist(createVector(a.x, a.y), createVector(b.x, b.y)) / tileSize;
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
        let row = Math.floor(node.y / tileSize);
        let col = Math.floor(node.x / tileSize);

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
    return `${node.x},${node.y}`;
}
