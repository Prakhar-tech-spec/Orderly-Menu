class Cart {
    constructor() {
        this.items = [];
    }

    addItem(dish, quantity, portion = 'full') {
        const existingItem = this.items.find(item => 
            item.dish.id === dish.id && item.portion === portion
        );

        // Check if the dish has specific portion prices defined in its options
        let price = dish.price; // Default to the full price
        
        // If the dish has options with portion sizes
        if (dish.options && Array.isArray(dish.options)) {
            const portionOption = dish.options.find(opt => 
                opt.name && opt.name.toLowerCase() === portion.toLowerCase()
            );
            
            // If a matching portion option is found, use its price directly
            if (portionOption && portionOption.price) {
                price = portionOption.price;
            } else {
                // Otherwise use the calculated price based on the portion
                price = this.calculatePortionPrice(dish.price, portion);
            }
        } else {
            // If no options are defined, use the calculated price
            price = this.calculatePortionPrice(dish.price, portion);
        }

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ 
                dish, 
                quantity, 
                portion,
                price: price // Use the determined price
            });
        }
    }

    calculatePortionPrice(basePrice, portion) {
        // When a portion is selected, return only that portion's price
        // not adding to the full price
        switch(portion) {
            case 'half': return basePrice * 0.6; // 60% of the full price
            case 'quarter': return basePrice * 0.3; // 30% of the full price
            default: return basePrice; // full price
        }
    }

    // ...existing code...
}
