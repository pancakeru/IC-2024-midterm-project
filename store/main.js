
let itemWidth = 64;
let itemHeight = 64;
// Arrays to store categorized items
let hats = [];
let armor = [];
let weaponsArr = [];
let weapons = [];
let boots = [];
let gloves = [];
let inventory=[]
let stats = {
    stealth: 0,      // Initial stealth level
    defense: 0,      // Initial defense level
    shootingSpeed: 0, // Initial shooting speed level
    speed: 0         // Initial speed level
  };
  let characterData = {
    hats: null,
    armor: null,
    weapons: null,
    boots: null
};
let clickBoxes = [];
let selectedImg = null;
let selectedPath = null;

let hatArea, armorArea, weaponArea, bootsArea;
// Variables for tracking the selected category
let selectedCategory = "hats";
let currency;

function preload() {
  spriteSheet = loadImage("./images/armour.png");
  weaponsArr[0]= loadImage("./images/weapons/AK_full.png");
  weaponsArr[1]= loadImage("./images/weapons/Assault rifle_full.png");
  weaponsArr[2]= loadImage("./images/weapons/pistol_full.png");
  weaponsArr[3]= loadImage("./images/weapons/Shootgun_full.png");
  weaponsArr[4]= loadImage("./images/weapons/USI_full.png");
  if (localStorage.getItem("currency") == null) {
    localStorage.setItem("currency", 500);
  }
}

function setup() {
  createCanvas(windowWidth , windowHeight );
  currency = localStorage.getItem("currency");

  loadItemsFromSpriteSheet();

  // Select elements
  const itemsContainer = document.getElementById("itemsContainer");
  const categoryNameDisplay = document.getElementById("categoryName");

  // if (itemsContainer && categoryNameDisplay) {
  //   displayStore(); // Display initial items
  //   displayNavigationArrows();
  // } else {
  //   console.error("Error: Required DOM elements not found.");
  // }
  currency = localStorage.getItem("currency");
  hatArea = new ClickAreas(width / 4 -80, height / 2 - 120, 130, 80, "hats");
  armorArea = new ClickAreas(width / 4 - 80, height / 2 + 50, 180, 200, "armor");
  bootsArea = new ClickAreas(width / 4 -90 , height / 2 + 390, 180, 150, "boots");
  weaponArea = new ClickAreas(width / 4 - 50, height / 2 + 170, 100, 50, "weapons");

  // Add clickable areas to the array
  clickBoxes = [hatArea, armorArea, bootsArea, weaponArea];
  clickBoxes.push(hatArea, armorArea, bootsArea, weaponArea);
  displayStore(selectedCategory);
}

function draw() {
// function draw() {
  background(120, 150, 180); // Add a clear background color for visibility

  // console.log(`Canvas dimensions: width = ${width}, height = ${height}`);

  // Display currency
  displayCurrency();

  // Draw rectangles with debugging logs
  rectMode(CENTER);
  fill(255, 0, 0); // Red, semi-transparent for visibility

  
  // rect(width / 4 -80, height / 2 - 120, 100, 50); // Hat area
  // Update and display equipped items in clickBoxes
  for (let box of clickBoxes) {
    box.display();
  }
}

function mousePressed() {
  for (let box of clickBoxes) {
      box.checkClick();
  }
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
}

// Function to display currency amount
function displayCurrency() {
  textSize(30);
  fill(255, 255, 255);
  text("Money: $" + currency, 450, 50);
}

