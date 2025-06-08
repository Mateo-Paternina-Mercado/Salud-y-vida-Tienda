// Products Data with Google Images
let products = [
  {
    id: 1,
    name: "Colagesan",
    category: "suplementos",
    price: 45000,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    description: "Colágeno con vitamina E para la piel, cabello y articulaciones.",
    stock: 15,
  },
  {
    id: 2,
    name: "Vita Francesa",
    category: "vitaminas",
    price: 38000,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    description: "Suplemento con Borojó, Chontaduro y Maca. Energizante natural.",
    stock: 20,
  },
  {
    id: 3,
    name: "Omega 3",
    category: "suplementos",
    price: 42000,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
    description: "Aceite de pescado rico en ácidos grasos esenciales para la salud cardiovascular.",
    stock: 12,
  },
  {
    id: 4,
    name: "Spirulina",
    category: "suplementos",
    price: 35000,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    description: "Alga rica en proteínas, vitaminas y minerales. Potente antioxidante.",
    stock: 8,
  },
  {
    id: 5,
    name: "Vitamina C",
    category: "vitaminas",
    price: 28000,
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop",
    description: "Refuerza el sistema inmunológico y favorece la absorción de hierro.",
    stock: 25,
  },
  {
    id: 6,
    name: "Té Verde",
    category: "hierbas",
    price: 18000,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop",
    description: "Antioxidante natural que ayuda a acelerar el metabolismo.",
    stock: 30,
  },
  {
    id: 7,
    name: "Manzanilla",
    category: "hierbas",
    price: 15000,
    image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&h=400&fit=crop",
    description: "Hierba con propiedades antiinflamatorias y relajantes.",
    stock: 40,
  },
  {
    id: 8,
    name: "Complejo B",
    category: "vitaminas",
    price: 32000,
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop",
    description: "Conjunto de vitaminas B esenciales para el metabolismo energético.",
    stock: 18,
  },
]

// Global variables
let cart = []
let orders = []
let currentCategory = "all"
let isAdminLoggedIn = false
let currentAdmin = null
let currentOrderId = null
let currentProductId = null
let chatMessages = []
let unreadMessages = 0
let lastOrderNumber = null

// API URLs
const API_URL = "https://683cf838199a0039e9e3d448.mockapi.io/users"
const PRODUCTS_API_URL = "https://683cf838199a0039e9e3d448.mockapi.io/products"
const ORDERS_API_URL = "https://683cf838199a0039e9e3d448.mockapi.io/orders"
const CHAT_API_URL = "https://683cf838199a0039e9e3d448.mockapi.io/chat"

// Admin email for notifications
const ADMIN_EMAIL = "admin@saludyvida.com"

// Payment verification APIs (simulados)
const NEQUI_API = "https://api.nequi.com.co/verify" // Simulado
const BANCOLOMBIA_API = "https://api.bancolombia.com/verify" // Simulado

// DOM Elements
const productsGrid = document.querySelector(".products-grid")
const categoryButtons = document.querySelectorAll(".category-btn")
const cartIcon = document.querySelector(".cart-icon")
const cartSidebar = document.querySelector(".cart-sidebar")
const closeCart = document.querySelector(".close-cart")
const cartItems = document.querySelector(".cart-items")
const cartTotalAmount = document.getElementById("cart-total-amount")
const checkoutBtn = document.querySelector(".checkout-btn")
const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
const menu = document.querySelector(".menu")
const overlay = document.querySelector(".overlay")
const checkoutModal = document.getElementById("checkoutModal")
const confirmationModal = document.getElementById("confirmationModal")
const closeModalButtons = document.querySelectorAll(".close-modal")
const paymentSelect = document.getElementById("payment")
const nequiDetails = document.getElementById("nequiDetails")
const bancolombiaDetails = document.getElementById("bancolombiaDetails")
const placeOrderBtn = document.getElementById("placeOrderBtn")
const continueShoppingBtn = document.getElementById("continueShoppingBtn")
const orderItems = document.querySelector(".order-items")
const orderTotalAmount = document.getElementById("order-total-amount")
const orderNumber = document.getElementById("orderNumber")
const testimonialDots = document.querySelectorAll(".dot")

// Admin Elements
const adminBtn = document.getElementById("admin-btn")
const adminLoginModal = document.getElementById("adminLoginModal")
const adminDashboardModal = document.getElementById("adminDashboardModal")
const adminLoginForm = document.getElementById("admin-login-form")
const adminLoginError = document.getElementById("admin-login-error")
const adminLogoutBtn = document.getElementById("admin-logout-btn")
const adminUsernameDisplay = document.getElementById("admin-username-display")

// Admin Tab Elements
const tabButtons = document.querySelectorAll(".tab-btn")
const tabContents = document.querySelectorAll(".tab-content")
const orderStatusFilter = document.getElementById("order-status-filter")
const orderSearch = document.getElementById("order-search")
const ordersTableBody = document.getElementById("orders-table-body")
const productCategoryFilter = document.getElementById("product-category-filter")
const productSearch = document.getElementById("product-search")
const productsTableBody = document.getElementById("products-table-body")
const addProductBtn = document.getElementById("add-product-btn")
const productModal = document.getElementById("productModal")
const productForm = document.getElementById("product-form")
const productModalTitle = document.getElementById("product-modal-title")
const productIdInput = document.getElementById("product-id")
const productNameInput = document.getElementById("product-name")
const productCategoryInput = document.getElementById("product-category")
const productPriceInput = document.getElementById("product-price")
const productStockInput = document.getElementById("product-stock")
const productDescriptionInput = document.getElementById("product-description")
const productImageInput = document.getElementById("product-image")
const saveProductBtn = document.getElementById("save-product-btn")
const orderDetailModal = document.getElementById("orderDetailModal")
const orderDetailNumber = document.getElementById("order-detail-number")
const orderCustomerName = document.getElementById("order-customer-name")
const orderCustomerPhone = document.getElementById("order-customer-phone")
const orderCustomerAddress = document.getElementById("order-customer-address")
const orderPaymentMethod = document.getElementById("order-payment-method")
const orderPaymentStatus = document.getElementById("order-payment-status")
const orderConfirmationContainer = document.getElementById("order-confirmation-container")
const orderConfirmationNumber = document.getElementById("order-confirmation-number")
const orderItemsBody = document.getElementById("order-items-body")
const orderDetailTotal = document.getElementById("order-detail-total")
const orderStatus = document.getElementById("order-status")
const updateOrderStatusBtn = document.getElementById("update-order-status-btn")

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Initializing application...")

  // Show loading indicator
  showLoadingIndicator()

  try {
    // Initialize data from cloud first, then fallback to local
    await initializeCloudData()

    // Load data
    await loadAllData()

    // Display Products
    displayProducts()

    // Set up event listeners
    setupEventListeners()

    // Initialize testimonials slider
    initTestimonialsSlider()

    // Check admin login status
    checkAdminLoginStatus()

    // Initialize chat system
    initializeChat()

    console.log("Application initialized successfully")
  } catch (error) {
    console.error("Error initializing application:", error)
    // Fallback to local storage
    initializeLocalData()
    loadDataFromLocalStorage()
    displayProducts()
    setupEventListeners()
    initTestimonialsSlider()
    checkAdminLoginStatus()
    initializeChat()
  } finally {
    hideLoadingIndicator()
  }
})

