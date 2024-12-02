
//js for toggle menu

var MenuItems = document.getElementById("MenuItems");
MenuItems.style.maxHeight = "0px"
function menutoggle(){
    if(MenuItems.style.maxHeight == "0px")
    {
        MenuItems.style.maxHeight = "700px";
    }
    else
    {
        MenuItems.style.maxHeight = "0px";
    }
}



// Function to search items by location
function searchByLocation() {
    var locationSearch = document.getElementById("locationSearch").value.toLowerCase();
    var itemCards = document.querySelectorAll(".col-44");

    for (var i = 0; i < itemCards.length; i++) {
        var locationText = itemCards[i].querySelector("h4:nth-child(4)").textContent.toLowerCase();
        if (locationText.includes(locationSearch)) {
            itemCards[i].style.display = "block";
        } else {
            itemCards[i].style.display = "none";
        }
    }
}


// Function to search items by title
function searchByTitle() {
    var titleSearch = document.getElementById("titleSearch").value.toLowerCase();
    var itemCards = document.querySelectorAll(".col-44");

    for (var i = 0; i < itemCards.length; i++) {
        var titleText = itemCards[i].querySelector("h4:nth-child(3)").textContent.toLowerCase();
        if (titleText.includes(titleSearch)) {
            itemCards[i].style.display = "block";
        } else {
            itemCards[i].style.display = "none";
        }
    }
}



/*
// Check if local storage is supported by the browser
if (typeof(Storage) !== 'undefined') {
    // Retrieve the current visit count from local storage
    let visitCount = localStorage.getItem('visitCount');

    // If this is the first visit (visitCount is null), set it to 1
    if (visitCount === null) {
        visitCount = 1;
    } else {
        // If not the first visit, increment the visit count
        visitCount = parseInt(visitCount) + 1;
    }

    // Update the visit count in local storage
    localStorage.setItem('visitCount', visitCount);

    // Display the visit count in the placeholder element
    const visitCountDisplay = document.getElementById('visitCountDisplay');
    visitCountDisplay.innerHTML = '<p>You have visited this web app ' + visitCount + ' time(s).</p>';
} else {
    // If local storage is not supported, display an error message
    const visitCountDisplay = document.getElementById('visitCountDisplay');
    visitCountDisplay.innerHTML = '<p>Sorry, your browser does not support local storage, so we cannot track your visits.</p>';
}

*/