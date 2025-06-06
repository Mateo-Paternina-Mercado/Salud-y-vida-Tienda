// Products Data
let products = [
  {
    id: 1,
    name: "Colagesan",
    category: "suplementos",
    price: 45000,
    image: "/placeholder.svg?height=200&width=200&text=Colagesan",
    description: "Colágeno con vitamina E para la piel, cabello y articulaciones.",
    stock: 15,
  },
  {
    id: 2,
    name: "Vita Francesa",
    category: "vitaminas",
    price: 38000,
    image: "/placeholder.svg?height=200&width=200&text=Vita%20Francesa",
    description: "Suplemento con Borojó, Chontaduro y Maca. Energizante natural.",
    stock: 20,
  },
  {
    id: 3,
    name: "Omega 3",
    category: "suplementos",
    price: 42000,
    image: "/placeholder.svg?height=200&width=200&text=Omega%203",
    description: "Aceite de pescado rico en ácidos grasos esenciales para la salud cardiovascular.",
    stock: 12,
  },
  {
    id: 4,
    name: "Spirulina",
    category: "suplementos",
    price: 35000,
    image: "/placeholder.svg?height=200&width=200&text=Spirulina",
    description: "Alga rica en proteínas, vitaminas y minerales. Potente antioxidante.",
    stock: 8,
  },
  {
    id: 5,
    name: "Vitamina C",
    category: "vitaminas",
    price: 28000,
    image: "/placeholder.svg?height=200&width=200&text=Vitamina%20C",
    description: "Refuerza el sistema inmunológico y favorece la absorción de hierro.",
    stock: 25,
  },
  {
    id: 6,
    name: "Té Verde",
    category: "hierbas",
    price: 18000,
    image: "/placeholder.svg?height=200&width=200&text=T%C3%A9%20Verde",
    description: "Antioxidante natural que ayuda a acelerar el metabolismo.",
    stock: 30,
  },
  {
    id: 7,
    name: "Manzanilla",
    category: "hierbas",
    price: 15000,
    image: "/placeholder.svg?height=200&width=200&text=Manzanilla",
    description: "Hierba con propiedades antiinflamatorias y relajantes.",
    stock: 40,
  },
  {
    id: 8,
    name: "Complejo B",
    category: "vitaminas",
    price: 32000,
    image: "/placeholder.svg?height=200&width=200&text=Complejo%20B",
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

// API URL
const API_URL = "https://683cf838199a0039e9e3d448.mockapi.io/users"

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
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing application...")

  // Initialize default data
  initializeDefaultData()

  // Load data from localStorage
  loadDataFromLocalStorage()

  // Display Products
  displayProducts()

  // Set up event listeners
  setupEventListeners()

  // Initialize testimonials slider
  initTestimonialsSlider()

  // Check admin login status
  checkAdminLoginStatus()

  console.log("Application initialized successfully")
})

// Initialize default data
function initializeDefaultData() {
  // Initialize products if not exists
  if (!localStorage.getItem("saludyvidaProducts")) {
    localStorage.setItem("saludyvidaProducts", JSON.stringify(products))
    console.log("Default products initialized")
  }

  // Initialize orders if not exists
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
      },
      {
        id: 100002,
        date: new Date(Date.now() - 86400000).toISOString(),
        customer: {
          name: "Carlos Rodríguez",
          phone: "3109876543",
          address: "Carrera 25 #18-45, Sincelejo",
        },
        payment: {
          method: "efectivo",
          confirmation: null,
        },
        items: [
          {
            id: 3,
            name: "Omega 3",
            price: 42000,
            quantity: 1,
          },
        ],
        total: 42000,
        status: "pending",
      },
    ]

    localStorage.setItem("saludyvidaOrders", JSON.stringify(initialOrders))
    console.log("Default orders initialized")
  }
}

// Load data from localStorage
function loadDataFromLocalStorage() {
  // Load products
  const storedProducts = localStorage.getItem("saludyvidaProducts")
  if (storedProducts) {
    products = JSON.parse(storedProducts)
  }

  // Load orders
  const storedOrders = localStorage.getItem("saludyvidaOrders")
  if (storedOrders) {
    orders = JSON.parse(storedOrders)
  }

  // Load cart
  const storedCart = localStorage.getItem("saludyvidaCart")
  if (storedCart) {
    cart = JSON.parse(storedCart)
    updateCart()
  }

  console.log(`Loaded ${products.length} products, ${orders.length} orders, ${cart.length} cart items`)
}

