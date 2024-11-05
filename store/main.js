let itemWidth = 64;
let itemHeight = 64;
// Arrays to store categorized items
let hats = [];
let armor = [];
let weaponsArr = [];
let weapons = [];
let boots = [];
let gloves = [];
let canvas;
let inventory = [];
//starting stats
let stats = {
  stealth: 0,
  defense: 0,
  shootingSpeed: 0,
  speed: 0,
};
let characterData = {
  hats: null,
  armor: null,
  weapons: null,
  boots: null,
};
let clickBoxes = [];
let selectedImg = null;
let selectedPath = null;

let hatArea, armorArea, weaponArea, bootsArea;
// Variables for tracking the selected category
let selectedCategory = "hats";
let currency = 50;
let characterImg;

function preload() {
  spriteSheet = loadImage("./images/armour.png");
  characterImg = loadImage("./images/character.png");
  weaponsArr[0] = loadImage("./images/weapons/AK_full.png");
  weaponsArr[1] = loadImage("./images/weapons/Assault rifle_full.png");
  weaponsArr[2] = loadImage("./images/weapons/pistol_full.png");
  weaponsArr[3] = loadImage("./images/weapons/Shootgun_full.png");
  weaponsArr[4] = loadImage("./images/weapons/USI_full.png");
}

// AI help taken to name the items and categories

function loadItemsFromSpriteSheet() {
  hats = [
    {
      id: "hat0",
      img: extractItem(0, 1),
      category: "hats",
      name: "Shadow Hood",
      effect: "+10 Shooting Speed",
      stealth: 10,
      cost: 15,
    },
    {
      id: "hat1",
      img: extractItem(0, 2),
      category: "hats",
      name: "Hunter's Cap",
      effect: "+20 Shooting Speed",
      stealth: 20,
      cost: 25,
    },
    {
      id: "hat2",
      img: extractItem(0, 3),
      category: "hats",
      name: "Knight's Helm",
      effect: "+30 Shooting Speed",
      stealth: 30,
      cost: 35,
    },
    {
      id: "hat3",
      img: extractItem(0, 4),
      category: "hats",
      name: "Mystic Crown",
      effect: "+40 Shooting Speed",
      stealth: 40,
      cost: 50,
    },
  ];

  armor = [
    {
      id: "armor0",
      img: extractItem(1, 0),
      category: "armor",
      name: "Leather Vest",
      effect: "+10 Health",
      defense: 10,
      cost: 20,
    },
    {
      id: "armor1",
      img: extractItem(1, 1),
      category: "armor",
      name: "Chainmail",
      effect: "+20 Health",
      defense: 20,
      cost: 40,
    },
    {
      id: "armor2",
      img: extractItem(1, 2),
      category: "armor",
      name: "Plate Armor",
      effect: "+30 Health",
      defense: 30,
      cost: 60,
    },
    {
      id: "armor3",
      img: extractItem(1, 3),
      category: "armor",
      name: "Dragon Armor",
      effect: "+40 Health",
      defense: 40,
      cost: 80,
    },
    {
      id: "armor4",
      img: extractItem(1, 4),
      category: "armor",
      name: "Titanium Suit",
      effect: "+50 Health",
      defense: 50,
      cost: 100,
    },
  ];

  weapons = [
    {
      id: "weapon0",
      img: weaponsArr[0],
      category: "weapons",
      name: "Steel Fang",
      effect: "+5 Damage",
      damage: 5,
      cost: 20,
    },
    {
      id: "weapon01",
      img: weaponsArr[1],
      category: "weapons",
      name: "Viper Strike",
      effect: "+10 Damage",
      damage: 10,
      cost: 35,
    },
    {
      id: "weapon2",
      img: weaponsArr[2],
      category: "weapons",
      name: "Nightfall",
      effect: "+20 Damage",
      damage: 20,
      cost: 50,
    },
    {
      id: "weapon3",
      img: weaponsArr[3],
      category: "weapons",
      name: "Thunderbolt",
      effect: "+15 Damage",
      damage: 15,
      cost: 65,
    },
    {
      id: "weapon4",
      img: weaponsArr[4],
      category: "weapons",
      name: "Dragon's Fury",
      effect: "+40 Damage",
      damage: 40,
      cost: 120,
    },
  ];

  boots = [
    {
      id: "boots0",
      img: extractItem(4, 0),
      category: "boots",
      name: "Sandals",
      effect: "+10 Speed",
      speed: 10,
      cost: 10,
    },
    {
      id: "boots1",
      img: extractItem(4, 1),
      category: "boots",
      name: "Leather Boots",
      effect: "+20 Speed",
      speed: 20,
      cost: 20,
    },
    {
      id: "boots2",
      img: extractItem(4, 2),
      category: "boots",
      name: "Winged Boots",
      effect: "+30 Speed",
      speed: 30,
      cost: 40,
    },
    {
      id: "boots3",
      img: extractItem(4, 3),
      category: "boots",
      name: "Rocket Boots",
      effect: "+40 Speed",
      speed: 40,
      cost: 60,
    },
    {
      id: "boots4",
      img: extractItem(4, 4),
      category: "boots",
      name: "Sonic Boots",
      effect: "+50 Speed",
      speed: 50,
      cost: 90,
    },
  ];
}

