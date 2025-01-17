document.addEventListener('DOMContentLoaded', function () {
   let cart = JSON.parse(sessionStorage.getItem('cart') || '{}');
   const orderItemsContainer = document.getElementById('order-items');
   const billSummaryElement = document.getElementById('bill-summary');
   const checkoutForm = document.getElementById('checkout-form');
   const SALES_TAX_RATE = 0.10; // Hardcoded 10% sales tax

   function populateStateDropdown() {
      const stateDropdown = document.getElementById('state');
      const states = [
         { "name": "Alabama", "abbreviation": "AL" },
         { "name": "Alaska", "abbreviation": "AK" },
         { "name": "Arizona", "abbreviation": "AZ" },
         { "name": "Arkansas", "abbreviation": "AR" },
         { "name": "California", "abbreviation": "CA" },
         { "name": "Colorado", "abbreviation": "CO" },
         { "name": "Connecticut", "abbreviation": "CT" },
         { "name": "Delaware", "abbreviation": "DE" },
         { "name": "Florida", "abbreviation": "FL" },
         { "name": "Georgia", "abbreviation": "GA" },
         { "name": "Hawaii", "abbreviation": "HI" },
         { "name": "Idaho", "abbreviation": "ID" },
         { "name": "Illinois", "abbreviation": "IL" },
         { "name": "Indiana", "abbreviation": "IN" },
         { "name": "Iowa", "abbreviation": "IA" },
         { "name": "Kansas", "abbreviation": "KS" },
         { "name": "Kentucky", "abbreviation": "KY" },
         { "name": "Louisiana", "abbreviation": "LA" },
         { "name": "Maine", "abbreviation": "ME" },
         { "name": "Maryland", "abbreviation": "MD" },
         { "name": "Massachusetts", "abbreviation": "MA" },
         { "name": "Michigan", "abbreviation": "MI" },
         { "name": "Minnesota", "abbreviation": "MN" },
         { "name": "Mississippi", "abbreviation": "MS" },
         { "name": "Missouri", "abbreviation": "MO" },
         { "name": "Montana", "abbreviation": "MT" },
         { "name": "Nebraska", "abbreviation": "NE" },
         { "name": "Nevada", "abbreviation": "NV" },
         { "name": "New Hampshire", "abbreviation": "NH" },
         { "name": "New Jersey", "abbreviation": "NJ" },
         { "name": "New Mexico", "abbreviation": "NM" },
         { "name": "New York", "abbreviation": "NY" },
         { "name": "North Carolina", "abbreviation": "NC" },
         { "name": "North Dakota", "abbreviation": "ND" },
         { "name": "Ohio", "abbreviation": "OH" },
         { "name": "Oklahoma", "abbreviation": "OK" },
         { "name": "Oregon", "abbreviation": "OR" },
         { "name": "Pennsylvania", "abbreviation": "PA" },
         { "name": "Rhode Island", "abbreviation": "RI" },
         { "name": "South Carolina", "abbreviation": "SC" },
         { "name": "South Dakota", "abbreviation": "SD" },
         { "name": "Tennessee", "abbreviation": "TN" },
         { "name": "Texas", "abbreviation": "TX" },
         { "name": "Utah", "abbreviation": "UT" },
         { "name": "Vermont", "abbreviation": "VT" },
         { "name": "Virginia", "abbreviation": "VA" },
         { "name": "Washington", "abbreviation": "WA" },
         { "name": "West Virginia", "abbreviation": "WV" },
         { "name": "Wisconsin", "abbreviation": "WI" },
         { "name": "Wyoming", "abbreviation": "WY" }
      ];

      states.forEach(state => {
         const option = document.createElement('option');
         option.value = state.abbreviation;
         option.text = state.name;
         stateDropdown.appendChild(option);
      });
   }


   function renderOrderSummary(salesTax = SALES_TAX_RATE) {
      orderItemsContainer.innerHTML = ''; // Clear previous items
      const productIds = Object.keys(cart);
      if (productIds.length === 0) {
         orderItemsContainer.innerHTML = "<p>Your cart is empty</p>"
      } else {
         Promise.all(productIds.map(productId => {
            return fetch(`/user/product/${productId}`)
               .then(response => {
                  if (!response.ok) {
                     throw new Error(`HTTP Error ${response.status}`)
                  }
                  return response.json()
               })
         }))
            .then((products) => {
               let totalItems = 0;
               let totalPrice = 0;
               products.forEach((product) => {
                  const quantity = cart[product._id];
                  const itemTotal = quantity * product.price;
                  totalItems += quantity;
                  totalPrice += itemTotal;
                  const card = document.createElement('div');
                  card.classList.add('col-md-3', 'mb-4')
                  card.innerHTML = `
                        <div class="card product-card" data-product-id="${product._id}">
                           <img src="${product.coverImage}" class="card-img-top product-image" alt="${product.name}">
                           <div class="card-body">
                              <h5 class="card-title">${product.name}</h5>
                                 <p class="card-text">Price: $${product.price}</p>
                                 <p>Quantity: ${quantity}</p>
                           </div>
                        </div>
                  `
                  orderItemsContainer.appendChild(card)
               })
               const totalPriceWithTax = totalPrice * (1 + salesTax);
               billSummaryElement.innerHTML = `
               <p>Total Items: ${totalItems}</p>
               <p>Sub Total: $${totalPrice.toFixed(2)}</p>
               <p>Sales Tax: ${salesTax * 100}%</p>
               <p>Total Amount: $${totalPriceWithTax.toFixed(2)}</p>
            `
            })
            .catch(error => {
               console.error("Failed to fetch order items", error)
               orderItemsContainer.innerHTML = "<p>Failed to load order items</p>"
            });
      }
   }

   function persistFormData(formData) {
      const now = new Date().getTime();
      const expiryTime = now + (30 * 60 * 1000); // 30 minutes in milliseconds
      const immutableFormData = Object.freeze({ ...formData });
      localStorage.setItem("formData", JSON.stringify({
         data: immutableFormData,
         expiry: expiryTime
      }));
   }
   function persistCartData(cart, totalAmount) {
      const now = new Date().getTime();
      const expiryTime = now + (30 * 60 * 1000); // 30 minutes in milliseconds
      const immutableCart = Object.freeze({ ...cart })
      localStorage.setItem("cartData", JSON.stringify({
         cart: immutableCart,
         totalAmount: totalAmount,
         expiry: expiryTime
      }));
   }

   async function processPayment(totalAmount, event) {
      // event.preventDefault()
      // const orderData = localStorage.getItem('formData' || '{}')
      // console.log(orderData.data)
      // try {
      //    // const response = fetch('/user/checkout', {
      //    //    body: 
      //    // })
      // } catch (err) {
      //    console.error(err)
      // }
   }


   function retrieveFormData() {
      try {
         const storedData = localStorage.getItem('formData');
         if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.expiry > new Date().getTime()) {
               return parsedData.data;
            } else {
               localStorage.removeItem('formData')
               return null;
            }
         } else {
            return null;
         }
      } catch (error) {
         console.error("Failed to retrieve form data", error)
         return null;
      }
   }


   function retrieveCartData() {
      try {
         const storedData = localStorage.getItem('cartData');
         if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.expiry > new Date().getTime()) {
               return parsedData;
            } else {
               localStorage.removeItem('cartData');
               return null;
            }
         } else {
            return null;
         }
      } catch (error) {
         console.error("Failed to retrieve cart data", error)
         return null
      }
   }

   // checkoutForm.addEventListener('submit', async (e) => {

      // const formData = {
      //    firstName: document.getElementById('firstName').value,
      //    lastName: document.getElementById('lastName').value,
      //    phoneNumber: document.getElementById('phoneNumber').value,
      //    emailAddress: document.getElementById('emailAddress').value,
      //    addressLine1: document.getElementById('addressLine1').value,
      //    addressLine2: document.getElementById('addressLine2').value,
      //    city: document.getElementById('city').value,
      //    state: document.getElementById('state').value,
      //    zipCode: document.getElementById('zipCode').value,
      //    cart: [] // Initialize cart as empty array
      // };

      // let totalAmount = 0;
      // if (Object.keys(cart).length > 0) {
      //    const products = await Promise.all(Object.keys(cart).map(productId => {
      //       return fetch(`/user/product/${productId}`)
      //          .then(response => {
      //             if (!response.ok) {
      //                throw new Error(`HTTP Error ${response.status}`)
      //             }
      //             return response.json()
      //          })
      //    }))

      //    products.forEach((product) => {
      //       const cartItem = {
      //          product_id: product._id,
      //          product_quantity: cart[product._id],
      //          product_unit_price: product.price,
      //       }
      //       formData.cart.push(cartItem);
      //       totalAmount += product.price * cart[product._id];
      //    })
      //    totalAmount = totalAmount * (1 + SALES_TAX_RATE)

      // }
      // persistFormData(formData);
      // persistCartData(cart, totalAmount);
      // await processPayment(totalAmount, e)
   // })
   const storedFormData = retrieveFormData()
   const storedCartData = retrieveCartData();
   if (storedFormData) {
      checkoutForm.firstName.value = storedFormData.firstName
      checkoutForm.lastName.value = storedFormData.lastName
      checkoutForm.phoneNumber.value = storedFormData.phoneNumber
      checkoutForm.emailAddress.value = storedFormData.emailAddress
      checkoutForm.addressLine1.value = storedFormData.addressLine1
      checkoutForm.addressLine2.value = storedFormData.addressLine2
      checkoutForm.city.value = storedFormData.city
      checkoutForm.state.value = storedFormData.state
      checkoutForm.zipCode.value = storedFormData.zipCode

      alert(`Form information restored.`)
      if (storedCartData) {
         cart = storedCartData.cart;
         renderOrderSummary(SALES_TAX_RATE)
         alert(`Checkout information restored. Total Amount to Pay: $${storedCartData.totalAmount.toFixed(2)}`)
      }
   } else {
      if (storedCartData) {
         cart = storedCartData.cart;
         renderOrderSummary(SALES_TAX_RATE)
         alert(`Checkout information restored. Total Amount to Pay: $${storedCartData.totalAmount.toFixed(2)}`)
      } else {
         renderOrderSummary();
      }
   }

   populateStateDropdown();
});