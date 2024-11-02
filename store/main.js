let itemWidth = 64;
let itemHeight = 64;
// Arrays to store categorized items
let hats = [];
let armor = [];
let weaponsArr = [];
let weapons = [];
let boots = [];
let gloves = [];
let inventory = [];
let stats = {
  stealth: 0, // Initial stealth level
  defense: 0, // Initial defense level
  shootingSpeed: 0, // Initial shooting speed level
  speed: 0, // Initial speed level
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
let currency=500;
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

function SaveCharData() {


  // Collect all items into one array
  const allItems = [...hats, ...armor, ...weapons, ...boots];

  // Map over all items to save their state
  const itemsData = allItems.map(item => {
    return {
      id: item.id,
      category: item.category,
      purchased: item.purchased,
      equipped: item.equipped
    };
  });

  const data = {
    characterData,
    stats,
    currency,
    itemsData // Save the state of all items
  };

  localStorage.setItem("gameData", JSON.stringify(data));
  console.log("Data saved to localStorage:", data);
}

function loadItemsFromSpriteSheet() {
  hats = [
    {
      id: 'hat0',
      img: extractItem(0, 1),
      category: "hats",
      name: "Shadow Hood",
      effect: "+10 Stealth",
      stealth: 10,
      cost: 15,
    },
    {id: 'hat1',
      img: extractItem(0, 2),
      category: "hats",
      name: "Hunter's Cap",
      effect: "+20 Stealth",
      stealth: 20,
      cost: 25,
    },
    {id: 'hat2',
      img: extractItem(0, 3),
      category: "hats",
      name: "Knight's Helm",
      effect: "+30 Stealth",
      stealth: 30,
      cost: 35,
    },
    {id: 'hat3',
      img: extractItem(0, 4),
      category: "hats",
      name: "Mystic Crown",
      effect: "+40 Stealth",
      stealth: 40,
      cost: 50,
    },
  ];

  armor = [
    {id: 'armor0',
      img: extractItem(1, 0),
      category: "armor",
      name: "Leather Vest",
      effect: "+10 Defense",
      defense: 10,
      cost: 20,
    },
    {id: 'armor1',
      img: extractItem(1, 1),
      category: "armou",
      name: "Chainmail",
      effect: "+20 Defense",
      defense: 20,
      cost: 40,
    },
    {id: 'armor2',
      img: extractItem(1, 2),
      category: "armor",
      name: "Plate Armor",
      effect: "+30 Defense",
      defense: 30,
      cost: 60,
    },
    {id: 'armor3',
      img: extractItem(1, 3),
      category: "armor",
      name: "Dragon Armor",
      effect: "+40 Defense",
      defense: 40,
      cost: 80,
    },
    {id: 'armor4',
      img: extractItem(1, 4),
      category: "armor",
      name: "Titanium Suit",
      effect: "+50 Defense",
      defense: 50,
      cost: 100,
    },
  ];

  weapons = [
    {id: 'weapon0',
      img: weaponsArr[0],
      category: "weapons",
      name: "Steel Fang",
      effect: "+5 Damage",
      damage: 5,
      cost: 20,
    },
    {id: 'weapon01',
      img: weaponsArr[1],
      category: "weapons",
      name: "Viper Strike",
      effect: "+10 Damage",
      damage: 10,
      cost: 35,
    },
    {id: 'weapon2',
      img: weaponsArr[2],
      category: "weapons",
      name: "Nightfall",
      effect: "+20 Damage",
      damage: 20,
      cost: 50,
    },
    {id: 'weapon3',
      img: weaponsArr[3],
      category: "weapons",
      name: "Thunderbolt",
      effect: "+15 Damage",
      damage: 15,
      cost: 65,
    },
    {id: 'weapon4',
      img: weaponsArr[4],
      category: "weapons",
      name: "Dragon's Fury",
      effect: "+40 Damage",
      damage: 40,
      cost: 120,
    },
  ];

  boots = [
    {id: 'boots0',
      img: extractItem(4, 0),
      category: "boots",
      name: "Sandals",
      effect: "+10 Speed",
      speed: 10,
      cost: 10,
    },
    {id: 'boots1',
      img: extractItem(4, 1),
      category: "boots",
      name: "Leather Boots",
      effect: "+20 Speed",
      speed: 20,
      cost: 20,
    },
    {id: 'boots2',
      img: extractItem(4, 2),
      category: "boots",
      name: "Winged Boots",
      effect: "+30 Speed",
      speed: 30,
      cost: 40,
    },
    {id: 'boots3',
      img: extractItem(4, 3),
      category: "boots",
      name: "Rocket Boots",
      effect: "+40 Speed",
      speed: 40,
      cost: 60,
    },
    {id: 'boots4',
      img: extractItem(4, 4),
      category: "boots",
      name: "Sonic Boots",
      effect: "+50 Speed",
      speed: 50,
      cost: 90,
    },
  ];
}
function LoadCharData() {

  const dataString = localStorage.getItem("gameData");

  if (dataString) {
    const data = JSON.parse(dataString);
    console.log("Parsed data:", data);

    characterData = data.characterData || characterData;
    stats = data.stats || stats;
    currency = data.currency !== undefined ? data.currency : 500;

    // Restore item states
    if (data.itemsData) {
      const allItems = [...hats, ...armor, ...weapons, ...boots];
      data.itemsData.forEach(savedItem => {
        const item = allItems.find(i => i.id === savedItem.id);
        if (item) {
          item.purchased = savedItem.purchased;
          item.equipped = savedItem.equipped;
        }
      });
    }

    document.getElementById("currencyAmount").textContent = currency;
    updateStatsBars();
    displayInventory();
  } else {
    console.log("No saved data found. Initializing with default values.");
    currency = 500;
    SaveCharData();
  }
}





function setup() {
  console.log("Setup function is running...");
  createCanvas(windowWidth, windowHeight);
  // Check if LoadCharData is defined before calling it
  // function SaveCharData() {
  //   console.log("SaveCharData function is running...");
  //   if (currency === undefined) {
  //     console.warn("Currency is undefined; setting to 0.");
  //     currency = 0;
  //   }
  //   const inventoryData = inventory.map((item) => {
  //     const imgSrc = item.img?.canvas
  //       ? item.img.canvas.toDataURL()
  //       : item.img?.src;
  //     return {
  //       category: item.category,
  //       name: item.name,
  //       cost: item.cost,
  //       effect: item.effect,
  //       imgSrc: imgSrc,
  //     };
  //   });

  //   const data = {
  //     characterData,
  //     stats,
  //     currency,
  //     inventory: inventoryData,
  //   };

  //   localStorage.setItem("gameData", JSON.stringify(data));
  //   console.log("Data saved to localStorage:", data);

  //   if (!currency) {
  //     console.log("no currency");
  //   }
  //   console.log("cuurency", currency);
  // }

  // function LoadCharData() {
  //   console.log("Attempting to load character data...");
  //   const data = JSON.parse(localStorage.getItem("gameData"));
  //   if (data) {
  //     console.log("Loaded data from localStorage:", data);

  //     characterData = data.characterData || characterData;
  //     stats = data.stats || stats;
  //     currency = data.currency !== undefined ? data.currency : 500;
  //     console.log("Loaded currency:", currency);
  //     document.getElementById("currencyAmount").textContent = currency;

  //     inventory = [];

  //     const loadImagePromises = data.inventory.map((item) => {
  //       return new Promise((resolve) => {
  //         loadImage(
  //           item.imgSrc,
  //           (loadedImage) => {
  //             resolve({
  //               ...item,
  //               img: loadedImage,
  //             });
  //           },
  //           () => {
  //             console.warn("Failed to load image for item:", item.name);
  //             resolve({
  //               ...item,
  //               img: null,
  //             });
  //           }
  //         );
  //       });
  //     });

  //     Promise.all(loadImagePromises).then((loadedInventory) => {
  //       inventory = loadedInventory;
  //       displayInventory();
  //     });

  //     updateStatsBars();
  //     document.getElementById("currencyAmount").textContent = currency;
  //   } else {
  //     console.log("No saved data found. Initializing with default currency.");
  //     currency = 500;
  //     SaveCharData();
  //   }
  // }
  // currency = localStorage.getItem("currency");
  // SaveCharData();
  loadItemsFromSpriteSheet();
  LoadCharData();


  // Select elements
  const itemsContainer = document.getElementById("itemsContainer");
  const categoryNameDisplay = document.getElementById("categoryName");

  // if (itemsContainer && categoryNameDisplay) {
  //   displayStore(); // Display initial items
  //   displayNavigationArrows();
  // } else {
  //   console.error("Error: Required DOM elements not found.");
  // }

  hatArea = new ClickAreas(width / 4 - 240, height / 2 - 170, 140, 120, "hats");
  armorArea = new ClickAreas(
    width / 4 - 295,
    height / 2 - 70,
    220,
    200,
    "armor"
  );
  bootsArea = new ClickAreas(
    width / 4 - 255,
    height / 2 + 295,
    10,
    140,
    "boots"
  );
  weaponArea = new ClickAreas(
    width / 4 - 220,
    height / 2 + 170,
    200,
    150,
    "weapons"
  );

  // Add clickable areas to the array
  clickBoxes = [hatArea, armorArea, bootsArea, weaponArea];
  clickBoxes.push(hatArea, armorArea, bootsArea, weaponArea);
  displayStore(selectedCategory);
  displayInventory();
}

function draw() {
  // Draw rectangles with debugging logs
  rectMode(CENTER);
  fill(255, 0, 0); // Red, semi-transparent for visibility

  // rect(width / 4 -80, height / 2 - 120, 100, 50); // Hat area
  // Update and display equipped items in clickBoxes
  // Create the soldier image element
  // if (!document.getElementById("character")) {
  //   let characterImgEL = document.createElement("img");
  //   characterImgEL.src = characterImg.canvas.toDataURL(); // Convert p5.Image to base64
  //   characterImgEL.id = "character";
  //   characterImgEL.style.maxWidth = "100%";
  //   characterImgEL.style.height = "auto";
  //   characterImgEL.style.position = "absolute";

  //   // Append it to the character container
  //   let characterDiv = document.getElementById("characterContainer");
  //   characterDiv.appendChild(characterImgEL);
  // }
  let equippedItemsContainer = document.getElementById(
    "equippedItemsContainer"
  );
  equippedItemsContainer.innerHTML = ""; // Clear previous items to prevent stacking duplicates

  // Loop through each equipped item and add to the equipped items container
  clickBoxes.forEach((box) => {
    if (box.img) {
      let equippedImg = document.createElement("img");
      equippedImg.src = box.img.canvas.toDataURL(); // Convert to base64
      equippedImg.style.position = "absolute";
      equippedImg.style.left = `${box.x}px`; // Position item according to box coordinates
      equippedImg.style.top = `${box.y}px`;
      equippedImg.style.width = `${box.width}px`;
      equippedImg.style.height = `${box.height}px`;
      equippedImg.style.transform =
        box.type === "weapons" ? "rotate(90deg)" : ""; // Rotate weapon if needed

      equippedItemsContainer.appendChild(equippedImg); // Add to equipped items container
    }
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
}

// // Function to display currency amount
// function displayCurrency() {
//   textSize(30);
//   fill(255, 255, 255);
//   text("Money: $" + currency, 450, 50);
// }

// Max stats for each attribute
const MAX_STATS = {
  stealth: 100,
  defense: 100,
  shootingSpeed: 100,
  speed: 100,
};



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

    // Create the button for "Buy", "Equip" or "Equipped" based on item state
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
    item.purchased = true; // Mark as purchased
    item.equipped = true; // Equip upon purchase

    document.getElementById("currencyAmount").textContent = currency;
    alert(`You bought ${item.name} for $${item.cost}!`);

    // Update stats
    if (item.stealth) stats.stealth += item.stealth;
    if (item.defense) stats.defense += item.defense;
    if (item.shootingSpeed) stats.shootingSpeed += item.shootingSpeed;
    if (item.speed) stats.speed += item.speed;

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

  // Update the corresponding ClickArea with the new image
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
    SaveCharData()
  }
  SaveCharData();
}
// Function to display inventory items in the HTML
function displayInventory() {
  const armorInventoryDiv = document.getElementById("armorInventory");
  const helmetInventoryDiv = document.getElementById("helmetInventory");
  const weaponInventoryDiv = document.getElementById("weaponInventory");
  const bootsInventoryDiv = document.getElementById("bootsInventory");

  // Clear existing items
  armorInventoryDiv.innerHTML = "";
  helmetInventoryDiv.innerHTML = "";
  weaponInventoryDiv.innerHTML = "";
  bootsInventoryDiv.innerHTML = "";

  const allItems = [...hats, ...armor, ...weapons, ...boots];

  allItems.filter(item => item.equipped).forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("inventory-item");

    const img = document.createElement("img");
    img.src = item.img.canvas ? item.img.canvas.toDataURL() : item.img.src; // Use the item's image
    img.alt = item.name;
    img.style.width = "50px";
    img.style.height = "50px";
    itemDiv.appendChild(img);

    const itemName = document.createElement("p");
    itemName.textContent = item.name;
    itemDiv.appendChild(itemName);

    // Append to the correct inventory category
    switch (item.category) {
      case "armor":
        armorInventoryDiv.appendChild(itemDiv);
        break;
      case "hats":
        helmetInventoryDiv.appendChild(itemDiv);
        break;
      case "weapons":
        weaponInventoryDiv.appendChild(itemDiv);
        break;
      case "boots":
        bootsInventoryDiv.appendChild(itemDiv);
        break;
      default:
        console.warn("Unknown item category:", item);
    }
  });
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
  characterData[category] = item.img; // Store the p5.Image object directly

  // Update the image on the corresponding ClickArea
  clickBoxes.forEach((box) => {
    if (box.type === category) {
      box.updateImage(item.img); // Pass p5.Image directly to updateImage
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
    this.img = null; // Initialize without an image

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
    }
  }

  display() {
    if (this.img) {
      imageMode(CENTER);
      push();
      translate(this.x, this.y);
      if (this.type === "weapons") {
        rotate(PI / 2); // Rotate if weapon
      }
      image(this.img, 0, 0, this.width, this.height);
      pop();
    } else {
      // Draw outline if no image
      fill(255, 0, 0);
      stroke(255, 0, 0);
      rectMode(CENTER);
      rect(this.x, this.y, this.width, this.height);
    }
  }
  updateImage(img) {
    if (img instanceof p5.Image) {
      // Convert p5.Image to base64 string
      const base64String = img.canvas.toDataURL();
      characterData[this.type] = base64String; // Save base64 for localStorage
      this.img = img; // Keep the p5.Image object for display in p5.js
    } else if (typeof img === "string") {
      // Load from URL or base64 string
      this.img = loadImage(img);
      characterData[this.type] = img; // Save the URL/base64 string to character data
    } else {
      console.warn("Unrecognized image type:", img);
    }

    // Save characterData to localStorage without circular references
    localStorage.setItem("characterData", JSON.stringify(characterData));
    SaveCharData();
  }
}

// localStorage.clear();