function setup() {
  const characterContainer = document.getElementById('characterContainer');
  const containerWidth = characterContainer.offsetWidth;
  const containerHeight = characterContainer.offsetHeight;

  canvas = createCanvas(containerWidth - 110, containerHeight);

  canvas = createCanvas(containerWidth - 100, containerHeight);
  canvas.parent('characterContainer');
  canvas.position(0, 0);
  canvas.style('position', 'absolute');
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '2');


  loadItemsFromSpriteSheet();
  LoadCharData();

  hatArea = new ClickAreas(width / 4 + 130, height / 2 - 250, 150, 130, "hats");

  armorArea = new ClickAreas(
    width / 4 + 125,
    height / 2 - 110,
    240,
    230,
    "armor"
  );

  bootsArea = new ClickAreas(
    width / 4 + 140,
    height / 2 + 230,
    210,
    130,
    "boots"
  );
  weaponArea = new ClickAreas(
    width / 4 + 200,
    height / 2 + 50,
    150,
    200,
    "weapons"
  );

  // Add clickable areas to the array
  clickBoxes = [hatArea, armorArea, bootsArea, weaponArea];
  displayStore(selectedCategory);
  displayInventory();
}

function draw() {

  clear()
  // rectMode(CENTER);
  // fill(255, 0, 0); 

  clickBoxes.forEach((box) => {
    box.display();
  });
}

function mousePressed() {
  clickBoxes.forEach((box) => {
    if (typeof box.checkClick === "function") {
      box.checkClick();
      // console.log("Clicked on box", box);
    } else {
      console.error("Error: checkClick is not defined for box", box);
    }
  });
}

function switchCategory(direction) {
  const categories = ["hats", "armor", "boots", "weapons"];
  let currentIndex = categories.indexOf(selectedCategory);

  if (direction === "left") {
    selectedCategory =
      categories[(currentIndex - 1 + categories.length) % categories.length];
  } else if (direction === "right") {
    selectedCategory = categories[(currentIndex + 1) % categories.length];
  }

  displayStore();
  SaveCharData();
}

// // Function to display currency amount
// function displayCurrency() {
//   textSize(30);
//   fill(255, 255, 255);
//   text("Money: $" + currency, 450, 50);
// }

// Max stats for each attribute
const MAX_STATS = {
  stealth: 90,
  defense: 100,
  shootingSpeed: 100,
  speed: 100,
};


function extractItem(col, row) {
  let item = createGraphics(itemWidth, itemHeight);
  item.image(
    spriteSheet,
    0,
    0,
    itemWidth,
    itemHeight,
    col * itemWidth,
    row * itemHeight,
    itemWidth,
    itemHeight
  );
  return item;
}

// Display items in the selected category
function displayStore() {
  const itemsContainer = document.getElementById("itemsContainer");
  const categoryNameDisplay = document.getElementById("categoryName");

  if (!itemsContainer || !categoryNameDisplay) {
    console.error("Error: Required DOM elements not found.");
    return;
  }

  itemsContainer.innerHTML = "";
  categoryNameDisplay.textContent = capitalize(selectedCategory);

  let itemsArray = getItemsForCategory(selectedCategory);
  itemsArray.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("shop-item");

    const itemName = document.createElement("h3");
    itemName.classList.add("item-name");
    itemName.textContent = item.name;

    const img = document.createElement("img");
    img.src = item.img.canvas.toDataURL();
    img.alt = item.name;
    img.classList.add("item-image");

    if (selectedCategory === "weapons") {
      img.style.width = "150px";
      img.style.height = "150px";
    } else {
      img.style.width = "64px";
      img.style.height = "64px";
    }

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("item-details");

    const itemEffect = document.createElement("p");
    itemEffect.classList.add("item-effect");
    itemEffect.textContent = item.effect;

    const itemCost = document.createElement("p");
    itemCost.classList.add("item-cost");
    itemCost.textContent = `Cost: $${item.cost}`;

    const actionButton = document.createElement("button");
    actionButton.classList.add("buy-button");
    actionButton.setAttribute("data-item-name", item.name);
    if (item.purchased) {
      if (item.equipped) {
        actionButton.textContent = "Equipped";
        actionButton.disabled = true;
        actionButton.classList.add("equipped");
      } else {
        actionButton.textContent = "Equip";
        actionButton.onclick = () => equipItem(item, selectedCategory);
      }
    } else {
      actionButton.innerHTML = `Buy <img src="./images/coin.png" class="coin-icon" alt="coin icon"> ${item.cost}`;
      actionButton.onclick = () => buyItem(item);
    }

    // Append elements
    detailsDiv.appendChild(itemName);
    detailsDiv.appendChild(itemEffect);
    detailsDiv.appendChild(itemCost);
    itemDiv.appendChild(img);
    detailsDiv.appendChild(actionButton);
    itemDiv.appendChild(detailsDiv);
    itemsContainer.appendChild(itemDiv);
  });
}