// Max stats for each attribute
const MAX_STATS = {
    stealth: 100,
    defense: 100,
    shootingSpeed: 100,
    speed: 100
  };
  
  function loadItemsFromSpriteSheet() {
    hats = [
      { img: extractItem(0, 1), name: "Shadow Hood", effect: "+10 Stealth", stealth: 10, cost: 15 },
      { img: extractItem(0, 2), name: "Hunter's Cap", effect: "+20 Stealth", stealth: 20, cost: 25 },
      { img: extractItem(0, 3), name: "Knight's Helm", effect: "+30 Stealth", stealth: 30, cost: 35 },
      { img: extractItem(0, 4), name: "Mystic Crown", effect: "+40 Stealth", stealth: 40, cost: 50 },
    ];
  
    armor = [
      { img: extractItem(1, 0), name: "Leather Vest", effect: "+10 Defense", defense: 10, cost: 20 },
      { img: extractItem(1, 1), name: "Chainmail", effect: "+20 Defense", defense: 20, cost: 40 },
      { img: extractItem(1, 2), name: "Plate Armor", effect: "+30 Defense", defense: 30, cost: 60 },
      { img: extractItem(1, 3), name: "Dragon Armor", effect: "+40 Defense", defense: 40, cost: 80 },
      { img: extractItem(1, 4), name: "Titanium Suit", effect: "+50 Defense", defense: 50, cost: 100 },
    ];
  
    weapons = [
      { img: weaponsArr[0], name: "Steel Fang", effect: "+5 Damage", damage: 5, cost: 20 },
      { img: weaponsArr[1], name: "Viper Strike", effect: "+10 Damage", damage: 10, cost: 35 },
      { img: weaponsArr[2], name: "Nightfall", effect: "+20 Damage", damage: 20, cost: 50 },
      { img: weaponsArr[3], name: "Thunderbolt", effect: "+15 Damage", damage: 15, cost: 65 },
      { img: weaponsArr[4], name: "Dragon's Fury", effect: "+40 Damage", damage: 40, cost: 120 },
    ];
    
  
    boots = [
      { img: extractItem(4, 0), name: "Sandals", effect: "+10 Speed", speed: 10, cost: 10 },
      { img: extractItem(4, 1), name: "Leather Boots", effect: "+20 Speed", speed: 20, cost: 20 },
      { img: extractItem(4, 2), name: "Winged Boots", effect: "+30 Speed", speed: 30, cost: 40 },
      { img: extractItem(4, 3), name: "Rocket Boots", effect: "+40 Speed", speed: 40, cost: 60 },
      { img: extractItem(4, 4), name: "Sonic Boots", effect: "+50 Speed", speed: 50, cost: 90 },
    ];
  }
  
  

