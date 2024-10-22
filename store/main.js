//JS FILE FOR CUSTOMIZATION

/* 
The idea is the character is displayed on the left while the store is 
displayed on the right. Players can click on diff parts of the char
to see what they can equip and buy for that type of item.
*/

//arrays to store purchasable items
let hats = [];
let armor = [];
let weapons = []; //probably come built in with abilities
let boots = [];

//object to store character data
//placeholder values atm
let character = {
    "hat": "hat.png",
    "armor": "armor.png",
    "weapon": "weapon.png",
    "boots": "boots.png",
    abilities: ["fireball"]
}

let itemPositions = [];

//vars for tracking what the player has clicked
let selectedCategory = "hats";
let clickBoxes = [];
let hatArea;
let armorArea;
let weaponArea;
let bootsArea;

function preload() {
    hats = [
        {"img": loadImage("./images/Hats/tophat.png"), "name": "Top Hat"},
        {"img": loadImage("./images/Hats/purple hat.jpg"), "name": "Purple Hat"}
    ];
}

function setup() {
    createCanvas(600, 400);
    background(90, 105, 96);
    hatArea = new ClickAreas(width/4, height/2 - 150, "hats");
    armorArea = new ClickAreas(width/4, height/2 + 80, "boots");
    bootsArea = new ClickAreas(width/4, height/2 - 50, "armor");
    weaponArea = new ClickAreas(width/4 + 70, height/2 +10, "weapons");
    clickBoxes.push(hatArea, armorArea, bootsArea, weaponArea);

}

function draw() {

    //placeholder visual for seeing click areas
    clickZones();

    for (let box of clickBoxes) {
        box.display();
    }

    displayItems(selectedCategory, width/4 * 3, height/6);
}

//temp function for visual indication
function clickZones() {
    fill(255, 255, 255, 50);
    noStroke();
    textAlign(CENTER);
    rectMode(CENTER);
    
    //drawing the estimated area
    rect(width/4, height/2 - 150, 100, 50); //hat
    rect(width/4, height/2 + 80, 100, 50); //boots
    rect(width/4, height/2 - 50, 100, 100); //armor
    rect(width/4 + 70, height/2 + 10, 100, 50); //weapon

    //labels for clarification
    fill(0);
    text("Hat", width/4 - 20, height/2 - 160);
    text("Armor", width/4 - 20, height/2 - 60);
    text("Weapon", width/4 + 50, height/2 + 20);
    text("Boots", width/4 - 20, height/2 + 90);
}

//detect when player is clicking on the char
function mousePressed() {
    fill(90, 105, 96);
    rect(width/4 * 3, height/4, 200, 400);

    for (let box of clickBoxes) {
        box.checkClick();
    }

    displayItems(selectedCategory);
    /*for (let i = 0; i < itemPositions.length; i++) {
        let item = itemPositions[i];
        if (mouseX > item.x && mouseX < item.x + 50 && mouseY > item.y && mouseY < item.y + 50) {
            equipItem(selectedCategory, item.img);
        }
    } */

}

//use this function to display all the available choices
//from selectedCategory
function displayItems(items, x, y) {
    let arr;
    switch (items) {
        case "hats":
            arr = hats;
        break;

        case "armor":
            arr = armor;
        break;

        case "boots":
            arr = boots;
        break;

        case "weapons":
            arr = weapons;
        break;
    }
   //when the arrays are populated, this function will
   //iterate through all the imgs in the arr and display
    itemPositions = [];
    for (let i = 0; i < arr.length; i++) {
        let img = arr[i].img;
        image(img, x, y + i * 60, 50, 50);
        fill(0);
       text(arr[i].name, x-50, y + i * 60 + 30); //label

        itemPositions.push({ x: x, y: y + i * 60, img: img });
    }

    //placeholder code
    fill(200);
    // rect(x, y, 150, 50); //placeholder image
     fill(0);
    text("Displaying " + items, x, y-20);
}

//class for the clicking zones
class ClickAreas {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.type = type;
        if (this.type == "armor") {
            this.height = 100;
        } else {
            this.height = 50;
        }
    }

    checkClick() {
        if (mouseX > this.x - this.width/2 && mouseX < this.x + this.width/2
            && mouseY < this.y + this.height/2 && mouseY > this.y - this.height/2) {
               selectedCategory = this.type;
            }
    }

    display() {
        //draw the selected item on this zone
        fill(255, 0, 0);
        rect(this.x, this.y, 10);
    }
}