// Show/Hide Loading Indicator
function showLoadingIndicator() {
  const loader = document.createElement("div")
  loader.id = "global-loader"
  loader.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255,255,255,0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      font-family: Arial, sans-serif;
    ">
      <div style="text-align: center;">
        <div style="
          border: 4px solid #f3f3f3;
          border-top: 4px solid #4CAF50;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        "></div>
        <p style="color: #666; font-size: 16px;">Cargando datos...</p>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `
  document.body.appendChild(loader)
}

function hideLoadingIndicator() {
  const loader = document.getElementById("global-loader")
  if (loader) {
    loader.remove()
  }
}

// Cloud Data Management
async function initializeCloudData() {
  try {
    // Check if products exist in cloud
    const response = await fetch(PRODUCTS_API_URL)
    if (response.ok) {
      const cloudProducts = await response.json()
      if (cloudProducts.length === 0) {
        // Initialize cloud with default products
        await saveProductsToCloud(products)
        console.log("Default products saved to cloud")
      }
    }
  } catch (error) {
    console.log("Cloud initialization failed, using local storage")
  }
}

async function loadAllData() {
  try {
    // Load products from cloud
    await loadProductsFromCloud()

    // Load orders from cloud
    await loadOrdersFromCloud()

    // Load chat messages from cloud
    await loadChatFromCloud()

    // Load cart from local storage (cart is always local)
    loadCartFromLocalStorage()

    console.log(
      `Loaded ${products.length} products, ${orders.length} orders, ${cart.length} cart items, ${chatMessages.length} chat messages`,
    )
  } catch (error) {
    console.error("Error loading cloud data:", error)
    // Fallback to local storage
    loadDataFromLocalStorage()
  }
}

async function loadProductsFromCloud() {
  try {
    const response = await fetch(PRODUCTS_API_URL)
    if (response.ok) {
      const cloudProducts = await response.json()
      if (cloudProducts.length > 0) {
        products = cloudProducts
        // Also save to local storage as backup
        localStorage.setItem("saludyvidaProducts", JSON.stringify(products))
        return
      }
    }
  } catch (error) {
    console.log("Failed to load products from cloud, using local storage")
  }

  // Fallback to local storage
  const storedProducts = localStorage.getItem("saludyvidaProducts")
  if (storedProducts) {
    products = JSON.parse(storedProducts)
  }
}

async function saveProductsToCloud(productsToSave = products) {
  try {
    // Clear existing products first
    const existingResponse = await fetch(PRODUCTS_API_URL)
    if (existingResponse.ok) {
      const existingProducts = await existingResponse.json()

      // Delete existing products
      for (const product of existingProducts) {
        await fetch(`${PRODUCTS_API_URL}/${product.id}`, {
          method: "DELETE",
        })
      }
    }

    // Save new products
    for (const product of productsToSave) {
      await fetch(PRODUCTS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
    }

    console.log("Products saved to cloud successfully")

    // Also save to local storage as backup
    localStorage.setItem("saludyvidaProducts", JSON.stringify(productsToSave))
  } catch (error) {
    console.error("Failed to save products to cloud:", error)
    // Save to local storage as fallback
    localStorage.setItem("saludyvidaProducts", JSON.stringify(productsToSave))
  }
}

async function loadOrdersFromCloud() {
  try {
    const response = await fetch(ORDERS_API_URL)
    if (response.ok) {
      const cloudOrders = await response.json()
      orders = cloudOrders
      // Also save to local storage as backup
      localStorage.setItem("saludyvidaOrders", JSON.stringify(orders))
      return
    }
  } catch (error) {
    console.log("Failed to load orders from cloud, using local storage")
  }

  // Fallback to local storage
  const storedOrders = localStorage.getItem("saludyvidaOrders")
  if (storedOrders) {
    orders = JSON.parse(storedOrders)
  }
}

async function saveOrderToCloud(order) {
  try {
    const response = await fetch(ORDERS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })

    if (response.ok) {
      console.log("Order saved to cloud successfully")
    }

    // Also save to local storage as backup
    orders.push(order)
    localStorage.setItem("saludyvidaOrders", JSON.stringify(orders))
  } catch (error) {
    console.error("Failed to save order to cloud:", error)
    // Save to local storage as fallback
    orders.push(order)
    localStorage.setItem("saludyvidaOrders", JSON.stringify(orders))
  }
}

async function updateOrderInCloud(order) {
  try {
    // Find the order in the cloud by its ID
    const response = await fetch(`${ORDERS_API_URL}/${order.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })

    if (response.ok) {
      console.log("Order updated in cloud successfully")
    }

    // Update in local storage as backup
    const orderIndex = orders.findIndex((o) => o.id === order.id)
    if (orderIndex !== -1) {
      orders[orderIndex] = order
      localStorage.setItem("saludyvidaOrders", JSON.stringify(orders))
    }
  } catch (error) {
    console.error("Failed to update order in cloud:", error)
    // Update in local storage as fallback
    const orderIndex = orders.findIndex((o) => o.id === order.id)
    if (orderIndex !== -1) {
      orders[orderIndex] = order
      localStorage.setItem("saludyvidaOrders", JSON.stringify(orders))
    }
  }
}

// Chat System
async function loadChatFromCloud() {
  try {
    const response = await fetch(CHAT_API_URL)
    if (response.ok) {
      const cloudChat = await response.json()
      chatMessages = cloudChat
      // Also save to local storage as backup
      localStorage.setItem("saludyvidaChatMessages", JSON.stringify(chatMessages))

      // Count unread messages for admin
      if (isAdminLoggedIn) {
        unreadMessages = chatMessages.filter((msg) => !msg.read && msg.sender === "user").length
        updateChatNotificationBadge()
      }
      return
    }
  } catch (error) {
    console.log("Failed to load chat from cloud, using local storage")
  }

  // Fallback to local storage
  const storedChat = localStorage.getItem("saludyvidaChatMessages")
  if (storedChat) {
    chatMessages = JSON.parse(storedChat)

    // Count unread messages for admin
    if (isAdminLoggedIn) {
      unreadMessages = chatMessages.filter((msg) => !msg.read && msg.sender === "user").length
      updateChatNotificationBadge()
    }
  }
}

async function saveChatMessageToCloud(message) {
  try {
    const response = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })

    if (response.ok) {
      console.log("Chat message saved to cloud successfully")
    }

    // Also save to local storage as backup
    chatMessages.push(message)
    localStorage.setItem("saludyvidaChatMessages", JSON.stringify(chatMessages))
  } catch (error) {
    console.error("Failed to save chat message to cloud:", error)
    // Save to local storage as fallback
    chatMessages.push(message)
    localStorage.setItem("saludyvidaChatMessages", JSON.stringify(chatMessages))
  }
}

