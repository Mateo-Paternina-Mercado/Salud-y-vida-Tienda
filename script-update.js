// Modificaciones al script.js principal para integrar con Local Storage

// Declare global variables
let cart = [];
let products = [];
let orderNumber;
let checkoutModal;
let confirmationModal;

// Place Order Function (Actualizada)
function placeOrder(e) {
    e.preventDefault();
    
    // Form validation
    const fullname = document.getElementById('fullname').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('checkout-phone').value;
    const payment = document.getElementById('payment').value;
    
    if (!fullname || !address || !phone || !payment) {
        alert('Por favor completa todos los campos obligatorios.');
        return;
    }
    
    let confirmationNumber = null;
    
    if (payment === 'nequi') {
        confirmationNumber = document.getElementById('nequi-confirmation').value;
        if (!confirmationNumber) {
            alert('Por favor ingresa el número de confirmación de Nequi.');
            return;
        }
    }
    
    if (payment === 'bancolombia') {
        confirmationNumber = document.getElementById('bancolombia-confirmation').value;
        if (!confirmationNumber) {
            alert('Por favor ingresa el número de confirmación de Bancolombia.');
            return;
        }
    }
    
    // Generate random order number
    const randomOrderNumber = Math.floor(100000 + Math.random() * 900000);
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order object
    const order = {
        id: randomOrderNumber,
        date: new Date().toISOString(),
        customer: {
            name: fullname,
            phone: phone,
            address: address
        },
        payment: {
            method: payment,
            confirmation: confirmationNumber
        },
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total: total,
        status: payment === 'efectivo' ? 'pending' : 'paid'
    };
    
    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('saludyvidaOrders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('saludyvidaOrders', JSON.stringify(existingOrders));
    
    // Update order number in confirmation modal
    document.getElementById('orderNumber').textContent = randomOrderNumber;
    
    // Hide checkout modal and show confirmation modal
    document.getElementById('checkoutModal').style.display = 'none';
    document.getElementById('confirmationModal').style.display = 'block';
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    
    // Clear form
    document.getElementById('fullname').value = '';
    document.getElementById('address').value = '';
    document.getElementById('checkout-phone').value = '';
    document.getElementById('payment').value = '';
    document.getElementById('nequi-confirmation').value = '';
    document.getElementById('bancolombia-confirmation').value = '';
}

// Load products from localStorage if available
function loadProductsFromStorage() {
    const storedProducts = localStorage.getItem('saludyvidaProducts');
    if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        // Update the global products array
        products.length = 0; // Clear existing products
        products.push(...parsedProducts);
    }
}

// Initialize products from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load products from localStorage first
    loadProductsFromStorage();
    
    // Then display products
    displayProducts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize testimonials slider
    initTestimonialsSlider();
});

// Function to update cart display
function updateCartDisplay() {
    // Implementation for updating cart display
}

// Function to display products
function displayProducts() {
    // Implementation for displaying products
}

// Function to set up event listeners
function setupEventListeners() {
    // Implementation for setting up event listeners
}

// Function to initialize testimonials slider
function initTestimonialsSlider() {
    // Implementation for initializing testimonials slider
}
