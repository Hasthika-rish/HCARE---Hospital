
let cart = []; // array to hold the cart items


async function fetchMedicines() {//function to fetch and display medicines from JSON file
   
        const response = await fetch("JavaScript/medicines.json"); // fetch data from JSON file


        const data = await response.json(); //converts JSON data into a javascript object
       
         displayCategories(data.categories); //calls the function to display medicines 
         loadCartQuantities(); // syncs cart quantities with displayed items
    
}


function displayCategories(categories) {// Function to display display medicines and details with a parameter
    const medicinesSection = document.getElementById("medicines-section"); // store the div element in a variable

    categories.forEach((category) => {//loop to create div element for medicines in JSON file
        const categoryContainer = document.createElement("div"); // dynamically create div element
        categoryContainer.classList.add("category-container"); // to add css  to the dynamically creating div

        category.items.forEach((item) => { //loop for each medicine in category  (item) => represents the current medicine being processed
            const card = document.createElement("div"); // create a div element for each medicine
            card.classList.add("medicine-card"); //adds css to the specified class
            card.innerHTML = ` 
                <img src="${item.img}" alt="${item.name}" class="medicine-img">                                  
                <h3>${item.name}</h3>
                <p>Price: ${item.currency}${item.price} /= </p>
                <div class="quantity-controls">
                    <label for="quantity-${item.name}">Enter Quantity:</label>
                    <input type="number" min="0" id="quantity-${item.name}" value="0" class="quantity-input">
                </div>
                <button class="add-to-cart" data-name="${item.name}" data-price="${item.price}">Add to Cart</button>
            `; //  dynamically creating html structure for each medicine cards.
            categoryContainer.appendChild(card); //adds the medicine card to the category container
        });

        medicinesSection.appendChild(categoryContainer); // adds the category container with all item cards to the main div section
    });
}


function addToCart(name, price, quantity) { // Function to add items to the cart
    if (quantity <= 0) { // check the quantity is invalid (zero or negative) value
        alert("Enter a Valid Quantity."); //alert if an item is adding to cart with invalid  quantity
        return; //exits the function
    }

    const existingItem = cart.find(item => item.name === name); //find:array method to check if the item name already exists in the cart and store it in a variable

    if (existingItem) { 
        existingItem.quantity += quantity; //if item is already exists,only its quantity is updated
        existingItem.subtotal = existingItem.quantity * existingItem.price; //subtotal is recalculated
    } else {
        cart.push({ //if item is not exists,then item is added to the cart  using push method
            name,                    // : name of the item,
            price,                    //  : unit price of the item,
            quantity,                 //  : input quantitiy
            subtotal: price * quantity  //: subtotal is added 
        });
    }

    updateCart(); //refreshes the cart display
    updateQuantityDisplay(name); //update the quantity with the corresponding medicine name
}


function updateCart() { // Function to update the cart table and total price
    const cartTable = document.getElementById("cart-table").getElementsByTagName('tbody')[0];
    const totalPriceElement = document.getElementById("total-price");

    cartTable.innerHTML = ""; // clears the cart table by setting it to an empty string.

    let totalPrice = 0; //initially total price is set to 0

    cart.forEach((item,index) => { //iterate over each item in cart 
        const row = cartTable.insertRow(); //insertrow : creates a new row, 
        row.innerHTML = ` 
            <td>${item.name}</td>
            <td>LKR ${item.price} /=</td>
            <td>${item.quantity}</td>
            <td>LKR ${item.subtotal} /=</td>
          <td><button class="remove-from-cart" data-index="${index}">Remove</button></td>
        `; //innerHTML : to dynamically populate it with medicine details
        totalPrice += item.subtotal; //updates total price with subtotal
    });

    totalPriceElement.textContent = `LKR ${totalPrice} /=`; // display the total price is speicifed table data section


    
    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart data to localStorage
    document.querySelectorAll(".remove-from-cart").forEach(button => { //select all elements in the selected class and fetch remove buttons dynamically to the cart
        button.addEventListener("click", event => { 
            const index = parseInt(event.target.getAttribute("data-index"), 10); //Fetches the value of the specified attribute (data-index) from the clicked button.
            removeFromCart(index); //calls the function to remove specific index location
        });
    });




}
function removeFromCart(index) { 
    cart.splice(index, 1); // Remove the item at the specified index
    updateCart(); // update the cart after removal
}