async function markChatMessagesAsRead() {
  try {
    // Update all unread messages in the cloud
    for (const message of chatMessages) {
      if (!message.read && message.sender === "user") {
        message.read = true
        await fetch(`${CHAT_API_URL}/${message.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        })
      }
    }

    // Update in local storage
    localStorage.setItem("saludyvidaChatMessages", JSON.stringify(chatMessages))

    // Reset unread count
    unreadMessages = 0
    updateChatNotificationBadge()
  } catch (error) {
    console.error("Failed to mark messages as read:", error)
    // Update in local storage as fallback
    chatMessages.forEach((msg) => {
      if (!msg.read && msg.sender === "user") {
        msg.read = true
      }
    })
    localStorage.setItem("saludyvidaChatMessages", JSON.stringify(chatMessages))

    // Reset unread count
    unreadMessages = 0
    updateChatNotificationBadge()
  }
}

// Local Data Management (Fallback)
function initializeLocalData() {
  if (!localStorage.getItem("saludyvidaProducts")) {
    localStorage.setItem("saludyvidaProducts", JSON.stringify(products))
    console.log("Default products initialized locally")
  }

  if (!localStorage.getItem("saludyvidaOrders")) {
    const initialOrders = [
      {
        id: 100001,
        date: new Date().toISOString(),
        customer: {
          name: "María González",
          phone: "3001234567",
          address: "Calle 15 #20-30, Sincelejo",
        },
        payment: {
          method: "nequi",
          confirmation: "NQ123456789",
          verified: true,
        },
        items: [
          {
            id: 1,
            name: "Colagesan",
            price: 45000,
            quantity: 2,
          },
          {
            id: 2,
            name: "Vita Francesa",
            price: 38000,
            quantity: 1,
          },
        ],
        total: 128000,
        status: "paid",
        invoice: generateInvoiceNumber(),
      },
    ]

    localStorage.setItem("saludyvidaOrders", JSON.stringify(initialOrders))
    console.log("Default orders initialized locally")
  }

  if (!localStorage.getItem("saludyvidaChatMessages")) {
    const initialChat = [
      {
        id: 1,
        sender: "system",
        message: "¡Bienvenido al chat de soporte de Salud y Vida! ¿En qué podemos ayudarte?",
        timestamp: new Date().toISOString(),
        read: true,
      },
    ]

    localStorage.setItem("saludyvidaChatMessages", JSON.stringify(initialChat))
    console.log("Default chat initialized locally")
  }
}

function loadDataFromLocalStorage() {
  const storedProducts = localStorage.getItem("saludyvidaProducts")
  if (storedProducts) {
    products = JSON.parse(storedProducts)
  }

  const storedOrders = localStorage.getItem("saludyvidaOrders")
  if (storedOrders) {
    orders = JSON.parse(storedOrders)
  }

  const storedChat = localStorage.getItem("saludyvidaChatMessages")
  if (storedChat) {
    chatMessages = JSON.parse(storedChat)
  }

  loadCartFromLocalStorage()
}

function loadCartFromLocalStorage() {
  const storedCart = localStorage.getItem("saludyvidaCart")
  if (storedCart) {
    cart = JSON.parse(storedCart)
    updateCart()
  }
}

function saveCartToLocalStorage() {
  localStorage.setItem("saludyvidaCart", JSON.stringify(cart))
}

// Payment Verification
async function verifyPayment(method, confirmationNumber) {
  try {
    // Simulate payment verification
    if (method === "nequi") {
      return await verifyNequiPayment(confirmationNumber)
    } else if (method === "bancolombia") {
      return await verifyBancolombiaPayment(confirmationNumber)
    }
    return { verified: true, message: "Pago en efectivo pendiente de verificación" }
  } catch (error) {
    console.error("Payment verification error:", error)
    return { verified: false, message: "Error al verificar el pago" }
  }
}

async function verifyNequiPayment(confirmationNumber) {
  // Simulate Nequi API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple validation: confirmation number should be at least 8 characters
      const isValid = confirmationNumber && confirmationNumber.length >= 8
      resolve({
        verified: isValid,
        message: isValid ? "Pago verificado exitosamente" : "Número de confirmación inválido",
      })
    }, 2000) // Simulate API delay
  })
}

async function verifyBancolombiaPayment(confirmationNumber) {
  // Simulate Bancolombia API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple validation: confirmation number should be at least 10 characters
      const isValid = confirmationNumber && confirmationNumber.length >= 10
      resolve({
        verified: isValid,
        message: isValid ? "Pago verificado exitosamente" : "Número de confirmación inválido",
      })
    }, 2000) // Simulate API delay
  })
}

// Invoice Generation
function generateInvoiceNumber() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `SV-${year}${month}${day}-${random}`
}

function generateInvoicePDF(order) {
  const invoiceContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Factura ${order.invoice}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .company-info { margin-bottom: 20px; }
        .invoice-info { margin-bottom: 20px; }
        .customer-info { margin-bottom: 20px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .items-table th { background-color: #f2f2f2; }
        .total { text-align: right; font-size: 18px; font-weight: bold; }
        .payment-info { margin-top: 20px; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>SALUD Y VIDA</h1>
        <p>Distribuidora de Productos Naturales</p>
        <p>Sincelejo, Sucre, Colombia</p>
        <p>Tel: 300 272 7399</p>
      </div>
      
      <div class="invoice-info">
        <h2>FACTURA DE VENTA</h2>
        <p><strong>Número de Factura:</strong> ${order.invoice}</p>
        <p><strong>Fecha:</strong> ${new Date(order.date).toLocaleDateString("es-CO")}</p>
        <p><strong>Número de Pedido:</strong> #${order.id}</p>
      </div>
      
      <div class="customer-info">
        <h3>DATOS DEL CLIENTE</h3>
        <p><strong>Nombre:</strong> ${order.customer.name}</p>
        <p><strong>Teléfono:</strong> ${order.customer.phone}</p>
        <p><strong>Dirección:</strong> ${order.customer.address}</p>
      </div>
      
      <table class="items-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>$${formatPrice(item.price)}</td>
              <td>$${formatPrice(item.price * item.quantity)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      
      <div class="total">
        <p>TOTAL: $${formatPrice(order.total)}</p>
      </div>
      
      <div class="payment-info">
        <h3>INFORMACIÓN DE PAGO</h3>
        <p><strong>Método de Pago:</strong> ${getPaymentMethodName(order.payment.method)}</p>
        <p><strong>Estado:</strong> ${getStatusName(order.status)}</p>
        ${order.payment.confirmation ? `<p><strong>Confirmación:</strong> ${order.payment.confirmation}</p>` : ""}
      </div>
      
      <div class="footer">
        <p>Gracias por su compra. Esta factura es válida como comprobante de pago.</p>
        <p>Para cualquier consulta, contáctenos al 300 272 7399</p>
      </div>
    </body>
    </html>
  `

  // Create and download the invoice
  const blob = new Blob([invoiceContent], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `Factura_${order.invoice}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Check Admin Login Status
function checkAdminLoginStatus() {
  const adminLoggedIn = localStorage.getItem("saludyvidaAdminLoggedIn")
  const adminUser = localStorage.getItem("saludyvidaAdminUser")

  if (adminLoggedIn === "true" && adminUser) {
    isAdminLoggedIn = true
    currentAdmin = JSON.parse(adminUser)
  }
}

// Set up Event Listeners
function setupEventListeners() {
  // Category Buttons
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")
      currentCategory = button.getAttribute("data-category")
      displayProducts()
    })
  })

  // Cart Icon
  if (cartIcon) {
    cartIcon.addEventListener("click", () => {
      cartSidebar.classList.add("active")
      overlay.style.display = "block"
    })
  }

  // Close Cart
  if (closeCart) {
    closeCart.addEventListener("click", () => {
      cartSidebar.classList.remove("active")
      overlay.style.display = "none"
    })
  }

  // Mobile Menu
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      menu.classList.toggle("active")
    })
  }

  // Checkout Button
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        showNotification("Tu carrito está vacío. Agrega productos antes de proceder al pago.", "error")
        return
      }
      showCheckoutModal()
    })
  }

  // Payment Select
  if (paymentSelect) {
    paymentSelect.addEventListener("change", () => {
      const selectedPayment = paymentSelect.value

      if (nequiDetails) nequiDetails.style.display = "none"
      if (bancolombiaDetails) bancolombiaDetails.style.display = "none"

      if (selectedPayment === "nequi" && nequiDetails) {
        nequiDetails.style.display = "block"
      } else if (selectedPayment === "bancolombia" && bancolombiaDetails) {
        bancolombiaDetails.style.display = "block"
      }
    })
  }

  // Close Modal Buttons
  closeModalButtons.forEach((button) => {
    button.addEventListener("click", closeModals)
  })

  // Place Order Button
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", placeOrder)
  }

  // Continue Shopping Button
  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener("click", () => {
      closeModals()
    })
  }

  // Overlay Click
  if (overlay) {
    overlay.addEventListener("click", () => {
      cartSidebar.classList.remove("active")
      closeModals()
    })
  }

  // Admin Button
  if (adminBtn) {
    adminBtn.addEventListener("click", () => {
      if (isAdminLoggedIn) {
        showAdminDashboard()
      } else {
        showAdminLogin()
      }
    })
  }

  // Admin Login Form
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", handleAdminLogin)
  }

  // Admin Logout Button
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", handleAdminLogout)
  }

  // Admin Tab Buttons
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.getAttribute("data-tab")
      switchTab(tab)
    })
  })

  // Admin Filters
  if (orderStatusFilter) {
    orderStatusFilter.addEventListener("change", filterOrders)
  }
  if (orderSearch) {
    orderSearch.addEventListener("input", filterOrders)
  }
  if (productCategoryFilter) {
    productCategoryFilter.addEventListener("change", filterProducts)
  }
  if (productSearch) {
    productSearch.addEventListener("input", filterProducts)
  }

  // Add Product Button
  if (addProductBtn) {
    addProductBtn.addEventListener("click", () => {
      openProductModal()
    })
  }

  // Product Form
  if (productForm) {
    productForm.addEventListener("submit", saveProduct)
  }

  // Update Order Status Button
  if (updateOrderStatusBtn) {
    updateOrderStatusBtn.addEventListener("click", updateOrderStatus)
  }

  // Contact Form
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()
      showNotification("Gracias por tu mensaje. Te contactaremos pronto.", "success")
      contactForm.reset()
    })
  }

  // Newsletter Form
  const newsletterForm = document.getElementById("newsletterForm")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault()
      showNotification("¡Gracias por suscribirte a nuestro boletín!", "success")
      newsletterForm.reset()
    })
  }

  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight
        const targetPosition = targetElement.offsetTop - headerHeight
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
        menu.classList.remove("active")
      }
    })
  })

  // Chat button
  const chatButton = document.getElementById("chat-button")
  if (chatButton) {
    chatButton.addEventListener("click", toggleChat)
  }

  // Chat close button
  const chatClose = document.getElementById("chat-close")
  if (chatClose) {
    chatClose.addEventListener("click", toggleChat)
  }

  // Chat send button
  const chatSendButton = document.getElementById("chat-send")
  if (chatSendButton) {
    chatSendButton.addEventListener("click", sendChatMessage)
  }

  // Chat input enter key
  const chatInput = document.getElementById("chat-input")
  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        sendChatMessage()
      }
    })
  }

  // Order tracking form
  const orderTrackingForm = document.getElementById("order-tracking-form")
  if (orderTrackingForm) {
    orderTrackingForm.addEventListener("submit", (e) => {
      e.preventDefault()
      trackOrder()
    })
  }
}

// Display Products Function
function displayProducts() {
  if (!productsGrid) return

  productsGrid.innerHTML = ""

  const filteredProducts =
    currentCategory === "all" ? products : products.filter((product) => product.category === currentCategory)

  filteredProducts.forEach((product) => {
    const productCard = document.createElement("div")
    productCard.classList.add("product-card")
    productCard.setAttribute("data-category", product.category)

    const isInStock = product.stock > 0

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-img" 
           onerror="this.src='https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'">
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-category">${getCategoryName(product.category)}</p>
        <p class="product-price">$${formatPrice(product.price)}</p>
        ${
          isInStock
            ? `<button class="add-to-cart" data-id="${product.id}">Añadir al Carrito</button>`
            : `<button class="add-to-cart" disabled>Agotado</button>`
        }
      </div>
    `

    productsGrid.appendChild(productCard)
  })

  // Add event listeners to the "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart:not([disabled])")
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart)
  })
}

