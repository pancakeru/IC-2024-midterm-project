let perlinGraphics;
let watergraphics;
let scrollX;
let scrollY;
let playerHP = 5;
let hitEffectAlpha = 0;
let hitEffectDuration = 120;
let AD = 5;
let zombieHealth = 15;
let moneyCollected = 0;
let bootSpeed = 3;
let waveNumber = 0;
let enemiesPerWave = 5;
let tileSize = 40;
let bullets = [];
let frameDelay = 0;
let fireSpeed = 5;
let autoFire = -1;
let cols, rows;
let tileset;
let animationSpeed = 10;
let zombieWalkFrames = [];
let zombieAttackFrames = [];
let enemies = [];
let bulletImg;
let grid = [];
let feetIdle, feetWalking = [];
let rifleImages = [];
let pistolImages = [];
let currentWeapon = 'rifle';
let currentFootFrame = 0;
let survivorAngle;
let bgSound;
let zombieSound;
let bulletSound;
let gameOverSound;
let playerHitSound;
let zombieDamage = 1;
let gameData = JSON.parse(localStorage.getItem("gameData")) || {};
let stats = gameData.stats || {};
let localDamage = stats.stealth;
if (localDamage) {
    AD += (localDamage / 10)
}
let localHealth = stats.defense;
if (localHealth) {
    playerHP += Math.ceil(localHealth / 15)
}
let localFireSpeed = stats.shootingSpeed;
if (localFireSpeed) {
    fireSpeed += (localFireSpeed / 20)
}
let localSpeed = stats.speed
if (localSpeed) {
    bootSpeed += (localSpeed / 90)
}
let startingPlayerHP = playerHP
function preload() {
    bgSound = loadSound('assets/audio/bgm.mp3')
    zombieSound = loadSound('assets/audio/zombie_1.mp3')
    bulletSound = loadSound('assets/audio/bullet_quiet.mp3')
    gameOverSound = loadSound('assets/audio/gameover_bad.mp3')
    playerHitSound = loadSound('assets/audio/player_hit.mp3')
    feetIdle = loadImage('assets/Top_Down_Survivor/feet/idle/survivor-idle_0.png');
    for (let i = 0; i < 20; i++) {
        feetWalking.push(loadImage(`assets/Top_Down_Survivor/feet/run/survivor-run_${i}.png`));
    }
    for (let i = 0; i < 3; i++) {
        rifleImages.push(loadImage(`assets/Top_Down_Survivor/rifle/shoot/survivor-shoot_rifle_${i}.png`));
    }
    for (let i = 0; i < 3; i++) {
        pistolImages.push(loadImage(`assets/Top_Down_Survivor/handgun/shoot/survivor-shoot_handgun_${i}.png`));
    }
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

    // make sure the starting area is walkable
    for (let y = perlinGraphics.height / 2 - tileSize; y < perlinGraphics.height / 2 - tileSize + tileSize * 3; y += tileSize) {
        let rowIndex = Math.floor(y / tileSize);
        for (let x = perlinGraphics.width / 2 - tileSize; x < perlinGraphics.width / 2 - tileSize + tileSize * 3; x += tileSize) {
            let colIndex = Math.floor(x / tileSize);
            grid[rowIndex][colIndex].walkable = true;
        }
    }
    // begin wave
    startNewWave();
}

