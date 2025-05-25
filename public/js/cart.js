(function () {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    let cart = JSON.parse(sessionStorage.getItem("cart")) || {};

    function updateCartUI() {
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = "";
        }
        let total = 0;

        for (const [id, item] of Object.entries(cart)) {
            total += item.price * item.quantity;
            if (cartItemsContainer) {
                cartItemsContainer.innerHTML += `
                <div class="cart_item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="info">
                        <h3>${item.name}</h3>
                        <p>$ ${item.price} × ${item.quantity}</p>
                        <div class="qty_buttons">
                            <button onclick="updateQty('${id}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQty('${id}', 1)">+</button>
                        </div>
                    </div>
                    <button onclick="removeItem('${id}')" class="remove_btn">Remove</button>
                </div>`;
            }
        }

        if (cartTotal) {
            cartTotal.innerText = `$ ${total.toFixed(2)}`;
        }
    }

    window.updateQty = function (id, change) {
        if (!cart[id]) return;
        cart[id].quantity += change;
        if (cart[id].quantity <= 0) {
            delete cart[id];
        }
        sessionStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI();
    }

    window.removeItem = function (id) {
        if (!cart[id]) return;
        delete cart[id];
        sessionStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI();
    }

    updateCartUI();
})();