// Add to Cart Function
function addToCart(e) {
  const productId = Number.parseInt(e.target.getAttribute("data-id"))
  const product = products.find((item) => item.id === productId)

  if (!product || product.stock <= 0) {
    showNotification("Lo sentimos, este producto está agotado.", "error")
    return
  }

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    if (existingItem.quantity >= product.stock) {
      showNotification(`Lo sentimos, solo hay ${product.stock} unidades disponibles de este producto.`, "error")
      return
    }
    existingItem.quantity += 1
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  saveCartToLocalStorage()
  updateCart()

  cartSidebar.classList.add("active")
  overlay.style.display = "block"

  e.target.textContent = "¡Añadido!"
  e.target.style.backgroundColor = "#8BC34A"

  setTimeout(() => {
    e.target.textContent = "Añadir al Carrito"
    e.target.style.backgroundColor = ""
  }, 1000)

  showNotification("Producto agregado al carrito", "success")
}

// Update Cart Function
function updateCart() {
  if (!cartItems) return

  cartItems.innerHTML = ""

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>'
    if (cartTotalAmount) cartTotalAmount.textContent = "0"
    const cartCount = document.querySelector(".cart-count")
    if (cartCount) cartCount.textContent = "0"
    return
  }

  let total = 0
  let itemCount = 0

  cart.forEach((item) => {
    const cartItem = document.createElement("div")
    cartItem.classList.add("cart-item")

    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img"
           onerror="this.src='https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'">
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.name}</h4>
        <p class="cart-item-price">$${formatPrice(item.price)}</p>
        <div class="cart-item-quantity">
          <button class="quantity-btn decrease" data-id="${item.id}">-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn increase" data-id="${item.id}">+</button>
          <span class="remove-item" data-id="${item.id}">
            <i class="fas fa-trash"></i>
          </span>
        </div>
      </div>
    `

    cartItems.appendChild(cartItem)

    total += item.price * item.quantity
    itemCount += item.quantity
  })

  if (cartTotalAmount) cartTotalAmount.textContent = formatPrice(total)
  const cartCount = document.querySelector(".cart-count")
  if (cartCount) cartCount.textContent = itemCount

  // Add event listeners to quantity buttons and remove buttons
  const decreaseButtons = document.querySelectorAll(".decrease")
  const increaseButtons = document.querySelectorAll(".increase")
  const removeButtons = document.querySelectorAll(".remove-item")

  decreaseButtons.forEach((button) => {
    button.addEventListener("click", decreaseQuantity)
  })

  increaseButtons.forEach((button) => {
    button.addEventListener("click", increaseQuantity)
  })

  removeButtons.forEach((button) => {
    button.addEventListener("click", removeItem)
  })
}

// Cart quantity functions
function decreaseQuantity(e) {
  const productId = Number.parseInt(e.target.getAttribute("data-id"))
  const cartItem = cart.find((item) => item.id === productId)

  if (cartItem.quantity > 1) {
    cartItem.quantity -= 1
  } else {
    cart = cart.filter((item) => item.id !== productId)
  }

  saveCartToLocalStorage()
  updateCart()
}

function increaseQuantity(e) {
  const productId = Number.parseInt(e.target.getAttribute("data-id"))
  const cartItem = cart.find((item) => item.id === productId)
  const product = products.find((item) => item.id === productId)

  if (cartItem.quantity >= product.stock) {
    showNotification(`Lo sentimos, solo hay ${product.stock} unidades disponibles de este producto.`, "error")
    return
  }

  cartItem.quantity += 1
  saveCartToLocalStorage()
  updateCart()
}

function removeItem(e) {
  const productId = Number.parseInt(e.target.closest(".remove-item").getAttribute("data-id"))
  cart = cart.filter((item) => item.id !== productId)
  saveCartToLocalStorage()
  updateCart()
  showNotification("Producto eliminado del carrito", "success")
}

// Show Checkout Modal Function
function showCheckoutModal() {
  if (!orderItems || !orderTotalAmount) return

  orderItems.innerHTML = ""
  let total = 0

  cart.forEach((item) => {
    const orderItem = document.createElement("div")
    orderItem.classList.add("order-item")

    orderItem.innerHTML = `
      <div class="order-item-name">${item.name} x ${item.quantity}</div>
      <div class="order-item-price">$${formatPrice(item.price * item.quantity)}</div>
    `

    orderItems.appendChild(orderItem)
    total += item.price * item.quantity
  })

  orderTotalAmount.textContent = formatPrice(total)

  if (checkoutModal) checkoutModal.style.display = "block"
  if (overlay) overlay.style.display = "block"
}

// Place Order Function
async function placeOrder(e) {
  e.preventDefault()

  const fullname = document.getElementById("fullname").value
  const address = document.getElementById("address").value
  const phone = document.getElementById("checkout-phone").value
  const payment = document.getElementById("payment").value

  if (!fullname || !address || !phone || !payment) {
    showNotification("Por favor completa todos los campos obligatorios.", "error")
    return
  }

  let confirmationNumber = ""
  let paymentVerified = false

  // Disable the button and show loading
  placeOrderBtn.disabled = true
  placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...'

  try {
    if (payment === "nequi") {
      confirmationNumber = document.getElementById("nequi-confirmation").value
      if (!confirmationNumber) {
        showNotification("Por favor ingresa el número de confirmación de Nequi.", "error")
        placeOrderBtn.disabled = false
        placeOrderBtn.innerHTML = "Realizar Pedido"
        return
      }

      showNotification("Verificando pago con Nequi...", "info")
      const verification = await verifyPayment("nequi", confirmationNumber)
      paymentVerified = verification.verified

      if (!paymentVerified) {
        showNotification(verification.message, "error")
        placeOrderBtn.disabled = false
        placeOrderBtn.innerHTML = "Realizar Pedido"
        return
      }
    } else if (payment === "bancolombia") {
      confirmationNumber = document.getElementById("bancolombia-confirmation").value
      if (!confirmationNumber) {
        showNotification("Por favor ingresa el número de confirmación de Bancolombia.", "error")
        placeOrderBtn.disabled = false
        placeOrderBtn.innerHTML = "Realizar Pedido"
        return
      }

      showNotification("Verificando pago con Bancolombia...", "info")
      const verification = await verifyPayment("bancolombia", confirmationNumber)
      paymentVerified = verification.verified

      if (!paymentVerified) {
        showNotification(verification.message, "error")
        placeOrderBtn.disabled = false
        placeOrderBtn.innerHTML = "Realizar Pedido"
        return
      }
    } else {
      // Cash payment
      paymentVerified = false // Will be verified manually
    }

    const randomOrderNumber = Math.floor(100000 + Math.random() * 900000)
    const invoiceNumber = generateInvoiceNumber()

    // Store the order number for tracking
    lastOrderNumber = randomOrderNumber

    const order = {
      id: randomOrderNumber,
      date: new Date().toISOString(),
      customer: {
        name: fullname,
        address: address,
        phone: phone,
      },
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      payment: {
        method: payment,
        confirmation: confirmationNumber,
        verified: paymentVerified,
      },
      status: paymentVerified ? "paid" : "pending",
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      invoice: invoiceNumber,
    }

    // Save order to cloud and local storage
    await saveOrderToCloud(order)

    // Update product stock
    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.id)
      if (product) {
        product.stock -= item.quantity
      }
    })

    // Save updated products
    await saveProductsToCloud()

    // Generate and download invoice if payment is verified
    if (paymentVerified) {
      setTimeout(() => {
        generateInvoicePDF(order)
        showNotification("Factura generada y descargada automáticamente", "success")
      }, 1000)
    }

    // Update order number in confirmation modal
    if (orderNumber) orderNumber.textContent = randomOrderNumber

    // Clear cart
    cart = []
    saveCartToLocalStorage()
    updateCart()

    // Refresh product display
    displayProducts()

    // Show confirmation
    if (checkoutModal) checkoutModal.style.display = "none"
    if (confirmationModal) confirmationModal.style.display = "block"

    // Clear form
    document.getElementById("fullname").value = ""
    document.getElementById("address").value = ""
    document.getElementById("checkout-phone").value = ""
    document.getElementById("payment").value = ""
    document.getElementById("nequi-confirmation").value = ""
    document.getElementById("bancolombia-confirmation").value = ""

    const successMessage = paymentVerified
      ? "¡Pedido realizado y pago verificado exitosamente!"
      : "¡Pedido realizado! El pago será verificado manualmente."

    showNotification(successMessage, "success")

    // Send notification to admin
    sendAdminNotification("Nuevo pedido", `Se ha recibido un nuevo pedido #${randomOrderNumber} de ${fullname}`)
  } catch (error) {
    console.error("Error processing order:", error)
    showNotification("Error al procesar el pedido. Intenta de nuevo.", "error")
  } finally {
    // Re-enable the button
    placeOrderBtn.disabled = false
    placeOrderBtn.innerHTML = "Realizar Pedido"
  }
}