function draw() {
    if (!bgSound.isPlaying()) {
        bgSound.setVolume(0.5)
        bgSound.play()
    }
    background(220);
    image(watergraphics, 0, 0); // draw needed graphics
    image(perlinGraphics, -scrollX, -scrollY);

    for (let enemy of enemies) { // for all enemies display update and check proximity
        enemy.update();
        enemy.display();
        enemy.checkProximityToPlayer();
    }

    frameDelay++; // bullet firing mechanicc
    if (mouseIsPressed || autoFire == 1) {
        if (frameDelay > 60 / fireSpeed) {
            bullets.push(new Bullet());
            bulletSound.play()
            frameDelay = 0;
        }
    }

    for (let i = bullets.length - 1; i >= 0; i--) { // display all bullets
        let collision = bullets[i].display();
        if ( // bullets go off screen or hit an enemy delete them from the array
            bullets[i].x < 0 ||
            bullets[i].x > perlinGraphics.width ||
            bullets[i].y < 0 ||
            bullets[i].y > perlinGraphics.height || collision == true
        ) {
            bullets.splice(i, 1);
        }
    }

    updateScroll();
    displayPlayer();
    if (enemies.length === 0) { // if all enemies are dead, start the next wave
        startNewWave();
    }
    displayUI(); // display UI
    if (playerHP < 1) { // if player has 0 HP end the game
        GameOver()
    }
    if (hitEffectAlpha > 0) { // if player has been hit
        drawHitEffect(); // draw hit effect
        hitEffectAlpha = max(0, hitEffectAlpha - 5); //  fade out the effect
    }
}
function GameOver() {
    bgSound.stop()
    gameOverSound.setVolume(2)
    gameOverSound.play()
    remove()
    let gameOverDiv = document.createElement("div");
    gameOverDiv.style.position = "fixed";
    gameOverDiv.style.top = "50%";
    gameOverDiv.style.left = "50%";
    gameOverDiv.style.transform = "translate(-50%, -50%)";
    gameOverDiv.style.color = "red";
    gameOverDiv.style.fontSize = "48px";
    gameOverDiv.style.fontWeight = "bold";
    gameOverDiv.style.textAlign = "center";
    gameOverDiv.style.backgroundColor = "black";
    gameOverDiv.style.padding = "20px";
    gameOverDiv.style.borderRadius = "10px";
    gameOverDiv.innerHTML = `Game Over<br> <span style="font-size: 24px; color: white;">Stats:<br> Rounds Survived: ${waveNumber - 1} <br> Zombies Killed: ${moneyCollected / 3}<br> Money Collected: ${moneyCollected} <br> <a href="../../store/index.html" target="_top">
    <button style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Back to Main Page</button>
</a></span>`;
    let inventoryDiv = window.parent.document.getElementById("inventory")
    inventoryDiv.style.display = "none"
    let localCurrency = gameData.currency || 0;
    if (localCurrency) {
        moneyCollected += Number(localCurrency);

    }
    gameData.currency = moneyCollected;
    localStorage.setItem("gameData", JSON.stringify(gameData));

    // Append the Game Over div to the body
    document.body.appendChild(gameOverDiv);
}
function displayPlayer() {
    let playerX = width / 2;
    let playerY = height / 2;

    // find the angle the player needs to move to face the mouse
    survivorAngle = atan2(mouseY - playerY, mouseX - playerX);

    push();
    translate(playerX, playerY);
    // rotate by the calculated angle
    rotate(survivorAngle);

    // draw feet frame - use walking frames if moving, otherwise idle
    let feetFrame = keyIsPressed ? feetWalking[currentFootFrame] : feetIdle;
    imageMode(CENTER);
    image(feetFrame, 0, 0, 40, 40);

    // draw body frame based on weapon
    let bodyFrames = currentWeapon === 'rifle' ? rifleImages : pistolImages;
    let bodyFrame = bodyFrames[frameCount % bodyFrames.length];
    image(bodyFrame, 0, 0, 70, 70);

    pop();

    // update foot frame for walking 
    if (keyIsPressed) {
        currentFootFrame = (currentFootFrame + 1) % feetWalking.length;
    }
}



function displayUI() {
    // draw red rectangles representing health bar
    fill(0, 0, 0, 200);
    rect(10, 10, startingPlayerHP * 20 + 5, 30, 5);
    for (let i = 0; i < playerHP; i++) {
        fill(255, 0, 0);
        rect(15 + i * 20, 15, 15, 20);
    }
    // draw health bar background

    // display round number
    textSize(16);
    fill(0, 0, 0, 200);
    rect(10, height - 50, 150, 45, 10); // background for round info
    fill(255);
    textAlign(LEFT, CENTER);
    text(`Round:  ${waveNumber}`, 20, height - 35); // display round number text
    text(`Zombies Left: ${enemies.length}`, 20, height - 20) // display number of zombies left
}

function drawHitEffect() {
    push();
    noFill();
    stroke(255, 0, 0, hitEffectAlpha); // red color with transparency
    strokeWeight(200);
    ellipse(width / 2, height / 2, 850); // circle around the player/center of screen
    pop();
}

