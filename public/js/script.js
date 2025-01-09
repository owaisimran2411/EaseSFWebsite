document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(sessionStorage.getItem('cart') || '{}');
    const productContainer = document.getElementById('productContainer');
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modal-product-details');
    const modalCartControls = document.getElementById('modal-cart-controls');
    const closeBtn = document.querySelector('.close');

    function updateCartButton(productId, elementId = `cart-controls-${productId}`) {
        const cartControls = document.getElementById(elementId);
        if (cart[productId] > 0) {
            cartControls.innerHTML = `
                <div class="quantity-controls">
                    <button class="btn btn-sm btn-secondary minus-item" data-product-id="${productId}">-</button>
                    <span class="quantity-value">${cart[productId]}</span>
                    <button class="btn btn-sm btn-secondary plus-item" data-product-id="${productId}">+</button>
                </div>
            `;
        } else {
            cartControls.innerHTML = `<button class="btn btn-sm btn-primary add-to-cart w-100" data-product-id="${productId}">
                                      <i class="fas fa-cart-plus"></i>
                                      <span>Add to Cart</span>
                                   </button>`;
        }
    }

    function saveCart() {
        sessionStorage.setItem('cart', JSON.stringify(cart));
    }

    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const productId = card.getAttribute('data-product-id');
        updateCartButton(productId);
        card.addEventListener('click', (e) => {
            e.preventDefault();
            if(!e.target.closest('.cart-controls')) {
                openProductModal(productId);
            }
        });
    });

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart')) {
             const productId = event.target.getAttribute('data-product-id');
            if (!cart[productId] || cart[productId] < 0) {
                cart[productId] = 1;
            }
            updateCartButton(productId);
            updateCartButton(productId,`modal-cart-controls`)
            saveCart();

        } else if (event.target.classList.contains('plus-item')) {
           const productId = event.target.getAttribute('data-product-id');
            cart[productId]++;
            updateCartButton(productId);
            updateCartButton(productId,`modal-cart-controls`)
            saveCart();
        } else if (event.target.classList.contains('minus-item')) {
           const productId = event.target.getAttribute('data-product-id');
            if (cart[productId] > 1) {
                cart[productId]--;
            } else {
                delete cart[productId];
            }
            updateCartButton(productId);
           updateCartButton(productId,`modal-cart-controls`)
           saveCart();
        }
    });

    function openProductModal(productId) {
        modal.style.display = 'block';
        fetch(`/user/product/${productId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(product => {
                modalContent.innerHTML = `
                    <h2>${product.name}</h2>
                     <img src="${product.coverImage}" style="max-width: 100%; height: auto; max-height: 300px" alt="${product.name}">
                    <p>${product.description}</p>
                    <p>Category: <strong>${product.category}</strong></p>
                    
                     <p class="product-price" >Price: $${product.price}</p>
                  `;
                updateCartButton(productId,`modal-cart-controls`);
                modalCartControls.setAttribute('data-product-id', productId)


            })
            .catch(error => {
                console.error('Error fetching product details:', error);
                modalContent.innerHTML = "<p>Failed to load product details.</p>";
            });
    }

    closeBtn.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
});