// Admin Functions
function showAdminLogin() {
  if (adminLoginModal) {
    adminLoginModal.style.display = "block"
    overlay.style.display = "block"
  }
}

function showAdminDashboard() {
  if (adminDashboardModal) {
    adminDashboardModal.style.display = "block"
    overlay.style.display = "block"

    if (currentAdmin && adminUsernameDisplay) {
      adminUsernameDisplay.textContent = currentAdmin.username
    }

    loadAdminData()

    // Mark chat messages as read when admin opens dashboard
    if (isAdminLoggedIn) {
      markChatMessagesAsRead()
    }
  }
}

async function handleAdminLogin(e) {
  e.preventDefault()

  const username = document.getElementById("admin-username").value.trim()
  const password = document.getElementById("admin-password").value.trim()

  if (!username || !password) {
    showAdminError("Por favor ingresa usuario y contraseña.")
    return
  }

  try {
    showAdminError("Verificando credenciales...", "info")

    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error("Error al conectar con el servidor")
    }

    const users = await response.json()
    const user = users.find((user) => user.username === username && user.password === password)

    if (user) {
      isAdminLoggedIn = true
      currentAdmin = {
        id: user.id,
        username: user.username,
      }

      localStorage.setItem("saludyvidaAdminLoggedIn", "true")
      localStorage.setItem("saludyvidaAdminUser", JSON.stringify(currentAdmin))

      adminLoginModal.style.display = "none"
      showAdminDashboard()

      showNotification(`¡Bienvenido ${user.username}!`, "success")

      adminLoginForm.reset()
      if (adminLoginError) adminLoginError.textContent = ""
    } else {
      showAdminError("Usuario o contraseña incorrectos.")
    }
  } catch (error) {
    console.error("Error en login:", error)
    showAdminError("Error al conectar con el servidor. Intenta de nuevo.")
  }
}

function handleAdminLogout() {
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    isAdminLoggedIn = false
    currentAdmin = null

    localStorage.removeItem("saludyvidaAdminLoggedIn")
    localStorage.removeItem("saludyvidaAdminUser")

    closeModals()
    showNotification("Sesión cerrada correctamente", "success")
  }
}

function showAdminError(message, type = "error") {
  if (adminLoginError) {
    adminLoginError.textContent = message
    adminLoginError.className = `error-message ${type}`
  }
}

async function loadAdminData() {
  console.log("Loading admin data...")

  // Show loading in admin tables
  if (ordersTableBody) {
    ordersTableBody.innerHTML =
      '<tr><td colspan="6" style="text-align: center; padding: 20px;">Cargando pedidos...</td></tr>'
  }
  if (productsTableBody) {
    productsTableBody.innerHTML =
      '<tr><td colspan="7" style="text-align: center; padding: 20px;">Cargando productos...</td></tr>'
  }

  try {
    // Reload data from cloud
    await loadAllData()

    // Display data
    displayOrders()
    displayAdminProducts()
    updateAdminStats()

    // Update chat notification badge
    if (isAdminLoggedIn) {
      unreadMessages = chatMessages.filter((msg) => !msg.read && msg.sender === "user").length
      updateChatNotificationBadge()
    }
  } catch (error) {
    console.error("Error loading admin data:", error)
    showNotification("Error al cargar datos del administrador", "error")
  }
}

function switchTab(tabName) {
  tabButtons.forEach((btn) => btn.classList.remove("active"))
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active")

  tabContents.forEach((content) => content.classList.remove("active"))
  document.getElementById(`${tabName}-tab`).classList.add("active")
}