// Code taken from AI to update the bars proportionally to the stats
function updateStatsBars() {
  document.getElementById("stealthBar").querySelector(".fill").style.width =
    (stats.stealth / MAX_STATS.stealth) * 100 + "%";
  document.getElementById("defenseBar").querySelector(".fill").style.width =
    (stats.defense / MAX_STATS.defense) * 100 + "%";
  document
    .getElementById("shootingSpeedBar")
    .querySelector(".fill").style.width =
    (stats.shootingSpeed / MAX_STATS.shootingSpeed) * 100 + "%";
  document.getElementById("speedBar").querySelector(".fill").style.width =
    (stats.speed / MAX_STATS.speed) * 100 + "%";
}

function buyItem(item) {
  if (item.purchased) {
    console.log(`${item.name} is already purchased.`);
    equipItem(item, selectedCategory);
    return;
  }

  if (currency >= item.cost) {
    currency -= item.cost;
    item.purchased = true;
    item.equipped = true;

    document.getElementById("currencyAmount").textContent = currency;
    alert(`You bought ${item.name} for $${item.cost}!`);

    if (selectedCategory === "hats" && item.stealth) {
      stats.shootingSpeed += item.stealth;
    } else if (selectedCategory === "armor" && item.defense) {
      stats.defense += item.defense;
    } else if (selectedCategory === "weapons" && item.damage) {
      stats.stealth += item.damage;
    } else if (selectedCategory === "boots" && item.speed) {
      stats.speed += item.speed;
    }

    equipItem(item, selectedCategory);
    updateStatsBars();
    SaveCharData();

    // Update the button to show "Equipped"
    const buyButton = document.querySelector(
      `button[data-item-name="${item.name}"]`
    );
    if (buyButton) {
      buyButton.textContent = "Equipped";
      buyButton.disabled = true;
      buyButton.classList.add("equipped");
    }
  } else {
    alert("Not enough money to buy this item!");
  }
}

function equipItem(item, category) {
  deselectPreviousItem(category);

  item.equipped = true;
  clickBoxes.forEach((box) => {
    if (box.type === category) {
      box.updateImage(
        item.img.canvas ? item.img.canvas.toDataURL() : item.img.src
      );
    }
  });

  characterData[category] = item.img.canvas
    ? item.img.canvas.toDataURL()
    : item.img.src;
  SaveCharData();
  displayInventory();
}

function deselectPreviousItem(category) {
  const itemsArray = getItemsForCategory(category);
  itemsArray.forEach((item) => {
    if (item.equipped) {
      item.equipped = false;
      const button = document.querySelector(
        `button[data-item-name="${item.name}"]`
      );
      if (button) {
        button.textContent = "Equip";
        button.disabled = false;
        button.classList.remove("equipped");
      }
    }
  });
  SaveCharData();
}

