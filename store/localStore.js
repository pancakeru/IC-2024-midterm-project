//all the local storage stuff managed here

//function for saving the data
function SaveCharData(data) {
    localStorage.setItem("characterData", JSON.stringify(data));
}


//function for retrieving the data
function LoadCharData() {
    let data = JSON.parse(localStorage.getItem("characterData"));
    return data || null; // Return null if no data is found
}