// Save data to localStorage
function saveDataToLocalStorage() {
  localStorage.setItem("saludyvidaProducts", JSON.stringify(products))
  localStorage.setItem("saludyvidaOrders", JSON.stringify(orders))
  localStorage.setItem("saludyvidaCart", JSON.stringify(cart))
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
      <img src="${product.image}" alt="${product.name}" class="product-img">
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

  saveDataToLocalStorage()
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
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
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

  saveDataToLocalStorage()
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
  saveDataToLocalStorage()
  updateCart()
}

function removeItem(e) {
  const productId = Number.parseInt(e.target.closest(".remove-item").getAttribute("data-id"))
  cart = cart.filter((item) => item.id !== productId)
  saveDataToLocalStorage()
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
function placeOrder(e) {
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

  if (payment === "nequi") {
    confirmationNumber = document.getElementById("nequi-confirmation").value
    if (!confirmationNumber) {
      showNotification("Por favor ingresa el número de confirmación de Nequi.", "error")
      return
    }
  }

  if (payment === "bancolombia") {
    confirmationNumber = document.getElementById("bancolombia-confirmation").value
    if (!confirmationNumber) {
      showNotification("Por favor ingresa el número de confirmación de Bancolombia.", "error")
      return
    }
  }

  const randomOrderNumber = Math.floor(100000 + Math.random() * 900000)
  if (orderNumber) orderNumber.textContent = randomOrderNumber

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
    },
    status: payment === "efectivo" ? "pending" : "paid",
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }

  // Add order to orders array
  orders.push(order)

  // Update product stock
  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id)
    if (product) {
      product.stock -= item.quantity
    }
  })

  // Save all data
  saveDataToLocalStorage()

  // Clear cart
  cart = []
  saveDataToLocalStorage()
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

  showNotification("¡Pedido realizado con éxito!", "success")
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

function loadAdminData() {
  console.log("Loading admin data...")
  displayOrders()
  displayAdminProducts()
  updateAdminStats()
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
      </td>
      <td>
        <button class="action-btn view-order" data-id="${order.id}" title="Ver detalles">
          <i class="fas fa-eye"></i>
        </button>
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
      </td>
      <td>
        <button class="action-btn view-order" data-id="${order.id}" title="Ver detalles">
          <i class="fas fa-eye"></i>
        </button>
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
    orderPaymentStatus.textContent = getStatusName(order.status)
    orderPaymentStatus.className = `order-status status-${order.status}`
  }

  if (order.payment.confirmation && order.payment.method !== "efectivo") {
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

function updateOrderStatus() {
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

  orders[orderIndex].status = newStatus
  saveDataToLocalStorage()

  if (orderPaymentStatus) {
    orderPaymentStatus.textContent = getStatusName(newStatus)
    orderPaymentStatus.className = `order-status status-${newStatus}`
  }

  displayOrders()
  showNotification("Estado del pedido actualizado correctamente", "success")
}

function deleteOrder(orderId) {
  if (!confirm("¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.")) {
    return
  }

  orders = orders.filter((order) => order.id !== orderId)
  saveDataToLocalStorage()
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
        <img src="${product.image || "/placeholder.svg?height=60&width=60&text=" + encodeURIComponent(product.name)}" 
             alt="${product.name}" 
             onerror="this.src='/placeholder.svg?height=60&width=60&text=Producto'">
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
        <img src="${product.image || "/placeholder.svg?height=60&width=60&text=" + encodeURIComponent(product.name)}" 
             alt="${product.name}"
             onerror="this.src='/placeholder.svg?height=60&width=60&text=Producto'">
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

function saveProduct(e) {
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
    image: image || `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(name)}`,
  }

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

  saveDataToLocalStorage()
  displayAdminProducts()
  displayProducts() // Refresh public view
  closeModals()
}

function deleteProduct(productId) {
  const product = products.find((p) => p.id === productId)

  if (!product) {
    showNotification("Producto no encontrado", "error")
    return
  }

  if (!confirm(`¿Estás seguro de que deseas eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
    return
  }

  products = products.filter((product) => product.id !== productId)
  saveDataToLocalStorage()
  displayAdminProducts()
  displayProducts() // Refresh public view
  showNotification("Producto eliminado correctamente", "success")
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
    ${type === "success" ? "background-color: #4CAF50;" : "background-color: #f44336;"}
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

console.log("Script.js loaded successfully with full admin functionality")
