(function() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  function updateCartUI() {
      cartItemsContainer.innerHTML = "";
      let total = 0;

      cart.forEach((item, index) => {
          total += item.price * item.quantity;
          cartItemsContainer.innerHTML += `
              <div class="cart_item">
                  <img src="${item.image}" alt="${item.name}">
                  <div class="info">
                      <h3>${item.name}</h3>
                      <p>$ ${item.price} × ${item.quantity}</p>
                      <div class="qty_buttons">
                          <button onclick="updateQty(${index}, -1)">-</button>
                          <span>${item.quantity}</span>
                          <button onclick="updateQty(${index}, 1)">+</button>
                      </div>
                  </div>
                  <button onclick="removeItem(${index})" class="remove_btn">Remove</button>
              </div>`;
      });

      cartTotal.innerText = `$ ${total.toFixed(2)}`;
  }

  window.updateQty = function(index, change) {
      if (!cart[index]) return;
      cart[index].quantity += change;
      if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartUI();
  }

  window.removeItem = function(index) {
      if (!cart[index]) return;
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartUI();
  }

  updateCartUI();
})();