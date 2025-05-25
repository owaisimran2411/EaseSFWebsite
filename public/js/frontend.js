// Cart logic using object format
let cart = JSON.parse(sessionStorage.getItem("cart")) || {};

// Add product to cart using product ID as key
function addToCart(product) {

  const { id, name, price, image } = product;
  if (!id) {
    alert("Product ID is missing.");
    return;
  }

  if (cart[id]) {
    cart[id].quantity += 1;
  } else {
    cart[id] = {
      price: price,
      quantity: 1,
      name: name,
      image: image
    }
  }


  // alert(`${product.name} added to cart!`);
}

// Add event listeners to all "add to cart" or "buy" buttons
document.querySelectorAll(".add-to-cart, .buy_btn").forEach(button => {
  button.addEventListener("click", function (e) {
    e.preventDefault();

    const card = this.closest(".product_card");
    if (!card) return;

    const id = card.getAttribute('data-product-id');
    const name = card.querySelector("h3")?.innerText.trim();
    const priceText = card.querySelector("p")?.innerText.trim();
    const image = card.querySelector("img")?.src;
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

    if (!id || !name || !price || !image) {
      alert("Product info missing or invalid.");
      return;
    }

    if (cart[id]) {
      cart[id].quantity += 1
    } else {
      cart[id] = {
        "quantity": 1,
        "price": price,
        "name": name,
        "image": image
      }
    }
    sessionStorage.setItem("cart", JSON.stringify(cart));
  });
});

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.my_nav');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}