// Orders Management
function displayOrders() {
  if (!ordersTableBody) return

  ordersTableBody.innerHTML = ""

  if (orders.length === 0) {
    ordersTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 40px; color: #666;">
          <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
          No hay pedidos registrados
        </td>
      </tr>
    `
    return
  }

  const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date))

  sortedOrders.forEach((order) => {
    const row = document.createElement("tr")

    const formattedDate = new Date(order.date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    row.innerHTML = `
      <td><strong>#${order.id}</strong></td>
      <td>${formattedDate}</td>
      <td>${order.customer.name}</td>
      <td><strong>$${formatPrice(order.total)}</strong></td>
      <td>
        <span class="order-status status-${order.status}">
          ${getStatusName(order.status)}
        </span>
        ${order.payment && order.payment.verified ? '<i class="fas fa-check-circle" style="color: green; margin-left: 5px;" title="Pago verificado"></i>' : ""}
      </td>
      <td>
        <button class="action-btn view-order" data-id="${order.id}" title="Ver detalles">
          <i class="fas fa-eye"></i>
        </button>
        ${
          order.invoice
            ? `<button class="action-btn download-invoice" data-id="${order.id}" title="Descargar factura">
          <i class="fas fa-download"></i>
        </button>`
            : ""
        }
        <button class="action-btn delete-btn delete-order" data-id="${order.id}" title="Eliminar">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `

    ordersTableBody.appendChild(row)
  })

  addOrderEventListeners()
}

function addOrderEventListeners() {
  const viewButtons = document.querySelectorAll(".view-order")
  const deleteButtons = document.querySelectorAll(".delete-order")
  const downloadButtons = document.querySelectorAll(".download-invoice")

  viewButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation()
      const orderId = Number.parseInt(button.getAttribute("data-id"))
      openOrderDetailModal(orderId)
    })
  })

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation()
      const orderId = Number.parseInt(button.getAttribute("data-id"))
      deleteOrder(orderId)
    })
  })

  downloadButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation()
      const orderId = Number.parseInt(button.getAttribute("data-id"))
      const order = orders.find((o) => o.id === orderId)
      if (order) {
        generateInvoicePDF(order)
      }
    })
  })
}

function filterOrders() {
  const statusFilter = orderStatusFilter ? orderStatusFilter.value : "all"
  const searchTerm = orderSearch ? orderSearch.value.toLowerCase() : ""

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesSearch =
      order.id.toString().includes(searchTerm) ||
      order.customer.name.toLowerCase().includes(searchTerm) ||
      order.customer.phone.includes(searchTerm)

    return matchesStatus && matchesSearch
  })

  displayFilteredOrders(filteredOrders)
}

function displayFilteredOrders(filteredOrders) {
  if (!ordersTableBody) return

  ordersTableBody.innerHTML = ""

  if (filteredOrders.length === 0) {
    ordersTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 40px; color: #666;">
          <i class="fas fa-search" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
          No se encontraron pedidos
        </td>
      </tr>
    `
    return
  }

  const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.date) - new Date(a.date))

  sortedOrders.forEach((order) => {
    const row = document.createElement("tr")

    const formattedDate = new Date(order.date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    row.innerHTML = `
      <td><strong>#${order.id}</strong></td>
      <td>${formattedDate}</td>
      <td>${order.customer.name}</td>
      <td><strong>$${formatPrice(order.total)}</strong></td>
      <td>
        <span class="order-status status-${order.status}">
          ${getStatusName(order.status)}
        </span>
        ${order.payment && order.payment.verified ? '<i class="fas fa-check-circle" style="color: green; margin-left: 5px;" title="Pago verificado"></i>' : ""}
      </td>
      <td>
        <button class="action-btn view-order" data-id="${order.id}" title="Ver detalles">
          <i class="fas fa-eye"></i>
        </button>
        ${
          order.invoice
            ? `<button class="action-btn download-invoice" data-id="${order.id}" title="Descargar factura">
          <i class="fas fa-download"></i>
        </button>`
            : ""
        }
        <button class="action-btn delete-btn delete-order" data-id="${order.id}" title="Eliminar">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `

    ordersTableBody.appendChild(row)
  })

  addOrderEventListeners()
}

function openOrderDetailModal(orderId) {
  const order = orders.find((order) => order.id === orderId)

  if (!order) {
    showNotification("Pedido no encontrado", "error")
    return
  }

  currentOrderId = orderId

  if (orderDetailNumber) orderDetailNumber.textContent = order.id
  if (orderCustomerName) orderCustomerName.textContent = order.customer.name
  if (orderCustomerPhone) orderCustomerPhone.textContent = order.customer.phone
  if (orderCustomerAddress) orderCustomerAddress.textContent = order.customer.address

  if (orderPaymentMethod) {
    orderPaymentMethod.textContent = getPaymentMethodName(order.payment.method)
  }

  if (orderPaymentStatus) {
    const statusText = order.payment && order.payment.verified ? "VERIFICADO" : getStatusName(order.status)
    orderPaymentStatus.textContent = statusText
    orderPaymentStatus.className = `order-status status-${order.status}`
  }

  if (order.payment && order.payment.confirmation && order.payment.method !== "efectivo") {
    if (orderConfirmationContainer) {
      orderConfirmationContainer.style.display = "block"
    }
    if (orderConfirmationNumber) {
      orderConfirmationNumber.textContent = order.payment.confirmation
    }
  } else {
    if (orderConfirmationContainer) {
      orderConfirmationContainer.style.display = "none"
    }
  }

  if (orderItemsBody) {
    orderItemsBody.innerHTML = ""

    order.items.forEach((item) => {
      const row = document.createElement("tr")

      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>$${formatPrice(item.price)}</td>
        <td><strong>$${formatPrice(item.price * item.quantity)}</strong></td>
      `

      orderItemsBody.appendChild(row)
    })
  }

  if (orderDetailTotal) {
    orderDetailTotal.textContent = formatPrice(order.total)
  }

  if (orderStatus) {
    orderStatus.value = order.status
  }

  if (orderDetailModal) {
    orderDetailModal.style.display = "block"
  }
  if (overlay) {
    overlay.style.display = "block"
  }
}

async function updateOrderStatus() {
  if (!currentOrderId) return

  const newStatus = orderStatus ? orderStatus.value : null

  if (!newStatus) {
    showNotification("Selecciona un estado válido", "error")
    return
  }

  const orderIndex = orders.findIndex((order) => order.id === currentOrderId)

  if (orderIndex === -1) {
    showNotification("Pedido no encontrado", "error")
    return
  }

  // Update order status
  orders[orderIndex].status = newStatus

  // Update in cloud and local storage
  try {
    await updateOrderInCloud(orders[orderIndex])
  } catch (error) {
    console.error("Error updating order in cloud:", error)
  }

  if (orderPaymentStatus) {
    orderPaymentStatus.textContent = getStatusName(newStatus)
    orderPaymentStatus.className = `order-status status-${newStatus}`
  }

  displayOrders()
  showNotification("Estado del pedido actualizado correctamente", "success")

  // Generate updated invoice
  if (orders[orderIndex].invoice) {
    setTimeout(() => {
      generateInvoicePDF(orders[orderIndex])
      showNotification("Factura actualizada generada", "success")
    }, 1000)
  }
}

async function deleteOrder(orderId) {
  if (!confirm("¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.")) {
    return
  }

  orders = orders.filter((order) => order.id !== orderId)

  // Save to cloud and local storage
  try {
    // This would need implementation to delete from cloud storage
    localStorage.setItem("saludyvidaOrders", JSON.stringify(orders))
  } catch (error) {
    console.error("Error deleting order:", error)
  }

  displayOrders()
  showNotification("Pedido eliminado correctamente", "success")
}

// Products Management
function displayAdminProducts() {
  if (!productsTableBody) return

  productsTableBody.innerHTML = ""

  if (products.length === 0) {
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: #666;">
          <i class="fas fa-box-open" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
          No hay productos registrados
          <br><br>
          <button class="btn" onclick="openProductModal()">Agregar Primer Producto</button>
        </td>
      </tr>
    `
    return
  }

  products.forEach((product) => {
    const row = document.createElement("tr")

    let stockClass = ""
    if (product.stock === 0) {
      stockClass = "stock-out"
    } else if (product.stock <= 5) {
      stockClass = "stock-low"
    } else {
      stockClass = "stock-good"
    }

    row.innerHTML = `
      <td><strong>${product.id}</strong></td>
      <td class="product-image-cell">
        <img src="${product.image}" 
             alt="${product.name}" 
             onerror="this.src='https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'">
      </td>
      <td><strong>${product.name}</strong></td>
      <td>${getCategoryName(product.category)}</td>
      <td><strong>$${formatPrice(product.price)}</strong></td>
      <td>
        <span class="stock-indicator ${stockClass}">
          ${product.stock}
          ${product.stock === 0 ? " (Agotado)" : product.stock <= 5 ? " (Bajo)" : ""}
        </span>
      </td>
      <td>
        <button class="action-btn edit-product" data-id="${product.id}" title="Editar">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete-btn delete-product" data-id="${product.id}" title="Eliminar">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `

    productsTableBody.appendChild(row)
  })

  addProductEventListeners()
}

function addProductEventListeners() {
  const editButtons = document.querySelectorAll(".edit-product")
  const deleteButtons = document.querySelectorAll(".delete-product")

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number.parseInt(button.getAttribute("data-id"))
      openProductModal(productId)
    })
  })

  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number.parseInt(button.getAttribute("data-id"))
      deleteProduct(productId)
    })
  })
}

