// function SaveCharData() {
//     console.log("SaveCharData function is running..."); 
//     if (currency === undefined) {
//         console.warn("Currency is undefined; setting to 0.");
//         currency = 0;
//     }
//     const inventoryData = inventory.map(item => {
//         const imgSrc = item.img?.canvas ? item.img.canvas.toDataURL() : item.img?.src;
//         return {
//             category: item.category,
//             name: item.name,
//             cost: item.cost,
//             effect: item.effect,
//             imgSrc: imgSrc
//         };
//     });
  
//     const data = {
//         characterData,
//         stats,
//         currency, 
//         inventory: inventoryData
//     };
  
//     localStorage.setItem("gameData", JSON.stringify(data));
//     console.log("Data saved to localStorage:", data);

//     if (!currency) {
//         console.log('no currency');
//     }
//     console.log('cuurency', currency);
//   }
  
//   function LoadCharData() {
//     console.log("Attempting to load character data...");
//     const data = JSON.parse(localStorage.getItem("gameData"));
//     if (data) {
//         console.log("Loaded data from localStorage:", data);
        
//         characterData = data.characterData || characterData;
//         stats = data.stats || stats;
//         currency = data.currency !== undefined ? data.currency : 500;
//         console.log("Loaded currency:", currency);
//         document.getElementById("currencyAmount").textContent = currency;
        
  
//         inventory = [];
  
//         const loadImagePromises = data.inventory.map(item => {
//             return new Promise((resolve) => {
//                 loadImage(item.imgSrc, (loadedImage) => {
//                     resolve({
//                         ...item,
//                         img: loadedImage
//                     });
//                 }, () => {
//                     console.warn("Failed to load image for item:", item.name);
//                     resolve({
//                         ...item,
//                         img: null 
//                     });
//                 });
//             });
//         });
  
//         Promise.all(loadImagePromises).then(loadedInventory => {
//             inventory = loadedInventory;
//             displayInventory();
//         });
        
  
//         updateStatsBars();
//         document.getElementById("currencyAmount").textContent = currency;
//     } else {
//         console.log("No saved data found. Initializing with default currency.");
//         currency = 500;
//         SaveCharData();
//     }
//   }