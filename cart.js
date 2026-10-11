// Глобални функции за количката

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
    let cart = getCart();
    cart.push(product);
    saveCart(cart);
    updateCartCount();
    
    alert('Услугата беше добавена успешно в количката!');
}

function updateCartCount() {
    let cart = getCart();
    
    // Обновяване на горния брояч
    const countTopEl = document.getElementById('cart-count-top');
    if (countTopEl) {
        countTopEl.textContent = cart.length;
    }

    // Обновяване на плаващия брояч долу в дясно
    const countFloatingEl = document.getElementById('cart-count-floating');
    if (countFloatingEl) {
        countFloatingEl.textContent = cart.length;
    }
}

// Автоматично обновяване на брояча при зареждане на всяка страница
document.addEventListener('DOMContentLoaded', updateCartCount);