function filterProducts() {
  const categoryFilter = productCategoryFilter ? productCategoryFilter.value : "all"
  const searchTerm = productSearch ? productSearch.value.toLowerCase() : ""

  const filteredProducts = products.filter((product) => {
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm)

    return matchesCategory && matchesSearch
  })

  displayFilteredProducts(filteredProducts)
}

function displayFilteredProducts(filteredProducts) {
  if (!productsTableBody) return

  productsTableBody.innerHTML = ""

  if (filteredProducts.length === 0) {
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: #666;">
          <i class="fas fa-search" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
          No se encontraron productos
        </td>
      </tr>
    `
    return
  }

  filteredProducts.forEach((product) => {
    const row = document.createElement("tr")

    let stockClass = ""
    if (product.stock === 0) {
      stockClass = "stock-out"
    } else if (product.stock <= 5) {
      stockClass = "stock-low"
    } else {
      stockClass = "stock-good"
    }

    row.innerHTML = `
      <td><strong>${product.id}</strong></td>
      <td class="product-image-cell">
        <img src="${product.image}" 
             alt="${product.name}"
             onerror="this.src='https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'">
      </td>
      <td><strong>${product.name}</strong></td>
      <td>${getCategoryName(product.category)}</td>
      <td><strong>$${formatPrice(product.price)}</strong></td>
      <td>
        <span class="stock-indicator ${stockClass}">
          ${product.stock}
          ${product.stock === 0 ? " (Agotado)" : product.stock <= 5 ? " (Bajo)" : ""}
        </span>
      </td>
      <td>
        <button class="action-btn edit-product" data-id="${product.id}" title="Editar">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete-btn delete-product" data-id="${product.id}" title="Eliminar">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `

    productsTableBody.appendChild(row)
  })

  addProductEventListeners()
}

function openProductModal(productId = null) {
  if (productId) {
    const product = products.find((p) => p.id === productId)

    if (!product) {
      showNotification("Producto no encontrado", "error")
      return
    }

    currentProductId = productId
    if (productModalTitle) productModalTitle.textContent = "Editar Producto"
    if (productIdInput) productIdInput.value = product.id
    if (productNameInput) productNameInput.value = product.name
    if (productCategoryInput) productCategoryInput.value = product.category
    if (productPriceInput) productPriceInput.value = product.price
    if (productStockInput) productStockInput.value = product.stock
    if (productDescriptionInput) productDescriptionInput.value = product.description
    if (productImageInput) productImageInput.value = product.image || ""
    if (saveProductBtn) saveProductBtn.textContent = "Actualizar Producto"
  } else {
    currentProductId = null
    if (productModalTitle) productModalTitle.textContent = "Agregar Nuevo Producto"
    if (productForm) productForm.reset()
    if (productIdInput) productIdInput.value = ""
    if (saveProductBtn) saveProductBtn.textContent = "Guardar Producto"
  }

  if (productModal) productModal.style.display = "block"
  if (overlay) overlay.style.display = "block"
}

async function saveProduct(e) {
  e.preventDefault()

  const productId = productIdInput ? productIdInput.value : ""
  const name = productNameInput ? productNameInput.value.trim() : ""
  const category = productCategoryInput ? productCategoryInput.value : ""
  const price = productPriceInput ? Number.parseInt(productPriceInput.value) : 0
  const stock = productStockInput ? Number.parseInt(productStockInput.value) : 0
  const description = productDescriptionInput ? productDescriptionInput.value.trim() : ""
  const image = productImageInput ? productImageInput.value.trim() : ""

  if (!name || !category || !price || !description) {
    showNotification("Por favor completa todos los campos obligatorios", "error")
    return
  }

  if (price <= 0) {
    showNotification("El precio debe ser mayor a 0", "error")
    return
  }

  if (stock < 0) {
    showNotification("El stock no puede ser negativo", "error")
    return
  }

  const productData = {
    name,
    category,
    price,
    stock,
    description,
    image:
      image ||
      `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&text=${encodeURIComponent(name)}`,
  }

  try {
    if (currentProductId) {
      const productIndex = products.findIndex((p) => p.id === currentProductId)

      if (productIndex !== -1) {
        products[productIndex] = {
          id: currentProductId,
          ...productData,
        }
        showNotification("Producto actualizado correctamente", "success")
      }
    } else {
      const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1

      products.push({
        id: newId,
        ...productData,
      })
      showNotification("Producto agregado correctamente", "success")
    }

    // Save to cloud and local storage
    await saveProductsToCloud()
    displayAdminProducts()
    displayProducts() // Refresh public view
    closeModals()
  } catch (error) {
    console.error("Error saving product:", error)
    showNotification("Error al guardar el producto", "error")
  }
}

