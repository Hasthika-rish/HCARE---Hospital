
window.addEventListener("beforeunload", () => { // Clear the cart data from localStorage when the page is reloaded
    localStorage.removeItem("cart"); // remove cart data from local storage
});






document.addEventListener("DOMContentLoaded", () => { //Ensures that the enclosed script runs only after the DOM has fully loaded.

   
 //store elements gain from ids/tag names in variables
    const orderSummary = document.getElementById("order-summary");
    const totalAmountElement = document.getElementById("total-amount");
    const paymentMethodInputs = document.getElementsByName("payment-method");
    const cardDetails = document.getElementById("card-details");
    const codDetails = document.getElementById("cod-details");
    const billingForm = document.getElementById("billing-form");

    let totalAmount = 0;  // Initializes a variable to hold the total cost of items in the cart.

    
    const storedCart = JSON.parse(localStorage.getItem("cart")) || []; // Fetch cart data from localStorage

    // Populate the order summary with cart items
    if (storedCart.length > 0) { //check if the cart has any items
        storedCart.forEach(item => { //iterates over each item in the cart
            const itemDiv = document.createElement("div");// creates a new div element for each cart item
            itemDiv.className = 'cart-item'; //assigns a class to the new element for styling
            itemDiv.style.marginBottom = "20px"; //
            itemDiv.innerHTML = `
                
                <p><strong>Item:</strong> ${item.name}</p>
                <p><strong>Price:</strong> LKR ${item.price} /=</p>
                <p><strong>Quantity:</strong> ${item.quantity}</p>
                <p><strong>Subtotal:</strong> LKR ${item.quantity * item.price} /=</p>
            `; //display information abount purchased items
            orderSummary.appendChild(itemDiv); //append new div to the (ordersummary) element

            totalAmount += item.quantity * item.price; //Adds the subtotal of the current item to the total amount.
        });

        // Display total amount
        totalAmountElement.textContent = `Total: LKR ${totalAmount} /=`; //update the total amount for all items
        
    } else {
        totalAmountElement.textContent = "Total: LKR 0 /="; // Always update this element
        orderSummary.innerHTML = "<p>No items in the cart.</p>"; //shows that the order is empty 
    }

    // Handle payment method toggle
    paymentMethodInputs.forEach((input) => {
        input.addEventListener("change", (event) => {
            if (event.target.id === "card") {
                cardDetails.classList.remove("hidden");
                codDetails.classList.add("hidden");
                cardDetails.querySelectorAll("input").forEach(input => input.disabled = false);
            } else {
                cardDetails.classList.add("hidden");
                codDetails.classList.remove("hidden");
                cardDetails.querySelectorAll("input").forEach(input => input.disabled = true);
            }
        });
    });

    
    // Add an event listener for form submission
billingForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission behavior (page reload).

    
    const formData = new FormData(billingForm); //object to retrieve all form inputs

    
    const paymentMethod = formData.get("payment-method"); // get the selected payment method from the form data

    
    const phone = formData.get("phone");//get the phone number input

    // Parse and clear the total amount by removing any non-numeric characters
    const totalAmount = parseFloat(document.getElementById("total-amount").textContent.replace(/[^0-9.]/g, ''));//(replace): to  remove specified characters

    
    if (!formData.get("full-name") || !formData.get("address") || !phone) { // check for  all required fields  are filled
        alert("Please fill in all required fields."); // alert 
        return; // Stops the submission
    }
    if (storedCart.length === 0) { //if the cart is empty 
        alert("Your cart is empty! Please add items to your cart before placing an order.");
        return; // Stop the form submission
    }

   
    if (isNaN(phone) || phone.length !== 10) {   // check whether the phone number is numeric and 10 digits long
        alert("Invalid phone number. Enter a valid 10-digit numeric value."); // Show an alert.
        return; // Stops the  submission.
    }

   
    if (isNaN(totalAmount) || totalAmount <= 0) {  // check whether  the total amount is  a  number and greater than 0
        alert("Invalid total amount. Please check your cart."); // Show an error if the total amount is invalid.
        return; // Stop the  submission.
    }

   
    if (paymentMethod === "Card") { // If the selected payment method is Card
        const cardNumber = formData.get("card-number"); // Get the card number input.
        const expiryDate = formData.get("expiry-date"); // Get the expiry date input.
        const cvv = formData.get("cvv"); // Get the CVV input.

        // Validate the card number : 16 digits long 
        if (!cardNumber || isNaN(cardNumber) || cardNumber.length < 16) {
            alert("Invalid card number. Enter a valid 16-digit numeric value."); // Show an error if the card number is invalid.
            return; // Stop form submission.
        }

       

        // Validate the CVV: 3 digits long
        if (!cvv || isNaN(cvv) || cvv.length !== 3) {
            alert("Invalid CVV. Enter a 3-digit numeric value."); // Show an error if the CVV is invalid.
            return; // Stop form submission.
        }
    }

    
   
    // Collect the customer's details into an object
    const customerDetails = {
        fullName: formData.get("full-name"), // Customer's full name
        address: formData.get("address"), // Customer's address
        phone, // Customer's phone number
        paymentMethod, // Selected payment method
        totalAmount, // Total amount to be paid
    };
    const today = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(today.getDate() + 5); // Add 5 days to the current date 

    // Format the delivery date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', options);

    

    // Show the success message with the delivery date
    alert(`Your order has been placed successfully! 
          Your Item Will be Delivered On ${formattedDeliveryDate}`); //alert the message with corresponding delivery date

    // console.log("Order Details:", customerDetails); // show the payment in the  console. (this is for debugging purpose only)

    
    localStorage.removeItem("cart"); // Clear the cart from localStorage

    
    billingForm.reset(); // Reset the billing form to its default state

    
    window.location.href = "pharmacy.html"; // Redirect the user to the "pharmacy.html" page
});

});
