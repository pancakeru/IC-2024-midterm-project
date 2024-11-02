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
      selectedCategory,
      itemsData // Save the state of all items
    };
  
    localStorage.setItem("gameData", JSON.stringify(data));
    console.log("Data saved to localStorage:", data);
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
      selectedCategory = data.selectedCategory || 'hats';
      document.getElementById("currencyAmount").textContent = currency;
      updateStatsBars();
      displayInventory();
    } else {
      console.log("No saved data found. Initializing with default values.");
      selectedCategory = 'hats';
      currency = 500;
      SaveCharData();
    }
  }
  