function perlinBG() {
    grid = [];
    perlinGraphics.noiseDetail(24);

    for (let rowIndex = 0, y = 0; y < perlinGraphics.height; y += tileSize, rowIndex++) { // for each 40x40 tile
        let row = [];
        for (let colIndex = 0, x = 0; x < perlinGraphics.width; x += tileSize, colIndex++) {
            let noiseVal = noise(x / 200, y / 200); // scale down
            let walkable = true;

            // map noiseVal to specific tile coordinates in the 8x8 grid
            let sx = 0;
            let sy = 0;
            if (noiseVal < 0.35) { // smaller than 0.35 indicates water
                // Water tile (unwalkable)
                perlinGraphics.fill(28, 163, 236);
                perlinGraphics.noStroke();
                perlinGraphics.rect(x, y, tileSize, tileSize);
                walkable = false; // set to unwalkable
            } else if (noiseVal < 0.40) { // grass
                sx = 280;
                sy = 40;
                walkable = true;
            } else if (noiseVal < 0.45) { // grass with subtle plants
                sx = 280;
                sy = 80;
                walkable = true;
            } else if (noiseVal < 0.5) { // grass ith lots of plants
                sx = 280;
                sy = 120;
                walkable = true;
            } else if (noiseVal < 0.55) { // rocky grass
                sx = 0;
                sy = 40;
                walkable = true;
            } else if (noiseVal < 0.60) { //pavement
                sx = 120;
                sy = 0;
                walkable = true;
            } else if (noiseVal < 0.65) { //pavement2
                sx = 120;
                sy = 40;
                walkable = true;
            } else if (noiseVal < 0.70) { // rocks
                sx = 200;
                sy = 0;
                walkable = true;
            }
            else if (noiseVal < 0.75) {// smooth rock
                sx = 80;
                sy = 320;
                walkable = true;
            }
            else { // dark rock
                sx = 40;
                sy = 0;
                walkable = true;
            }

            // draw the selected tile on the perlinGraphics if it's not water
            if (walkable) {
                perlinGraphics.image(tileset, x, y, tileSize, tileSize, sx, sy, tileSize, tileSize);
            }

            let node = { // create a node object
                x: x,
                y: y,
                row: rowIndex,
                col: colIndex,
                walkable: walkable,
            };
            row.push(node); // push node to row
        }
        grid.push(row); // push row to grid
    }
    // loop top and lower border and make all walkable dark rocks
    for (let i = 0; i < grid.length; i++) {
        grid[0][i].walkable = true;
        grid[0][i].sx = 40;
        grid[0][i].sy = 0;
        perlinGraphics.image(tileset, i * tileSize, 0, tileSize, tileSize, 40, 0, tileSize, tileSize);

        grid[grid.length - 1][i].walkable = true;
        grid[grid.length - 1][i].sx = 40;
        grid[grid.length - 1][i].sy = 0;
        perlinGraphics.image(tileset, i * tileSize, (grid.length - 1) * tileSize, tileSize, tileSize, 40, 0, tileSize, tileSize);
    }
    // loop left and right border and make all walkable dark rock
    for (let i = 1; i < grid.length - 1; i++) {
        grid[i][0].walkable = true;
        grid[i][0].sx = 40;
        grid[i][0].sy = 0;
        perlinGraphics.image(tileset, 0, i * tileSize, tileSize, tileSize, 40, 0, tileSize, tileSize);

        grid[i][grid[i].length - 1].walkable = true;
        grid[i][grid[i].length - 1].sx = 40;
        grid[i][grid[i].length - 1].sy = 0;
        perlinGraphics.image(tileset, (grid[i].length - 1) * tileSize, i * tileSize, tileSize, tileSize, 40, 0, tileSize, tileSize);
    }
}

