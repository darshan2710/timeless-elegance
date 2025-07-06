document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/cart')
        .then(res => res.json())
        .then(data => {
            const cartContainer = document.getElementById('cart-items');
            const subtotalEl = document.getElementById('subtotal');
            const totalEl = document.getElementById('total');

            let subtotal = 0;

            data.cartItems.forEach(item => {
                if (!item.product_name || !item.price) return;
            
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('cart-item');

                const fileName = item.product_name
                    .toLowerCase()
                    .replace(/[^a-z0-9 ]/g, '')
                    .replace(/ /g, '-');
                const imagePath = `/images/${fileName}.jpg`;
                itemDiv.innerHTML = `
                    <img class="watch-img" src="/images/${fileName}.jpg" alt="${item.product_name}">
                    <div class="cart-details">
                        <h4>${item.product_name}</h4>
                        <p>Quantity: ${item.quantity || 1}</p>
                        <p>Price: ₹${item.price}</p>
                    </div>
                `;
            
                cartContainer.appendChild(itemDiv);
                subtotal += parseFloat(item.price * item.quantity);
            });
            

            subtotalEl.textContent = subtotal;
            totalEl.textContent = subtotal + 1000;
        })
        .catch(err => {
            console.error('Failed to fetch cart items', err);
        });

    document.getElementById('empty-cart').addEventListener('click', () => {
        fetch('/api/empty-cart', {method : 'DELETE'})
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                location.reload();
            });
    });
});
