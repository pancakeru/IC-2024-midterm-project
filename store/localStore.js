//all the local storage stuff managed here

//function for saving the data
function SaveCharData(characterData) {
    localStorage.setItem("characterData", JSON.stringify(characterData));
}

//function for retrieving the data
function LoadCharData() {
    let data = JSON.parse(localStorage.getItem("characterData"));
    return data;
}