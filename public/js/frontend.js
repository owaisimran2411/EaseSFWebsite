// Search Bar Filtering
const searchInput = document.getElementById('searchInput');
const productCards = document.querySelectorAll('.product_card');

// Nav toggle (if you have a mobile nav toggle)
function toggleNav(icon) {
  icon.classList.toggle("active");
  document.getElementById("myNav").classList.toggle("show");
}

// Cart logic
let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

function addToCart(product) {
  const existingIndex = cart.findIndex(item => item.name === product.name);
  if (existingIndex >= 0) {
    cart[existingIndex].quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  sessionStorage.setItem("cart", JSON.stringify(cart));
  // alert(`${product.name} added to cart!`);
}

// Add event listeners for all buy buttons
document.querySelectorAll(".add-to-cart, .buy_btn").forEach(button => {
  button.addEventListener("click", function (e) {
    e.preventDefault();

    const card = this.closest(".product_card");
    const name = card.querySelector("h3").innerText.trim();
    const priceText = card.querySelector("p").innerText.trim();
    const image = card.querySelector("img").src;
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    const id = card.getAttribute('data-product-id')

    if (!name || !price || !image || !id) {
      alert("Product info missing");
      return;
    }

    addToCart({ name, price, image, id });
  });
});

const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.my_nav');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}