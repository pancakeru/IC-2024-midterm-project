let spriteSheet;
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
  createCanvas(windowWidth / 2, windowHeight / 2);
  currency = localStorage.getItem("currency");

  loadItemsFromSpriteSheet();

  // Select elements
  const itemsContainer = document.getElementById("itemsContainer");
  const categoryNameDisplay = document.getElementById("categoryName");

  if (itemsContainer && categoryNameDisplay) {
    displayStore(); // Display initial items
    displayNavigationArrows();
  } else {
    console.error("Error: Required DOM elements not found.");
  }
  currency = localStorage.getItem("currency");
}

function draw() {
  displayCurrency();
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
      { img: weaponsArr[0], name: "Leather Gloves", effect: "+5 Shooting Speed", shootingSpeed: 5, cost: 15 },
      { img: weaponsArr[1], name: "Gauntlets", effect: "+10 Shooting Speed", shootingSpeed: 10, cost: 30 },
      { img: weaponsArr[2], name: "Assassin Gloves", effect: "+20 Shooting Speed", shootingSpeed: 20, cost: 45 },
      { img: weaponsArr[3], name: "Speedster Gloves", effect: "+30 Shooting Speed", shootingSpeed: 30, cost: 70 },
      { img: weaponsArr[4], name: "Infinity Gauntlet", effect: "+40 Shooting Speed", shootingSpeed: 40, cost: 100 },
    ];
  
    boots = [
      { img: extractItem(4, 0), name: "Sandals of Swiftness", effect: "+10 Speed", speed: 10, cost: 10 },
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
    console.error("Error: itemsContainer or categoryName element not found.");
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

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("item-details");

    const buyButton = document.createElement("button");
    buyButton.classList.add("buy-button");
    buyButton.setAttribute("data-item-name", item.name); // Add data-item-name attribute
    buyButton.innerHTML = `Buy <img src="./images/coin.png" class="coin-icon" alt="coin icon"> ${item.cost}`;
    buyButton.onclick = () => buyItem(item);
    const itemEffect = document.createElement("p");
    itemEffect.classList.add("item-effect");
    itemEffect.textContent = item.effect;
    const itemCost = document.createElement("p");
    itemCost.classList.add("item-cost");
    itemCost.textContent = `Cost: $${item.cost}`;
    detailsDiv.appendChild(itemName);
    detailsDiv.appendChild(itemEffect);
    itemDiv.appendChild(img);
   detailsDiv.appendChild(buyButton);
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
    if (currency >= item.cost) {
      currency -= item.cost;
      localStorage.setItem("currency", currency);
      document.getElementById("currencyAmount").textContent = currency;
      alert(`You bought ${item.name} for $${item.cost}!`);
      
      if (item.stealth) stats.stealth += item.stealth;
      if (item.defense) stats.defense += item.defense;
      if (item.shootingSpeed) stats.shootingSpeed += item.shootingSpeed;
      if (item.speed) stats.speed += item.speed;
      item.purchased = true;
      addToInventory(item);
      updateStatsBars();
      const buyButton = document.querySelector(`button[data-item-name="${item.name}"]`);
        if (buyButton) {
            buyButton.textContent = "Purchased";
            buyButton.disabled = true;
            buyButton.classList.add("purchased");
            buyButton.style.backgroundColor = "gray";
        } else {
      alert("Not enough money to buy this item!");
    }
}
  }
  
  function addToInventory(item) {
    const inventoryDiv = document.getElementById("inventory");

    // Create an inventory item div
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("inventory-item");

    // Add item image to inventory
    const img = document.createElement("img");
    img.src = item.img.canvas.toDataURL();
    img.alt = item.name;
    itemDiv.appendChild(img);

    // Add item name
    const itemName = document.createElement("p");
    itemName.textContent = item.name;
    itemDiv.appendChild(itemName);

    // Append the item div to the inventory container
    inventoryDiv.appendChild(itemDiv);
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

// Initialize display
document.addEventListener("DOMContentLoaded", () => {
  displayStore();
  displayNavigationArrows();
});

localStorage.clear();