document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(sessionStorage.getItem('cart') || '{}');
      const cartItemsContainer = document.getElementById('cart-items');
      const cartTotalElement = document.getElementById('cart-total');
  
  
      function renderCart() {
          cartItemsContainer.innerHTML = ''; // Clear previous items
  
        const productIds = Object.keys(cart);
         if(productIds.length === 0){
           cartItemsContainer.innerHTML = "<p>Your cart is empty</p>"
             cartTotalElement.textContent = `Total Items: 0, Total Price: $0.00`
          } else {
  
            Promise.all(productIds.map(productId => {
                return fetch(`/user/product/${productId}`)
                  .then(response => {
                    if(!response.ok){
                       throw new Error(`HTTP Error ${response.status}`)
                    }
                    return response.json()
                 })
             }))
             .then((products) => {
                 let totalItems = 0;
                 let totalPrice = 0;
                 products.forEach((product)=>{
                     const quantity = cart[product._id];
                     const itemTotal = quantity * product.price;
                     totalItems+= quantity;
                      totalPrice+= itemTotal
                     const card = document.createElement('div');
                     card.classList.add('col-md-3', 'mb-4')
                     card.innerHTML = `
                          <div class="card product-card" data-product-id="${product._id}">
                              <img src="${product.coverImage}" class="card-img-top product-image" alt="${product.name}">
                             <div class="card-body">
                                 <h5 class="card-title">${product.name}</h5>
                                   <p class="card-text">Price: $${product.price}</p>
                                  <div class="cart-controls">
                                      <div class="quantity-controls">
                                          <button class="btn btn-sm btn-secondary minus-item" data-product-id="${product._id}">-</button>
                                          <span class="quantity-value">${quantity}</span>
                                          <button class="btn btn-sm btn-secondary plus-item" data-product-id="${product._id}">+</button>
                                      </div>
                                  </div>
                              </div>
                           </div>
                     `
                    cartItemsContainer.appendChild(card)
                 })
  
                cartTotalElement.textContent = `Total Items: ${totalItems}, Total Price: $${totalPrice.toFixed(2)}`
             })
             .catch(error => {
                  console.error("Failed to fetch cart items", error)
                  cartItemsContainer.innerHTML = "<p>Failed to load cart items</p>"
             });
        }
      }
  
  
      function saveCart() {
          sessionStorage.setItem('cart', JSON.stringify(cart));
      }
  
       cartItemsContainer.addEventListener('click', function(event) {
          if (event.target.classList.contains('plus-item')) {
              const productId = event.target.getAttribute('data-product-id');
              cart[productId]++;
               renderCart()
              saveCart();
          } else if (event.target.classList.contains('minus-item')) {
              const productId = event.target.getAttribute('data-product-id');
              if (cart[productId] > 1) {
                  cart[productId]--;
              } else {
                  delete cart[productId];
              }
             renderCart()
               saveCart();
          }
      });
  
      renderCart();
  });