// Extract specific item from the sprite sheet
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

  itemsContainer.innerHTML = ""; // Clear the current items
  categoryNameDisplay.textContent = capitalize(selectedCategory); // Display the selected category

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
          img.style.width = "150px"; // Adjust width for weapon images
          img.style.height = "150px"; // Adjust height for weapon images
      } else {
          img.style.width = "64px"; // Default size for other items
          img.style.height = "64px"; // Default size for other items
      }

      const detailsDiv = document.createElement("div");
      detailsDiv.classList.add("item-details");

      const itemEffect = document.createElement("p");
      itemEffect.classList.add("item-effect");
      itemEffect.textContent = item.effect;

      const itemCost = document.createElement("p");
      itemCost.classList.add("item-cost");
      itemCost.textContent = `Cost: $${item.cost}`;

      // Create the button for "Buy", "Equip" or "Equipped" based on item state
      const actionButton = document.createElement("button");
      actionButton.classList.add("buy-button");
      actionButton.setAttribute("data-item-name", item.name); 
      if (item.purchased) {
        // If item is already purchased, show "Equip" or "Equipped"
        if (item.equipped) {
            actionButton.textContent = "Equipped";
            actionButton.disabled = true; // Disable the button if already equipped
            actionButton.classList.add("equipped");
        } else {
            actionButton.textContent = "Equip";
            actionButton.onclick = () => equipItem(item, selectedCategory); // Equip if not equipped yet
        }
    } else {
        // Show "Buy" button and set the click action to purchase
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


function updateStatsBars() {
    document.getElementById("stealthBar").querySelector(".fill").style.width = (stats.stealth / MAX_STATS.stealth * 100) + "%";
    document.getElementById("defenseBar").querySelector(".fill").style.width = (stats.defense / MAX_STATS.defense * 100) + "%";
    document.getElementById("shootingSpeedBar").querySelector(".fill").style.width = (stats.shootingSpeed / MAX_STATS.shootingSpeed * 100) + "%";
    document.getElementById("speedBar").querySelector(".fill").style.width = (stats.speed / MAX_STATS.speed * 100) + "%";
  }
  
  function buyItem(item) {
    if (item.purchased) {
      console.log(`${item.name} is already purchased.`);
      equipItem(item, selectedCategory); // Equip directly if already purchased
      return;
  }

    if (currency >= item.cost) {
        currency -= item.cost;
        localStorage.setItem("currency", currency);
        document.getElementById("currencyAmount").textContent = currency;
        alert(`You bought ${item.name} for $${item.cost}!`);

        // Update stats if the item has stat bonuses
        if (item.stealth) stats.stealth += item.stealth;
        if (item.defense) stats.defense += item.defense;
        if (item.shootingSpeed) stats.shootingSpeed += item.shootingSpeed;
        if (item.speed) stats.speed += item.speed;

        item.purchased = true;
        equipItem(item, selectedCategory); // Automatically equip the item upon purchase

        updateStatsBars();

        // Update the button to show "Equipped" if purchased
        const buyButton = document.querySelector(`button[data-item-name="${item.name}"]`);
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
  // Deselect the currently equipped item in the same category
  deselectPreviousItem(category);

  // Mark the item as equipped
  item.equipped = true;
  addToInventory(item, category); // Add the item to the inventory

  // Update button to show "Equipped"
  const equipButton = document.querySelector(`button[data-item-name="${item.name}"]`);
  if (equipButton) {
      equipButton.textContent = "Equipped";
      equipButton.disabled = true; // Disable the button for the currently equipped item
  }

  // Update click box for the soldier
  clickBoxes.forEach(box => {
      if (box.type === category) {
          box.updateImage(item.img.canvas ? item.img.canvas.toDataURL() : item.img.src); // Set image in the click area
      }
  });
  characterData[category] = item.img.canvas ? item.img.canvas.toDataURL() : item.img.src;
  localStorage.setItem("characterData", JSON.stringify(characterData));
}



function deselectPreviousItem(category) {
  const itemsArray = getItemsForCategory(category);
  itemsArray.forEach((item) => {
      if (item.equipped) {
          item.equipped = false;
          const button = document.querySelector(`button[data-item-name="${item.name}"]`);
          if (button) {
              button.textContent = "Equip";
              button.disabled = false; // Allow re-equipping of this item
              button.classList.remove("equipped"); // Reset styling
          }
      }
  });
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
    // Remove the previous item, but keep the <h3> header
    const previousItem = categoryDiv.querySelector(".inventory-item");
    if (previousItem) {
      previousItem.remove();
    }

    // Create a new div for the item
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("inventory-item");

    // Add item image to inventory
    const img = document.createElement("img");
    img.src = item.img.canvas ? item.img.canvas.toDataURL() : item.img.src; 
    img.alt = item.name;
    img.style.width = "50px";
    img.style.height = "50px";
    itemDiv.appendChild(img);

    // Add item name
    const itemName = document.createElement("p");
    itemName.textContent = item.name;
    itemDiv.appendChild(itemName);

    // Set up the click event to equip the item on the soldier
    itemDiv.onclick = () => equipItemOnSoldier(item, category);

    // Append the new item div to the category container
    categoryDiv.appendChild(itemDiv);
  }
}



// Create and display navigation arrows
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
  characterData[category] = item.img; // Save the p5.Image object directly for use

  // Update the image on the correct clickBox
  clickBoxes.forEach(box => {
    if (box.type === category) {
      box.updateImage(item.img); // Pass p5.Image to updateImage
    }
  });

  // Save character data for persistence
  localStorage.setItem("characterData", JSON.stringify(characterData));
}

class ClickAreas {
  constructor(x, y, width, height, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;

    // Load the equipped image if already in characterData
    this.img = characterData[this.type] ? loadImage(characterData[this.type]) : null;
  
  }

  // Check if a click is within this area
  checkClick() {
    if (mouseX > this.x - this.width / 2 && mouseX < this.x + this.width / 2 &&
        mouseY < this.y + this.height / 2 && mouseY > this.y - this.height / 2) {
      selectedCategory = this.type;
      
      displayStore(); // Show items from the selected category
    }
  }

  // Display equipped item image or an outline for debugging
  display() {
    if (this.img) {
      imageMode(CENTER);
      image(this.img, this.x, this.y, this.width, this.height); // Draw the equipped item
    } else {
      // Draw red outline if no image is equipped
      noFill();
      stroke(255, 0, 0);
      rectMode(CENTER);
      rect(this.x, this.y, this.width, this.height);
    }
  }

  // Update image for the click area when a new item is equipped
  updateImage(img) {
    this.img = img;
    characterData[this.type] = img; // Save to character data for persistence
    localStorage.setItem("characterData", JSON.stringify(characterData));
    console.log(`Updated ${this.type} with image: ${img}`); 
  }
}


localStorage.clear();