document.addEventListener('DOMContentLoaded', () => {



    var elements = document.querySelectorAll('.view-order-details')
    elements.forEach(element => {
        element.addEventListener('click', () => {
            const modalBody = document.getElementById('orderDetailModal')
            const modalContent = document.getElementById('modal-order-details');
            modalBody.style.display = 'block'

            const orderId = element.getAttribute('data-order-id')
            
            fetch(`/admin/orders/${orderId}`, {
                method: 'GET'
            }).then(response => {
                return response.json()
            }).then(orderData => {
                if (orderData.length > 0) {
                    // console.log(orderData)
                    let totalBill = 0;
                    for (let i = 0; i < orderData[0].cartItems.length; i++) {
                        totalBill += (orderData[0].cartItems[i].quantity * orderData[0].cartItems[i].price)
                    }
                    const salesTax = totalBill * 0.1
                    totalBill += salesTax
                    modalContent.innerHTML = `
                <h2>Order Details</h2>
                
                <p><strong>Customer Name:</strong> ${orderData[0].firstName} ${orderData[0].lastName}</p>
                <p><strong>Phone Number:</strong> ${orderData[0].phoneNumber}</p>
                <p><strong>Email Address:</strong> ${orderData[0].email}</p>
                <p><strong>Delivery Address:</strong> ${orderData[0].address}</p>
                <p><strong>Order Data:</strong> ${orderData[0].orderDate}</p>
                
                <h2>Order Items</h4>
                <ul>
                    ${orderData[0].cartItems.map(item => `<li><ul> <li>Product Name: ${item.productName}</li> <li>Unit Price: $${item.price}</li><li>Quantity: ${item.quantity}</li></ul></li>`).join('')}
                </ul>
    
                <p><strong>Total Bill Amount:</strong> $${totalBill}</p>
    
                
                
            `;


                }

            })
            const closeBtn = document.querySelector('.close');
            if (closeBtn) {
                closeBtn.onclick = function () {
                    modalBody.style.display = "none";
                };
            }

        })

    })

})