function startNewWave() {
    for (let i = 0; i < enemiesPerWave * waveNumber + 5; i++) { // increase enemy count for each wave
        enemies.push(new Enemy());
    }
    waveNumber++; // increment wave number
    if (waveNumber % 5 == 0) {
        zombieHealth += 2;
    }
    if (waveNumber % 7 == 0) {
        zombieDamage += 1;
    }
}
function updateScroll() {
    let moveSpeed = bootSpeed;
    if (keyIsDown(68)) { // D key
        let tempScrollX = scrollX + moveSpeed;
        let newPlayerX = tempScrollX + width / 2 + 28; // check right position
        let newPlayerY = scrollY + height / 2;
        let playerNode = getNode(newPlayerX, newPlayerY); // get node at new position (floor functions are used so numbers are trial and error)
        if (playerNode && playerNode.walkable) { // if it exists and is walkable
            scrollX = tempScrollX; // update scrollX
            scrollX = constrain(scrollX, 0 - width, perlinGraphics.width + width); // constrain scrollX to dimensions of canvas
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
    let col = Math.floor(x / tileSize); // get row and col from x and y
    let row = Math.floor(y / tileSize);
    if (
        col >= 0 &&
        col < grid[0].length &&
        row >= 0 &&
        row < grid.length
    ) {
        return grid[row][col]; // return node object if it exists
    } else {
        return null;
    }
}

class Bullet {
    constructor() {
        if (currentWeapon == "pistol") {  // check weapon and adjust offset
            this.offsetX = 30;
            this.offsetY = 20;
        }
        else {
            this.offsetX = 30;
            this.offsetY = 17;
        }
        // the position of the weapons barrel relative to the player(body)
        let rotatedX = this.offsetX * cos(survivorAngle) - this.offsetY * sin(survivorAngle);
        let rotatedY = this.offsetX * sin(survivorAngle) + this.offsetY * cos(survivorAngle);
        // bullet position
        this.x = scrollX + width / 2 + rotatedX;
        this.y = scrollY + height / 2 + rotatedY;
        this.bulletPos = createVector(this.x, this.y);
        // vector from initial bullet position to mouse
        this.mouseDir = createVector(mouseX + scrollX - this.x, mouseY + scrollY - this.y);
        this.mouseDir.setMag(5); // bullet speed
    }

    display() {
        fill(0);
        ellipse(this.bulletPos.x - scrollX, this.bulletPos.y - scrollY, 5, 5); // draw bullet
        this.bulletPos.add(this.mouseDir); // move the bullet along the mouse path
        this.x = this.bulletPos.x; // update position
        this.y = this.bulletPos.y;

        // Check for collisions with enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            let enemy = enemies[i];
            if (this.bulletPos.copy().sub(enemy.position).mag() < 35) { // if vector substraction results in a vector with magnitude less than 35
                enemy.Health -= AD; // reduce enemy health by attack damage
                if (enemy.Health < 1) { // if enemy health is below 1
                    enemies.splice(i, 1); // remove enemy out of aray
                    moneyCollected += 3;
                }
                return true; // return true if collision happened (cant delete bullet inside bullet instance so it is returned above and deleted there)
            }
        }
        return false; // return false if no collision
    }
}



function keyPressed() { // autofire (quality of life)
    if (key == "I" || key == "i") {
        autoFire *= -1;
    }
}

class Enemy {
    constructor() {
        let spawnEdge = Math.floor(random(4)); // 0: top, 1: bottom, 2: left, 3: right (choose a random border)
        if (spawnEdge === 0) { // spawn along the borders
            this.position = createVector(random(0, perlinGraphics.width), 0);
        } else if (spawnEdge === 1) {
            this.position = createVector(random(0, perlinGraphics.width), perlinGraphics.height - tileSize);
        } else if (spawnEdge === 2) {
            this.position = createVector(0, random(0, perlinGraphics.height));
        } else if (spawnEdge === 3) {
            this.position = createVector(perlinGraphics.width - tileSize, random(0, perlinGraphics.height));
        }

        // make sure the enemy spawns on a walkable tile
        let startNode = getNode(this.position.x, this.position.y); // get spawn position node
        while (!startNode || !startNode.walkable) { // while not walkable keep respawning
            if (spawnEdge === 0) {
                this.position = createVector(random(0, perlinGraphics.width), 0);
            } else if (spawnEdge === 1) {
                this.position = createVector(random(0, perlinGraphics.width), perlinGraphics.height - tileSize);
            } else if (spawnEdge === 2) {
                this.position = createVector(0, random(0, perlinGraphics.height));
            } else if (spawnEdge === 3) {
                this.position = createVector(perlinGraphics.width - tileSize, random(0, perlinGraphics.height));
            }
            startNode = getNode(this.position.x, this.position.y); // get node
        }

        // initialize variables
        this.Health = zombieHealth;
        this.velocity = createVector(0, 0);
        this.maxSpeed = 4.0;
        this.maxForce = 0.5;
        this.path = []; // path to player
        this.currentStep = 0;
        this.lastCalculation = 0;
        this.pathRecalcInterval = 30; // update path every 30 frames
        this.hitTimer = 0; // every zombie can only hit once every 2 seconds
        this.frame = 0;
        this.attackMode = 0; // attack or walking frames
    }
    checkProximityToPlayer() {
        let playerPos = createVector(scrollX + width / 2, scrollY + height / 2); // player vecotr
        if (p5.Vector.dist(this.position, playerPos) < 150) { // if player is close
            this.attackMode = 1; // switch to attack mode
            if (!zombieSound.isPlaying()) {
                zombieSound.play()
            }
        }
        else {
            this.attackMode = 0; // walking mode
        }
        this.hitTimer++; // hit timer
        if (p5.Vector.dist(this.position, playerPos) < 35 && this.hitTimer > 120) { // if player is on enemy and hit timer is greater than 120
            playerHP = max(0, playerHP - zombieDamage); // reduce playerHP 
            this.hitTimer = 0; // reset hittimer
            hitEffectAlpha = 150; // set alpha to 150, to alert that player has been hit
            playerHitSound.play()
        }
    }
    update() {
        let playerPos = createVector(scrollX + width / 2, scrollY + height / 2); // player pos
        let distanceToPlayer = p5.Vector.dist(this.position, playerPos); // find distance to player

        // recalculate path less frequently if enemy is far from the player
        let recalculationInterval = distanceToPlayer < 200 ? 30 : 80;

        if ( // perform a calculation if path length is 0, if enough time has passed, or if we are futher along the path than expected
            frameCount - this.lastCalculation > recalculationInterval ||
            this.path.length === 0 ||
            this.currentStep >= this.path.length
        ) {
            let startNode = getNode(this.position.x, this.position.y); // find zombie position node
            let goalNode = getNode(playerPos.x, playerPos.y); // player position node

            if (!startNode || !goalNode || !startNode.walkable || !goalNode.walkable) { // if any dont exist or are unwalkable return
                this.path = [];
                return;
            }

            // recalculate path and reset the current step
            this.path = this.findPath(startNode, goalNode);
            this.currentStep = 0;
            this.lastCalculation = frameCount;
        }

        // follow the calculated path
        this.followPath();
    }



    followPath() { // if path length is not zero, and current step is not further along the calculated path
        if (this.path.length > 0 && this.currentStep < this.path.length) {
            let nextNode = this.path[this.currentStep]; // find next node 
            let targetPos = createVector( // vector from current node to next node
                nextNode.x + tileSize / 2,
                nextNode.y + tileSize / 2
            );

            // check if new position has been reached
            if (p5.Vector.dist(this.position, targetPos) < 15) {
                this.currentStep++;
            }

            // call seek
            this.seek(targetPos);
        } else {
            // if at the end of the path, seek the player's position directly 
            let playerPos = createVector(scrollX + width / 2, scrollY + height / 2);
            this.seek(playerPos);
        }
    }



    seek(target) {
        let desired = p5.Vector.sub(target, this.position); // vector from position to player
        let distance = desired.mag(); // find magnitude

        if (distance === 0) return; // avoid division by zero

        desired.normalize(); // normalize the vector

        // if distance is less than 50 map speed to slow down when the enemy reaches the player (attempt to reduce jitter)
        let speed = distance < 50 ? map(distance, 0, 50, 0, this.maxSpeed) : this.maxSpeed;
        desired.mult(speed); // multiply by speed

        // try to damp changes in direction if player is close
        let damping = distance < 50 ? 0.1 : 1.0;
        let steer = p5.Vector.sub(desired, this.velocity).mult(damping); // find the difference between where the enemy is currently going and where its trying to go
        steer.limit(this.maxForce); // limit this steering so its not as sharp

        this.velocity.add(steer); // add steer to velocity
        this.velocity.limit(this.maxSpeed); // Limit velocity to max speed

        // add to position
        this.position.add(this.velocity);
    }



    display() {
        // determine the correct frames array based on attack mode
        const frames = this.attackMode === 0 ? zombieWalkFrames : zombieAttackFrames;

        // increment frame with loop around
        if (frames.length > 0 && frameCount % animationSpeed === 0) {
            this.frame = (this.frame + 1) % frames.length;
        }

        push();
        translate(this.position.x - scrollX, this.position.y - scrollY);
        if (this.velocity.mag() > 0) { // if zombie is moving
            rotate(this.velocity.heading()); // rotate zombie to face direction of movement
        }
        imageMode(CENTER);

        // display the correct frame based on the attack mode
        if (frames[this.frame]) {
            image(frames[this.frame], 0, 0, tileSize * 2, tileSize * 2);
        } else {// if frame doesnt exist just reset to 0 (issues with swapping from attack to walking mode)
            this.frame = 0;
            image(frames[this.frame], 0, 0, tileSize * 2, tileSize * 2);

        }

        pop();
    }



    findPath(startNode, goalNode) {
        let openSet = []; // nodes to be explored
        let closedSet = new Set(); // nodes explored already 
        let cameFrom = {}; // which nodes the path is created from
        let gScore = {}; // distance from startnode to each node
        let fScore = {}; //  estimated distance from start node to goal

        let startKey = nodeKey(startNode); // get row and col as string
        gScore[startKey] = 0; // set the distance to start node to be 0
        fScore[startKey] = this.heuristic(startNode, goalNode); // get distance between start and goal
        openSet.push(startNode); // mark start node as visited
        while (openSet.length > 0) { // while there are nodes to be visited
            let current = openSet.reduce((a, b) => { // choose the node with the lowest fscore
                return fScore[nodeKey(a)] < fScore[nodeKey(b)] ? a : b;
            });

            if (current === goalNode) { // if node found is the end 
                return this.reconstructPath(cameFrom, current); // return path
            }

            openSet.splice(openSet.indexOf(current), 1); // remove current from nodes to be explored
            closedSet.add(nodeKey(current)); // add to exlored nodes

            for (let neighborInfo of this.getNeighbors(current)) { // for each neighbor
                let neighbor = neighborInfo.node; // find node
                let moveCost = neighborInfo.cost; // and cost to move there
                let neighborKey = nodeKey(neighbor); // row col string

                if (!neighbor.walkable || closedSet.has(neighborKey)) { // if unwalkable to already visited, skip
                    continue;
                }

                let tentativeGScore = gScore[nodeKey(current)] + moveCost; // find gscore to valid neighbors

                if (!(neighborKey in gScore) || tentativeGScore < gScore[neighborKey]) { // check if not evaluated (first iteration of neighbors) or check if neighbor has a better gscore
                    cameFrom[neighborKey] = current; // point neighbor to current (backwards)
                    gScore[neighborKey] = tentativeGScore; // set gscore of neighbor
                    fScore[neighborKey] = gScore[neighborKey] + this.heuristic(neighbor, goalNode); // set fscore

                    if (!openSet.includes(neighbor)) { // add neighbor to openset
                        openSet.push(neighbor);
                    }
                }
            }
        }
        return [];// if no path exists
    }
    // helper function
    heuristic(a, b) { // return dist formula
        return Math.sqrt((a.col - b.col) ** 2 + (a.row - b.row) ** 2);
    }

    reconstructPath(cameFrom, current) { // once path is found
        let totalPath = [current]; // start from goal node
        while (nodeKey(current) in cameFrom) { // find current node's predecessor if exists
            current = cameFrom[nodeKey(current)]; // set current to predecessor
            totalPath.unshift(current); // add to begining of array (array is built backwards)
        }
        return totalPath; // return path
    }
    // helper method (find neighbors and create nodes for them)
    getNeighbors(node) {
        let neighbors = [];
        let row = node.row;  // current row and col
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

        for (let dir of directions) { // for all directions
            let newRow = row + dir.dr; // find new row and col for each
            let newCol = col + dir.dc;
            if ( // check if within bounds
                newRow >= 0 &&
                newRow < grid.length &&
                newCol >= 0 &&
                newCol < grid[0].length
            ) {
                let neighbor = grid[newRow][newCol]; // find neighbor grid

                if (dir.dr !== 0 && dir.dc !== 0) { // diagonal movement
                    let node1 = grid[row][newCol]; // find both nodes
                    let node2 = grid[newRow][col];
                    if (!node1.walkable || !node2.walkable) { // check if both nodes are not walkable 
                        continue; // diagonal movement is not allowed if either is unwalkable
                    }
                }

                neighbors.push({ node: neighbor, cost: dir.cost }); // push node object to neighbors
            }
        }
        return neighbors; // return neighbors array
    }
}
// helper method
function nodeKey(node) { // retrive row and col
    return `${node.row},${node.col}`;
}