function updateQuantityDisplay(name) { // Function to update the quantity display on the medicine card
    const quantityInput = document.querySelector(`#quantity-${name}`); //querySelector : selects an input element based on its unique ID
    const item = cart.find(item => item.name === name); //searches through the cart array and returns the first item where the condition (item.name === name) is true.
    if (quantityInput) {
        quantityInput.value = item ? item.quantity : 0;  //If the item exists in the cart, the quantity is displayed; otherwise, it resets to 0.
    } // item ? item.quantitiy : 0; ==>ternary operator
}


function loadCartFromLocalStorage() { // Function to load cart data from localStorage
    const storedCart = JSON.parse(localStorage.getItem('cart')); //retrive from local storage fetches cart data.(JSON.parse) converts it back into an array
    if (storedCart && Array.isArray(storedCart) && storedCart.length > 0) { //  cart data load from local storage could be null , undefined or an array
        cart = storedCart; //variable to manage shopping cart
        updateCart(); // update the cart display with the loaded data
    } else {// Clear data if no valid cart is found (null or undefined)
        
        cart = []; //resets cart
        const cartTable = document.getElementById("cart-table").getElementsByTagName('tbody')[0]; //selects the tbody element inside table
        cartTable.innerHTML = ""; // Clear the rows inside table
        document.getElementById("total-price").textContent = "LKR 0 /="; // Resets the total price
        localStorage.removeItem('cart'); // Clear the cart data from localStorage
    }
}


function loadCartQuantities() { // Function to sync quantities on the page with the cart
    cart.forEach(item => { //foreach loop to iterate through each medicine in cart
        updateQuantityDisplay(item.name); //update the quantitiy with corresponding medicine name
    });
}


function saveFavourites() {  // Function to save the current cart as favourites
    if (cart.length === 0) { //if the cart is empty
        alert("Warning!, Empty Cart"); //alert
        return; //exits from the function
    }
    localStorage.setItem('favourites', JSON.stringify(cart)); //store in the identifier('favourites') after converting to a JSON data using (stringfy)
    alert("Cart Saved Successfully"); //alert a message
}


function applyFavourites() {// Function to apply favourites to the cart
    const favourites = JSON.parse(localStorage.getItem('favourites'));//get the data from identifier in the local storage and converts it in to an object
    if (favourites && Array.isArray(favourites) && favourites.length > 0) { //ensure that the return value from localstorage is not null or undefined or favourites is an array
        cart = favourites; // Replace current cart with favourites
        updateCart(); // Update the cart table
        loadCartQuantities(); // Sync quantities on the page
        alert("Favourites applied to your cart");
    } else {
        alert("No favourites saved. Please save items to favourites first.");//alert if cart is empty
    }
}


document.addEventListener("DOMContentLoaded", () => {// Attach event listeners for adding items to the cart
    cart = []; // Clear the cart on page load
    fetchMedicines(); //populates the page with a list of available medicines.

    
    const addToFavouritesButton = document.getElementById("add-to-favourites");
     
    addToFavouritesButton.addEventListener("click", saveFavourites); // Event listener for "Add to Favourites"


    
    const applyFavouritesButton = document.getElementById("apply-favourites");
    
        applyFavouritesButton.addEventListener("click", applyFavourites); // Event listener for "Apply Favourites"
    

    
    document.addEventListener("click", (event) => { // Attach event listener to all add-to-cart buttons
        if (event.target.classList.contains("add-to-cart")) {  //check if the clicked element has the class (add-to-cart)
            const name = event.target.getAttribute("data-name"); // retrieve medicine name from clicked button
            const price = parseFloat(event.target.getAttribute("data-price")); //Retrieves and converts the data-price attribute (medicine price) to a floating-point number.

            const quantityInput = document.querySelector(`#quantity-${name}`); //selects the quantity input field associated with the meidicine using its unique id 
            const quantity = parseInt(quantityInput.value, 10); //converts input value to an integer

            if (isNaN(quantity) || quantity < 0) { //check if the input is not a valid number and value is not negative
                alert("Enter a Valid Quantity."); //alert if the value is negative or zero
                return; //exits from the function if the value is true
            }

            addToCart(name, price, quantity); //calls addToCart function to add item to the cart with the specified details.
        }
    });
});
