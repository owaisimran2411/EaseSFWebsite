document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(sessionStorage.getItem('cart') || '{}');
      const productContainer = document.getElementById('productContainer');
     const productModal = document.getElementById('productModal');
     const modalContent = document.getElementById('modal-product-details');
      const modalCartControls = document.getElementById('modal-cart-controls');
     const closeBtn = document.querySelector('.close');
     const categoryEditCloseBtn = document.querySelector('.close-cateogry-edit')
     const categoryAddCloseBtn = document.querySelector('.close-cateogry-add')
 
 
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
        productModal.style.display = 'block';
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
                     <h4>Details:</h4>
                        <ul>
                        ${Object.entries(product.details).map(([key,value])=> {
                            if(Array.isArray(value)){
                               return `<li><strong>${key}:</strong> ${value.join(', ')}</li>`
                              } else {
                                return `<li><strong>${key}:</strong> ${value}</li>`
                              }
                        }).join('')}
                      </ul>
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
 
 
      if(closeBtn) {
        closeBtn.onclick = function() {
            productModal.style.display = "none";
         }
      };
      
 
    window.onclick = function(event) {
        if (event.target === productModal) {
           productModal.style.display = "none";
         }
     };
     const editCategoryModal = document.getElementById('editCategoryModal');
     const addCategoryModal = document.getElementById('addCategoryModal');
     const table = document.querySelector(".table");

     if(categoryAddCloseBtn) {
        categoryAddCloseBtn.onclick = function() {
            addCategoryModal.style.display = "none";
         }
      };
      if(categoryEditCloseBtn) {
        categoryEditCloseBtn.onclick = function() {
            editCategoryModal.style.display = "none";
         }
      };
 
     table.addEventListener('click', function(event){
          if (event.target.classList.contains('edit-category')) {
            const categoryId = event.target.getAttribute('data-category-id');
            const categoryRow = event.target.closest('tr');
              const categoryName = categoryRow.querySelector('td').textContent;
            document.getElementById('edit-category-id').value = categoryId;
            document.getElementById('edit-category-name').value= categoryName;
             editCategoryModal.style.display = 'block';
          } else  if (event.target.classList.contains('delete-category')) {
           const categoryId = event.target.getAttribute('data-category-id');
              if(confirm("Are you sure you want to delete this category?")){
                 fetch(`/categories/${categoryId}`,{
                     method: 'DELETE'
                  })
                 .then((res)=> {
                     if(res.ok){
                      window.location.reload();
                      } else {
                         throw new Error("Failed to delete the category")
                     }
                 })
                .catch((e)=> console.log(e))
             }
         }
     })
     const addCategoryBtn = document.querySelector('.add-category')
     addCategoryBtn.addEventListener('click', (e)=>{
          addCategoryModal.style.display = 'block';
      })
 
    document.querySelector('.update-category').addEventListener('click', function(){
         const categoryId =  document.getElementById('edit-category-id').value;
         const categoryName =  document.getElementById('edit-category-name').value;
         fetch(`/admin/category/${categoryId}`, {
              method: 'POST',
              headers: {
                   'Content-Type': 'application/json'
              },
              body: JSON.stringify({name: categoryName})
          }).then((res)=> {
             if(res.ok){
                  window.location.reload();
             } else {
                   throw new Error("Failed to update the category")
             }
         })
         .catch((e)=> console.log(e))
    })
 
     document.querySelector('.create-category').addEventListener('click', function() {
           const categoryName = document.getElementById('new-category-name').value;
         fetch('/admin/category', {
             method: 'POST',
             headers: {
                  'Content-Type': 'application/json'
             },
             body: JSON.stringify({name: categoryName})
         })
            .then((res) => {
                if(res.ok){
                   window.location.reload();
                } else {
                   throw new Error("Failed to create new category");
                }
           })
          .catch((e) => console.log(e))
     })
 
    document.querySelectorAll('.cancel-edit-category, .cancel-add-category').forEach((cancelButton) => {
         cancelButton.addEventListener('click', function() {
           editCategoryModal.style.display = 'none';
            addCategoryModal.style.display = 'none';
         });
     });
 
      window.onclick = function(event) {
         if (event.target === editCategoryModal || event.target === addCategoryModal) {
            editCategoryModal.style.display = "none";
             addCategoryModal.style.display = "none";
         }
     };
 
 });