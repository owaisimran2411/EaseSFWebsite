document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(sessionStorage.getItem('cart') || '{}'); // Initialize cart from session storage or empty object

    function updateCartButton(productId) {
        const cartControls = document.getElementById(`cart-controls-${productId}`);
        if (cart[productId]>0) {
            cartControls.innerHTML = `
                <div class="quantity-controls">
                    <button class="btn btn-sm btn-secondary minus-item" data-product-id="${productId}">-</button>
                    <span class="quantity-value">${cart[productId]}</span>
                    <button class="btn btn-sm btn-secondary plus-item" data-product-id="${productId}">+</button>
                </div>
            `;
        } else {
            cartControls.innerHTML = `<button class="btn btn-sm btn-primary add-to-cart" data-product-id="${productId}">Add to Cart</button>`;
        }
    }

    function saveCart() {
        sessionStorage.setItem('cart', JSON.stringify(cart));
    }

    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const productId = card.getAttribute('data-product-id');
        updateCartButton(productId);
    });

     document.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart')) {
            const productId = event.target.getAttribute('data-product-id');
            if (!cart[productId] || cart[productId]<0) {
                cart[productId] = 1;
            }
          updateCartButton(productId);
          saveCart();

        } else if (event.target.classList.contains('plus-item')) {
            const productId = event.target.getAttribute('data-product-id');
            cart[productId]++;
            updateCartButton(productId);
            saveCart();
        }  else if (event.target.classList.contains('minus-item')) {
             const productId = event.target.getAttribute('data-product-id');
             if(cart[productId]>1){
                cart[productId]--;
             } else {
              delete cart[productId];
             }
            updateCartButton(productId);
            saveCart();

        }
    });
});