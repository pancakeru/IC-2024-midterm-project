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
let characterData = LoadCharData();

if (!characterData) {
    characterData = {
        hats: null,
        armor: null,
        weapons: null,
        boots: null,
        abilities: [null]
    };

    SaveCharData(characterData);
}

let itemPositions = [];

//vars for tracking what the player has clicked
let selectedCategory = "hats";
let clickBoxes = [];
let hatArea;
let armorArea;
let weaponArea;
let bootsArea;

//var to temp store what the selected img is
let selectedImg;
let selectedPath;

//var to ref local currency amt
let currency;

//ref to html element in aprent doc
const storeDisplay = parent.document.querySelector("#store");

//placeholder guy image
let guy;

function preload() {

    //ALL PLACEHOLDER ITEMS IN ARRAY FOR NOW 
    hats = [
        {"img": loadImage("./images/Hats/tophat.png"), "name": "Top Hat", "path": "./images/Hats/tophat.png"},
        {"img": loadImage("./images/Hats/purple hat.jpg"), "name": "Purple Hat", "path": "./images/Hats/purple hat.jpg"}
    ];

    armor = [
        {"img": loadImage("./images/Armor/chestplate1.png"), "name": "Steel Chestplate", "path": "./images/Armor/chestplate1.png"},
        {"img": loadImage("./images/Armor/chestplate2.png"), "name": "Diamond Armor", "path": "./images/Armor/chestplate2.png"}
    ];

    weapons = [
        {"img": loadImage("./images/Weapons/gun1.png"), "name": "Black Gun", "path": "./images/Weapons/gun1.png"},
        {"img": loadImage("./images/Weapons/sword.png"), "name": "Gold Sword", "path": "./images/Weapons/sword.png"}
    ];

    boots = [
        {"img": loadImage("./images/Boots/boots1.jpg"), "name": "Leather Boots", "path": "./images/Boots/boots1.jpg"},
        {"img": loadImage("./images/Boots/boots2.png"), "name": "Jetpack Boots", "path": "./images/Boots/boots2.png"}
    ];

    //check if currency value already exists, else create new var
    if (localStorage.getItem("currency") == null) {
        localStorage.setItem("currency", 0);    
    } 

    guy = loadImage("./images/sodlldd.jpg");
}

function setup() {
    createCanvas(600, 600);
    background(90, 105, 96);

    //show char data in console
  //  console.log(storeDisplay);

    //new click zones to track what player is looking at
    hatArea = new ClickAreas(width/2.4, height/2.7 - 160, "hats");
    armorArea = new ClickAreas(width/2.4, height/2.7 + 300, "boots");
    bootsArea = new ClickAreas(width/2.4, height/2.7 + 40, "armor");
    weaponArea = new ClickAreas(width/1.5, height/2.7, "weapons");
    //add all to array for management
    clickBoxes.push(hatArea, armorArea, bootsArea, weaponArea);

    currency = localStorage.getItem("currency");

}

function draw() {
    background(90, 105, 96);

    imageMode(CORNER);
    image(guy, 0, height/15, 500, 500);

    textSize(15);
    //placeholder visual for seeing click areas
    clickZones();

    for (let box of clickBoxes) {
        box.display();
        box.UpdateImage();
    }
    
    textSize(30);
    fill(255, 255, 255);
    text("Money: $" + currency, 500, 300);

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

}

//detect when player is clicking on the char
function mousePressed() {
    fill(90, 105, 96);
    rect(width/4 * 3, height/4, 200, 400);

    for (let box of clickBoxes) {
        box.checkClick();
    }

    //check for player clicking on items
    itemPositions = [];
    selectedImg = null;
    selectedPath = null
    displayItems(selectedCategory, width/4 * 3, height/6);

    for (let itemPos of itemPositions) {
        if (itemPos.x + 50 > mouseX && mouseX > itemPos.x && mouseY > itemPos.y && mouseY < itemPos.y + 50) {
           // console.log("item selected " + itemPos.name);
            selectedImg = itemPos.img;
            selectedPath = itemPos.path;
        }
    }
    
   // console.log(itemPositions);
}


function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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

    storeDisplay.innerHTML = `<p id="store-header">${toTitleCase(items)}</p>`;

    let maxLength = arr.length;
    imageMode(CORNER);

   //when the arrays are populated, this function will
   //iterate through all the imgs in the arr and display
    for (let i = 0; i < maxLength; i++) {
        let img = arr[i].img;

        storeDisplay.innerHTML = storeDisplay.innerHTML + 
        `<div class="store-item" onClick="CallItem('${arr[i].path}')"> 
            <img src= "${arr[i].path}" width="70" height="70"> 
            <p> ${arr[i].name} </p>
        </div>`;

        itemPositions.push({ "x": x, "y": y + i * 60, "img": img, "name": arr[i].name, "path": arr[i].path });
    }
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

        //load the image path from local storage
        if (characterData[this.type] != null) {
            this.img = loadImage(characterData[this.type]);
        } else {
            this.img = null;
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
        if (this.img != null) {
            imageMode(CENTER);
            image(this.img, this.x, this.y, 100, 100);
        } else {
            fill(255, 255, 255);
            rect(this.x, this.y, 10);
        }
    }

    UpdateImage() {
        if (this.type == selectedCategory && itemPositions.length > 0 && selectedImg != null) {
            this.img = selectedImg;
            //store it locally to prevent it from being removed
            equipItem(this.type, selectedPath);
        }
    }
}

//function for assigning val to local storage
function equipItem(category, item) {

   // console.log(item);

        //store the image path
        characterData[category] = item;

    // Save updated character data
    SaveCharData(characterData);
    //console.log(characterData[category]);
}

function itemSelected(path) {
  selectedPath = path;
    selectedImg = loadImage(path);

}

function setSelectedPath() {

}

window.itemSelected = itemSelected;