function addToInventory(item, category) {
  console.log(`Adding item to inventory: ${item.name} in category ${category}`);

  let categoryDiv;

  switch (category) {
    case "armor":
      categoryDiv = document.getElementById("armorInventory");
      break;
    case "hats":
      categoryDiv = document.getElementById("helmetInventory");
      break;
    case "weapons":
      categoryDiv = document.getElementById("weaponInventory");
      break;
    case "boots":
      categoryDiv = document.getElementById("bootsInventory");
      break;
    default:
      console.warn(`Unknown category: ${category}`);
      return;
  }

  console.log(`Category div found: ${categoryDiv ? "Yes" : "No"}`);

  if (categoryDiv) {

    const previousItem = categoryDiv.querySelector(".inventory-item");
    if (previousItem) {
      previousItem.remove();
    }

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("inventory-item");

    const img = document.createElement("img");
    img.src = item.img.canvas ? item.img.canvas.toDataURL() : item.img.src;
    img.alt = item.name;
    img.style.width = "80px";
    img.style.height = "80px";

    if (img.categoryDiv === "weapons") {
      img.style.width = "140px";
      img.style.height = "140px";
    }
    itemDiv.appendChild(img);


    const itemName = document.createElement("p");
    itemName.textContent = item.name;
    itemDiv.appendChild(itemName);

    itemDiv.onclick = () => equipItemOnSoldier(item, category);


    categoryDiv.appendChild(itemDiv);
    SaveCharData();
  }
  SaveCharData();
}
// Function to display inventory items in the HTML
function displayInventory() {
  const armorInventoryItemsDiv = document.getElementById("armorInventoryItems");
  const helmetInventoryItemsDiv = document.getElementById("helmetInventoryItems");
  const weaponInventoryItemsDiv = document.getElementById("weaponInventoryItems");
  const bootsInventoryItemsDiv = document.getElementById("bootsInventoryItems");

  // Clear existing items
  armorInventoryItemsDiv.innerHTML = " ";
  helmetInventoryItemsDiv.innerHTML = " ";
  weaponInventoryItemsDiv.innerHTML = " ";
  bootsInventoryItemsDiv.innerHTML = " ";


  const allItems = [...hats, ...armor, ...weapons, ...boots];

  allItems
    .filter((item) => item.purchased)
    .forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("inventory-item");

      const img = document.createElement("img");
      img.src = item.img.canvas.toDataURL();
      img.alt = item.name;
      img.style.width = "50px";
      img.style.height = "50px";
      itemDiv.appendChild(img);

      const itemName = document.createElement("p");
      itemName.textContent = item.name;
      itemDiv.appendChild(itemName);


      itemDiv.onclick = () => equipItem(item, item.category);

      // Append to the correct inventory category
      switch (item.category) {
        case "armor":
          armorInventoryItemsDiv.appendChild(itemDiv);
          break;
        case "hats":
          helmetInventoryItemsDiv.appendChild(itemDiv);
          break;
        case "weapons":
          weaponInventoryItemsDiv.appendChild(itemDiv);
          break;
        case "boots":
          bootsInventoryItemsDiv.appendChild(itemDiv);
          break;
        default:
          console.warn("Unknown item category:", item);
      }
    });
}

function displayNavigationArrows() {
  const container = document.getElementById("navigationContainer");
  container.innerHTML = "";

  const leftArrow = document.createElement("button");
  leftArrow.classList.add("nav-arrow");
  leftArrow.textContent = "<";
  leftArrow.onclick = () => switchCategory("left");

  const rightArrow = document.createElement("button");
  rightArrow.classList.add("nav-arrow");
  rightArrow.textContent = ">";
  rightArrow.onclick = () => switchCategory("right");

  container.appendChild(leftArrow);
  container.appendChild(rightArrow);
}

// AI suggestion: Add a function to capitalize category names
// Capitalize category names
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Retrieve items by category
function getItemsForCategory(category) {
  switch (category) {
    case "hats":
      return hats;
    case "armor":
      return armor;
    case "boots":
      return boots;
    case "weapons":
      return weapons;
  }
}
function equipItemOnSoldier(item, category) {
  selectedImg = item.img;
  characterData[category] = item.img;

  // Update the image on the corresponding ClickArea
  clickBoxes.forEach((box) => {
    if (box.type === category) {
      box.updateImage(item.img);
    }
  });

  localStorage.setItem("characterData", JSON.stringify(characterData));
  SaveCharData();
}

class ClickAreas {
  constructor(x, y, width, height, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.img = null;

    // Load existing image if saved
    if (characterData[this.type]) {
      this.img = loadImage(characterData[this.type]);
    }
  }

  checkClick() {
    if (
      mouseX > this.x - this.width / 2 &&
      mouseX < this.x + this.width / 2 &&
      mouseY > this.y - this.height / 2 &&
      mouseY < this.y + this.height / 2
    ) {
      selectedCategory = this.type;
      displayStore(selectedCategory);
      SaveCharData();
    }
  }

  display() {
    if (this.img) {
      imageMode(CENTER);
      push();
      translate(this.x, this.y);
      if (this.type === "weapons") {
        rotate(PI / 2);
      }
      image(this.img, 0, 0, this.width, this.height);
      pop();
    }
    // else {
    //   // Draw outline if no image
    //   fill(255, 0, 0, 100); // Semi-transparent for visibility
    //   noStroke();
    //   rectMode(CENTER);
    //   rect(this.x, this.y, this.width, this.height);
    // }
  }

  // This function was written with the help of AI to update the image of the character and store it in local storage

  updateImage(img) {
    if (img instanceof p5.Image) {
      const base64String = img.canvas.toDataURL();
      characterData[this.type] = base64String;
      this.img = img;
    } else if (typeof img === "string") {
      this.img = loadImage(img);
      characterData[this.type] = img;
    } else {
      console.warn("Unrecognized image type:", img);
    }
    localStorage.setItem("characterData", JSON.stringify(characterData));
    SaveCharData();
  }
}

// localStorage.clear();