async function deleteProduct(productId) {
  const product = products.find((p) => p.id === productId)

  if (!product) {
    showNotification("Producto no encontrado", "error")
    return
  }

  if (!confirm(`¿Estás seguro de que deseas eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
    return
  }

  try {
    products = products.filter((product) => product.id !== productId)

    // Save to cloud and local storage
    await saveProductsToCloud()
    displayAdminProducts()
    displayProducts() // Refresh public view
    showNotification("Producto eliminado correctamente", "success")
  } catch (error) {
    console.error("Error deleting product:", error)
    showNotification("Error al eliminar el producto", "error")
  }
}

// Statistics
function updateAdminStats() {
  const totalOrdersEl = document.getElementById("total-orders")
  const totalSalesEl = document.getElementById("total-sales")
  const totalProductsEl = document.getElementById("total-products")
  const lowStockEl = document.getElementById("low-stock")

  if (totalOrdersEl) totalOrdersEl.textContent = orders.length

  if (totalSalesEl) {
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0)
    totalSalesEl.textContent = `$${formatPrice(totalSales)}`
  }

  if (totalProductsEl) totalProductsEl.textContent = products.length

  if (lowStockEl) {
    const lowStock = products.filter((product) => product.stock <= 5).length
    lowStockEl.textContent = lowStock
  }
}

// Chat System Functions
function initializeChat() {
  // Create chat widget HTML
  const chatWidget = document.createElement("div")
  chatWidget.innerHTML = `
    <!-- Chat Button -->
    <div id="chat-button" class="chat-button">
      <i class="fas fa-comments"></i>
      <span id="chat-notification-badge" class="chat-notification-badge" style="display: none;">0</span>
    </div>

    <!-- Chat Window -->
    <div id="chat-window" class="chat-window">
      <div class="chat-header">
        <div class="chat-header-info">
          <i class="fas fa-headset"></i>
          <span>Soporte Salud y Vida</span>
        </div>
        <button id="chat-close" class="chat-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="chat-body">
        <div id="chat-messages" class="chat-messages">
          <!-- Messages will be loaded here -->
        </div>
        
        <!-- Order Tracking Section -->
        <div id="order-tracking" class="order-tracking">
          <div class="tracking-header">
            <i class="fas fa-search"></i>
            <span>Consultar Estado del Pedido</span>
          </div>
          <form id="order-tracking-form">
            <input type="number" id="order-number-input" placeholder="Número de pedido (ej: 123456)" required>
            <button type="submit">Consultar</button>
          </form>
          <div id="order-status-result" class="order-status-result"></div>
        </div>
      </div>
      
      <div class="chat-footer">
        <div class="chat-input-container">
          <input type="text" id="chat-input" placeholder="Escribe tu mensaje...">
          <button id="chat-send">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  `

  document.body.appendChild(chatWidget)

  // Load existing messages
  loadChatMessages()

  // Update notification badge
  updateChatNotificationBadge()
}

function toggleChat() {
  const chatWindow = document.getElementById("chat-window")
  const chatButton = document.getElementById("chat-button")

  if (chatWindow.classList.contains("active")) {
    chatWindow.classList.remove("active")
    chatButton.classList.remove("active")
  } else {
    chatWindow.classList.add("active")
    chatButton.classList.add("active")

    // Scroll to bottom
    const chatMessages = document.getElementById("chat-messages")
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight
    }
  }
}

function loadChatMessages() {
  const chatMessagesContainer = document.getElementById("chat-messages")
  if (!chatMessagesContainer) return

  chatMessagesContainer.innerHTML = ""

  chatMessages.forEach((message) => {
    const messageElement = createChatMessageElement(message)
    chatMessagesContainer.appendChild(messageElement)
  })

  // Scroll to bottom
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight
}

function createChatMessageElement(message) {
  const messageDiv = document.createElement("div")
  messageDiv.className = `chat-message ${message.sender}`

  const time = new Date(message.timestamp).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  })

  messageDiv.innerHTML = `
    <div class="message-content">
      ${message.message}
    </div>
    <div class="message-time">${time}</div>
  `

  return messageDiv
}

async function sendChatMessage() {
  const chatInput = document.getElementById("chat-input")
  const message = chatInput.value.trim()

  if (!message) return

  const newMessage = {
    id: Date.now(),
    sender: "user",
    message: message,
    timestamp: new Date().toISOString(),
    read: false,
  }

  // Save message
  await saveChatMessageToCloud(newMessage)

  // Clear input
  chatInput.value = ""

  // Reload messages
  loadChatMessages()

  // Send notification to admin
  sendAdminNotification("Nuevo mensaje de chat", `Usuario: ${message}`)

  // Auto-reply for common questions
  setTimeout(() => {
    sendAutoReply(message)
  }, 1000)
}

async function sendAutoReply(userMessage) {
  const lowerMessage = userMessage.toLowerCase()
  let autoReply = null

  if (lowerMessage.includes("horario") || lowerMessage.includes("hora")) {
    autoReply = "Nuestro horario de atención es de lunes a viernes de 8:00 AM a 6:00 PM y sábados de 8:00 AM a 2:00 PM."
  } else if (lowerMessage.includes("envío") || lowerMessage.includes("entrega")) {
    autoReply = "Realizamos envíos a domicilio en Sincelejo. El tiempo de entrega es de 1-2 días hábiles."
  } else if (lowerMessage.includes("pago") || lowerMessage.includes("método")) {
    autoReply = "Aceptamos pagos por Nequi (300 272 7399), Bancolombia y efectivo contra entrega."
  } else if (lowerMessage.includes("precio") || lowerMessage.includes("costo")) {
    autoReply =
      "Puedes ver todos nuestros precios en la sección de productos. ¿Hay algún producto específico que te interese?"
  } else if (lowerMessage.includes("hola") || lowerMessage.includes("buenos") || lowerMessage.includes("buenas")) {
    autoReply = "¡Hola! Bienvenido a Salud y Vida. ¿En qué podemos ayudarte hoy?"
  } else {
    autoReply =
      "Gracias por tu mensaje. Un representante te responderá pronto. Mientras tanto, puedes consultar el estado de tu pedido usando el formulario de arriba."
  }

  if (autoReply) {
    const systemMessage = {
      id: Date.now() + 1,
      sender: "system",
      message: autoReply,
      timestamp: new Date().toISOString(),
      read: true,
    }

    await saveChatMessageToCloud(systemMessage)
    loadChatMessages()
  }
}

function trackOrder() {
  const orderNumberInput = document.getElementById("order-number-input")
  const orderNumber = orderNumberInput.value.trim()
  const resultContainer = document.getElementById("order-status-result")

  if (!orderNumber) {
    resultContainer.innerHTML = '<p class="error">Por favor ingresa un número de pedido válido.</p>'
    return
  }

  const order = orders.find((o) => o.id.toString() === orderNumber)

  if (!order) {
    resultContainer.innerHTML = '<p class="error">No se encontró ningún pedido con ese número.</p>'
    return
  }

  const statusColor = {
    pending: "#ff9800",
    paid: "#4caf50",
    shipped: "#2196f3",
    delivered: "#8bc34a",
  }

  resultContainer.innerHTML = `
    <div class="order-found">
      <h4>Pedido #${order.id}</h4>
      <p><strong>Cliente:</strong> ${order.customer.name}</p>
      <p><strong>Fecha:</strong> ${new Date(order.date).toLocaleDateString("es-CO")}</p>
      <p><strong>Total:</strong> $${formatPrice(order.total)}</p>
      <p><strong>Estado:</strong> 
        <span style="color: ${statusColor[order.status]}; font-weight: bold;">
          ${getStatusName(order.status)}
        </span>
      </p>
      <p><strong>Método de pago:</strong> ${getPaymentMethodName(order.payment.method)}</p>
      ${order.payment.verified ? '<p style="color: green;"><i class="fas fa-check-circle"></i> Pago verificado</p>' : ""}
    </div>
  `

  orderNumberInput.value = ""
}

function sendAdminNotification(subject, message) {
  // Simulate sending email notification to admin
  console.log(`Email notification sent to ${ADMIN_EMAIL}:`)
  console.log(`Subject: ${subject}`)
  console.log(`Message: ${message}`)

  // In a real implementation, this would send an actual email
  // For now, we'll show a notification if admin is logged in
  if (isAdminLoggedIn) {
    showNotification(`Nueva notificación: ${subject}`, "info")

    // Update unread messages count
    unreadMessages++
    updateChatNotificationBadge()
  }
}

function updateChatNotificationBadge() {
  const badge = document.getElementById("chat-notification-badge")
  if (badge) {
    if (unreadMessages > 0 && isAdminLoggedIn) {
      badge.textContent = unreadMessages
      badge.style.display = "block"
    } else {
      badge.style.display = "none"
    }
  }
}

// Close Modals
function closeModals() {
  if (checkoutModal) checkoutModal.style.display = "none"
  if (confirmationModal) confirmationModal.style.display = "none"
  if (adminLoginModal) adminLoginModal.style.display = "none"
  if (adminDashboardModal) adminDashboardModal.style.display = "none"
  if (productModal) productModal.style.display = "none"
  if (orderDetailModal) orderDetailModal.style.display = "none"
  if (overlay) overlay.style.display = "none"

  currentOrderId = null
  currentProductId = null
}

// Initialize Testimonials Slider
function initTestimonialsSlider() {
  const testimonials = document.querySelectorAll(".testimonial")
  let currentTestimonial = 0

  if (testimonials.length === 0) return

  testimonials.forEach((testimonial, index) => {
    if (index !== 0) {
      testimonial.style.display = "none"
    }
  })

  testimonialDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      testimonials[currentTestimonial].style.display = "none"
      testimonialDots[currentTestimonial].classList.remove("active")

      currentTestimonial = index

      testimonials[currentTestimonial].style.display = "block"
      testimonialDots[currentTestimonial].classList.add("active")
    })
  })

  setInterval(() => {
    testimonials[currentTestimonial].style.display = "none"
    testimonialDots[currentTestimonial].classList.remove("active")

    currentTestimonial = (currentTestimonial + 1) % testimonials.length

    testimonials[currentTestimonial].style.display = "block"
    testimonialDots[currentTestimonial].classList.add("active")
  }, 5000)
}

// Helper Functions
function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

function getCategoryName(category) {
  const categories = {
    vitaminas: "Vitaminas",
    suplementos: "Suplementos",
    hierbas: "Hierbas Medicinales",
  }
  return categories[category] || category
}

function getStatusName(status) {
  const statuses = {
    pending: "Pendiente de pago",
    paid: "Pagado",
    shipped: "Enviado",
    delivered: "Entregado",
  }
  return statuses[status] || status
}

function getPaymentMethodName(method) {
  const methods = {
    nequi: "Nequi",
    bancolombia: "Bancolombia",
    efectivo: "Efectivo (Contra entrega)",
  }
  return methods[method] || method
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    font-weight: 600;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    ${type === "success" ? "background-color: #4CAF50;" : type === "info" ? "background-color: #2196F3;" : "background-color: #f44336;"}
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

console.log(
  "Script.js loaded successfully with full functionality including cloud storage, payment verification, invoice generation, and chat support system",
)
