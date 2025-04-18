function handleAddToCart(dish) {
    const quantityInput = document.getElementById(`quantity-${dish.id}`);
    const portionSelect = document.getElementById(`portion-${dish.id}`);
    const quantity = parseInt(quantityInput.value, 10) || 1;
    const portion = portionSelect.value;
    
    // The cart.addItem method now handles portion pricing correctly
    // It will check for dish.options first, then fall back to calculated prices
    cart.addItem(dish, quantity, portion);
    
    updateCartUI();
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';

    cart.items.forEach(item => {
        const cartItemElement = document.createElement('div');
        // Display only the calculated portion price (which is already stored in item.price)
        // multiplied by the quantity
        cartItemElement.textContent = 
            `${item.dish.name} (${item.portion}) x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`;
        cartContainer.appendChild(cartItemElement);
    });
}
