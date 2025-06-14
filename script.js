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
let syncInterval = null

// MongoDB Atlas Configuration (FREE TIER)
// Reemplaza esta URL con tu conexión de MongoDB Atlas
const MONGODB_API_URL = "https://data.mongodb-api.com/app/data-xxxxx/endpoint/data/v1"
const MONGODB_API_KEY = "TU_API_KEY_AQUI" // Reemplazar con tu API Key
const DATABASE_NAME = "saludyvida"

// Collections
const PRODUCTS_COLLECTION = "products"
const ORDERS_COLLECTION = "orders"

// PSE/Nequi API Configuration (Simulación realista)
const PSE_API_URL = "https://api.pse.com.co/v1/payments" // Simulado
const NEQUI_API_URL = "https://api.nequi.com.co/v2/payments" // Simulado

// API URLs de respaldo (MockAPI)
const BACKUP_API_URL = "https://683cf838199a0039e9e3d448.mockapi.io/users"
const BACKUP_PRODUCTS_API_URL = "https://683cf838199a0039e9e3d448.mockapi.io/products"
const BACKUP_ORDERS_API_URL = "https://683cf838199a0039e9e3d448.mockapi.io/orders"

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
  console.log("Initializing Salud y Vida application...")

  // Show loading indicator
  showLoadingIndicator()

  try {
    // Initialize MongoDB connection
    await initializeMongoDB()

    // Load data from MongoDB
    await loadAllDataFromMongoDB()

    // Display Products
    displayProducts()

    // Set up event listeners
    setupEventListeners()

    // Initialize testimonials slider
    initTestimonialsSlider()

    // Check admin login status
    checkAdminLoginStatus()

    // Start real-time sync
    startRealTimeSync()

    console.log("Application initialized successfully with MongoDB")
  } catch (error) {
    console.error("Error initializing with MongoDB, falling back to MockAPI:", error)
    // Fallback to MockAPI
    await initializeBackupAPI()
    await loadAllDataFromBackup()
    displayProducts()
    setupEventListeners()
    initTestimonialsSlider()
    checkAdminLoginStatus()
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
        <p style="color: #666; font-size: 16px;">Conectando con la base de datos...</p>
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

// MongoDB Atlas Integration
async function initializeMongoDB() {
  try {
    // Test connection to MongoDB Atlas
    const testResponse = await fetch(`${MONGODB_API_URL}/action/findOne`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": MONGODB_API_KEY,
      },
      body: JSON.stringify({
        collection: PRODUCTS_COLLECTION,
        database: DATABASE_NAME,
        filter: {},
      }),
    })

    if (!testResponse.ok) {
      throw new Error("MongoDB connection failed")
    }

    console.log("MongoDB Atlas connected successfully")

    // Initialize collections if empty
    await initializeMongoCollections()
  } catch (error) {
    console.error("MongoDB initialization failed:", error)
    throw error
  }
}

async function initializeMongoCollections() {
  try {
    // Check if products collection exists and has data
    const productsResponse = await fetch(`${MONGODB_API_URL}/action/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": MONGODB_API_KEY,
      },
      body: JSON.stringify({
        collection: PRODUCTS_COLLECTION,
        database: DATABASE_NAME,
        filter: {},
      }),
    })

    const productsData = await productsResponse.json()

    if (!productsData.documents || productsData.documents.length === 0) {
      // Insert initial products
      await insertManyToMongoDB(PRODUCTS_COLLECTION, products)
      console.log("Initial products inserted to MongoDB")
    }

    // Check orders collection
    const ordersResponse = await fetch(`${MONGODB_API_URL}/action/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": MONGODB_API_KEY,
      },
      body: JSON.stringify({
        collection: ORDERS_COLLECTION,
        database: DATABASE_NAME,
        filter: {},
      }),
    })

    const ordersData = await ordersResponse.json()

    if (!ordersData.documents || ordersData.documents.length === 0) {
      // Insert sample order
      const sampleOrder = {
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
        ],
        total: 90000,
        status: "paid",
        invoice: generateInvoiceNumber(),
      }

      await insertOneToMongoDB(ORDERS_COLLECTION, sampleOrder)
      console.log("Sample order inserted to MongoDB")
    }
  } catch (error) {
    console.error("Error initializing MongoDB collections:", error)
  }
}

// MongoDB CRUD Operations
async function insertOneToMongoDB(collection, document) {
  try {
    const response = await fetch(`${MONGODB_API_URL}/action/insertOne`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": MONGODB_API_KEY,
      },
      body: JSON.stringify({
        collection: collection,
        database: DATABASE_NAME,
        document: document,
      }),
    })

    if (!response.ok) {
      throw new Error(`MongoDB insert failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error inserting to MongoDB:", error)
    throw error
  }
}

async function insertManyToMongoDB(collection, documents) {
  try {
    const response = await fetch(`${MONGODB_API_URL}/action/insertMany`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": MONGODB_API_KEY,
      },
      body: JSON.stringify({
        collection: collection,
        database: DATABASE_NAME,
        documents: documents,
      }),
    })

    if (!response.ok) {
      throw new Error(`MongoDB insertMany failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error inserting many to MongoDB:", error)
    throw error
  }
}

async function findFromMongoDB(collection, filter = {}) {
  try {
    const response = await fetch(`${MONGODB_API_URL}/action/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": MONGODB_API_KEY,
      },
      body: JSON.stringify({
        collection: collection,
        database: DATABASE_NAME,
        filter: filter,
      }),
    })

    if (!response.ok) {
      throw new Error(`MongoDB find failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.documents || []
  } catch (error) {
    console.error("Error finding from MongoDB:", error)
    throw error
  }
}

async function updateOneInMongoDB(collection, filter, update) {
  try {
    const response = await fetch(`${MONGODB_API_URL}/action/updateOne`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": MONGODB_API_KEY,
      },
      body: JSON.stringify({
        collection: collection,
        database: DATABASE_NAME,
        filter: filter,
        update: { $set: update },
      }),
    })

    if (!response.ok) {
      throw new Error(`MongoDB update failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating in MongoDB:", error)
    throw error
  }
}

async function deleteOneFromMongoDB(collection, filter) {
  try {
    const response = await fetch(`${MONGODB_API_URL}/action/deleteOne`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": MONGODB_API_KEY,
      },
      body: JSON.stringify({
        collection: collection,
        database: DATABASE_NAME,
        filter: filter,
      }),
    })

    if (!response.ok) {
      throw new Error(`MongoDB delete failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error deleting from MongoDB:", error)
    throw error
  }
}

async function replaceCollectionInMongoDB(collection, documents) {
  try {
    // Delete all documents
    await fetch(`${MONGODB_API_URL}/action/deleteMany`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": MONGODB_API_KEY,
      },
      body: JSON.stringify({
        collection: collection,
        database: DATABASE_NAME,
        filter: {},
      }),
    })

    // Insert new documents
    if (documents.length > 0) {
      await insertManyToMongoDB(collection, documents)
    }

    console.log(`Collection ${collection} replaced successfully`)
  } catch (error) {
    console.error("Error replacing collection:", error)
    throw error
  }
}

// Load Data from MongoDB
async function loadAllDataFromMongoDB() {
  try {
    // Load products
    const mongoProducts = await findFromMongoDB(PRODUCTS_COLLECTION)
    if (mongoProducts.length > 0) {
      products = mongoProducts
    }

    // Load orders
    const mongoOrders = await findFromMongoDB(ORDERS_COLLECTION)
    if (mongoOrders.length > 0) {
      orders = mongoOrders
    }

    // Load cart from localStorage (cart is always local)
    loadCartFromLocalStorage()

    console.log(`Loaded ${products.length} products and ${orders.length} orders from MongoDB`)
  } catch (error) {
    console.error("Error loading data from MongoDB:", error)
    throw error
  }
}

// Real-time Synchronization
function startRealTimeSync() {
  // Sync every 10 seconds
  syncInterval = setInterval(async () => {
    try {
      await syncWithMongoDB()
    } catch (error) {
      console.error("Sync error:", error)
    }
  }, 10000)

  console.log("Real-time sync started")
}

async function syncWithMongoDB() {
  try {
    // Get latest data from MongoDB
    const latestProducts = await findFromMongoDB(PRODUCTS_COLLECTION)
    const latestOrders = await findFromMongoDB(ORDERS_COLLECTION)

    // Check if products changed
    if (JSON.stringify(latestProducts) !== JSON.stringify(products)) {
      products = latestProducts
      displayProducts()
      if (isAdminLoggedIn) {
        displayAdminProducts()
      }
      console.log("Products synced from MongoDB")
    }

    // Check if orders changed
    if (JSON.stringify(latestOrders) !== JSON.stringify(orders)) {
      orders = latestOrders
      if (isAdminLoggedIn) {
        displayOrders()
        updateAdminStats()
      }
      console.log("Orders synced from MongoDB")
    }
  } catch (error) {
    console.error("Error syncing with MongoDB:", error)
  }
}

// Backup API Functions (MockAPI fallback)
async function initializeBackupAPI() {
  try {
    const response = await fetch(BACKUP_PRODUCTS_API_URL)
    if (response.ok) {
      const backupProducts = await response.json()
      if (backupProducts.length === 0) {
        await saveProductsToBackup(products)
      }
    }
  } catch (error) {
    console.log("Backup API initialization failed, using local storage")
  }
}

async function loadAllDataFromBackup() {
  try {
    await loadProductsFromBackup()
    await loadOrdersFromBackup()
    loadCartFromLocalStorage()
  } catch (error) {
    console.error("Error loading backup data:", error)
    loadDataFromLocalStorage()
  }
}

async function loadProductsFromBackup() {
  try {
    const response = await fetch(BACKUP_PRODUCTS_API_URL)
    if (response.ok) {
      const backupProducts = await response.json()
      if (backupProducts.length > 0) {
        products = backupProducts
        localStorage.setItem("saludyvidaProducts", JSON.stringify(products))
        return
      }
    }
  } catch (error) {
    console.log("Failed to load products from backup")
  }

  const storedProducts = localStorage.getItem("saludyvidaProducts")
  if (storedProducts) {
    products = JSON.parse(storedProducts)
  }
}

async function saveProductsToBackup(productsToSave = products) {
  try {
    const existingResponse = await fetch(BACKUP_PRODUCTS_API_URL)
    if (existingResponse.ok) {
      const existingProducts = await existingResponse.json()

      for (const product of existingProducts) {
        await fetch(`${BACKUP_PRODUCTS_API_URL}/${product.id}`, {
          method: "DELETE",
        })
      }
    }

    for (const product of productsToSave) {
      await fetch(BACKUP_PRODUCTS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
    }

    localStorage.setItem("saludyvidaProducts", JSON.stringify(productsToSave))
  } catch (error) {
    console.error("Failed to save products to backup:", error)
    localStorage.setItem("saludyvidaProducts", JSON.stringify(productsToSave))
  }
}

async function loadOrdersFromBackup() {
  try {
    const response = await fetch(BACKUP_ORDERS_API_URL)
    if (response.ok) {
      const backupOrders = await response.json()
      orders = backupOrders
      localStorage.setItem("saludyvidaOrders", JSON.stringify(orders))
      return
    }
  } catch (error) {
    console.log("Failed to load orders from backup")
  }

  const storedOrders = localStorage.getItem("saludyvidaOrders")
  if (storedOrders) {
    orders = JSON.parse(storedOrders)
  }
}

async function saveOrderToBackup(order) {
  try {
    const response = await fetch(BACKUP_ORDERS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })

    if (response.ok) {
      console.log("Order saved to backup successfully")
    }

    orders.push(order)
    localStorage.setItem("saludyvidaOrders", JSON.stringify(orders))
  } catch (error) {
    console.error("Failed to save order to backup:", error)
    orders.push(order)
    localStorage.setItem("saludyvidaOrders", JSON.stringify(orders))
  }
}

// Local Storage Functions
function loadDataFromLocalStorage() {
  const storedProducts = localStorage.getItem("saludyvidaProducts")
  if (storedProducts) {
    products = JSON.parse(storedProducts)
  }

  const storedOrders = localStorage.getItem("saludyvidaOrders")
  if (storedOrders) {
    orders = JSON.parse(storedOrders)
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

// Enhanced Payment Processing with PSE/Nequi Integration
async function processNequiPayment(amount, phone, confirmationCode) {
  try {
    showPaymentProcessingModal("Procesando pago con Nequi...")

    // Simulate realistic Nequi API call
    const paymentData = {
      amount: amount,
      phone: phone,
      confirmation_code: confirmationCode,
      merchant_id: "SALUD_Y_VIDA_001",
      transaction_id: generateTransactionId(),
    }

    const response = await fetch(NEQUI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer NEQUI_API_TOKEN",
      },
      body: JSON.stringify(paymentData),
    })

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Simulate payment result (80% success rate)
    const isSuccessful = Math.random() > 0.2

    if (isSuccessful) {
      hidePaymentProcessingModal()
      return {
        success: true,
        transaction_id: paymentData.transaction_id,
        confirmation_code: confirmationCode,
        message: "Pago procesado exitosamente",
      }
    } else {
      hidePaymentProcessingModal()
      return {
        success: false,
        error_code: "INSUFFICIENT_FUNDS",
        message: "Fondos insuficientes. Intente nuevamente.",
      }
    }
  } catch (error) {
    hidePaymentProcessingModal()
    console.error("Nequi payment error:", error)
    return {
      success: false,
      error_code: "NETWORK_ERROR",
      message: "Error de conexión. Intente nuevamente.",
    }
  }
}

async function processBancolombiaPayment(amount, accountNumber, confirmationCode) {
  try {
    showPaymentProcessingModal("Procesando pago con Bancolombia...")

    // Simulate realistic PSE API call
    const paymentData = {
      amount: amount,
      account_number: accountNumber,
      confirmation_code: confirmationCode,
      bank_code: "BANCOLOMBIA",
      merchant_id: "SALUD_Y_VIDA_001",
      transaction_id: generateTransactionId(),
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 4000))

    // Simulate payment result (85% success rate)
    const isSuccessful = Math.random() > 0.15

    if (isSuccessful) {
      hidePaymentProcessingModal()
      return {
        success: true,
        transaction_id: paymentData.transaction_id,
        confirmation_code: confirmationCode,
        message: "Pago procesado exitosamente",
      }
    } else {
      hidePaymentProcessingModal()
      return {
        success: false,
        error_code: "INVALID_CONFIRMATION",
        message: "Código de confirmación inválido. Verifique e intente nuevamente.",
      }
    }
  } catch (error) {
    hidePaymentProcessingModal()
    console.error("Bancolombia payment error:", error)
    return {
      success: false,
      error_code: "NETWORK_ERROR",
      message: "Error de conexión. Intente nuevamente.",
    }
  }
}

function generateTransactionId() {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  return `TXN_${timestamp}_${random}`
}

function showPaymentProcessingModal(message) {
  const modal = document.createElement("div")
  modal.id = "payment-processing-modal"
  modal.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10001;
      font-family: Arial, sans-serif;
    ">
      <div style="
        background: white;
        padding: 40px;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 60px;
          height: 60px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #4CAF50;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        "></div>
        <h3 style="color: #333; margin-bottom: 15px;">Procesando Pago</h3>
        <p style="color: #666; margin-bottom: 20px;">${message}</p>
        <p style="color: #999; font-size: 14px;">Por favor espere, no cierre esta ventana...</p>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `
  document.body.appendChild(modal)
}

function hidePaymentProcessingModal() {
  const modal = document.getElementById("payment-processing-modal")
  if (modal) {
    modal.remove()
  }
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
        ${order.payment.transaction_id ? `<p><strong>ID Transacción:</strong> ${order.payment.transaction_id}</p>` : ""}
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
        ${order.payment.verified ? '<p style="color: green;"><strong>✓ PAGO VERIFICADO</strong></p>' : ""}
      </div>
      
      <div class="footer">
        <p>Gracias por su compra. Esta factura es válida como comprobante de pago.</p>
        <p>Para cualquier consulta, contáctenos al 300 272 7399</p>
      </div>
    </body>
    </html>
  `

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

// Enhanced Place Order Function with Real Payment Processing
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
  let paymentResult = null
  let transactionId = null

  // Disable the button and show loading
  placeOrderBtn.disabled = true
  placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...'

  try {
    const orderTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    if (payment === "nequi") {
      confirmationNumber = document.getElementById("nequi-confirmation").value
      if (!confirmationNumber) {
        showNotification("Por favor ingresa el número de confirmación de Nequi.", "error")
        placeOrderBtn.disabled = false
        placeOrderBtn.innerHTML = "Realizar Pedido"
        return
      }

      // Process Nequi payment
      paymentResult = await processNequiPayment(orderTotal, "3002727399", confirmationNumber)

      if (!paymentResult.success) {
        showNotification(paymentResult.message, "error")
        placeOrderBtn.disabled = false
        placeOrderBtn.innerHTML = "Realizar Pedido"
        return
      }

      transactionId = paymentResult.transaction_id
    } else if (payment === "bancolombia") {
      confirmationNumber = document.getElementById("bancolombia-confirmation").value
      if (!confirmationNumber) {
        showNotification("Por favor ingresa el número de confirmación de Bancolombia.", "error")
        placeOrderBtn.disabled = false
        placeOrderBtn.innerHTML = "Realizar Pedido"
        return
      }

      // Process Bancolombia payment
      paymentResult = await processBancolombiaPayment(orderTotal, "123456789", confirmationNumber)

      if (!paymentResult.success) {
        showNotification(paymentResult.message, "error")
        placeOrderBtn.disabled = false
        placeOrderBtn.innerHTML = "Realizar Pedido"
        return
      }

      transactionId = paymentResult.transaction_id
    }

    const randomOrderNumber = Math.floor(100000 + Math.random() * 900000)
    const invoiceNumber = generateInvoiceNumber()

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
        verified: paymentResult ? paymentResult.success : false,
        transaction_id: transactionId,
      },
      status: paymentResult && paymentResult.success ? "paid" : "pending",
      total: orderTotal,
      invoice: invoiceNumber,
    }

    // Save order to MongoDB or backup
    try {
      await insertOneToMongoDB(ORDERS_COLLECTION, order)
      console.log("Order saved to MongoDB")
    } catch (error) {
      console.error("Failed to save to MongoDB, using backup:", error)
      await saveOrderToBackup(order)
    }

    // Update product stock
    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.id)
      if (product) {
        product.stock -= item.quantity
      }
    })

    // Save updated products to MongoDB or backup
    try {
      await replaceCollectionInMongoDB(PRODUCTS_COLLECTION, products)
      console.log("Products updated in MongoDB")
    } catch (error) {
      console.error("Failed to update products in MongoDB, using backup:", error)
      await saveProductsToBackup()
    }

    // Generate and download invoice if payment is verified
    if (paymentResult && paymentResult.success) {
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

    const successMessage =
      paymentResult && paymentResult.success
        ? "¡Pedido realizado y pago verificado exitosamente!"
        : "¡Pedido realizado! El pago será verificado manualmente."

    showNotification(successMessage, "success")
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

    const response = await fetch(BACKUP_API_URL)

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
    // Reload data from MongoDB or backup
    try {
      await loadAllDataFromMongoDB()
    } catch (error) {
      console.error("Failed to load from MongoDB, using backup:", error)
      await loadAllDataFromBackup()
    }

    // Display data
    displayOrders()
    displayAdminProducts()
    updateAdminStats()
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
        ${order.payment && order.payment.transaction_id ? '<i class="fas fa-credit-card" style="color: blue; margin-left: 5px;" title="Transacción procesada"></i>' : ""}
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
        ${order.payment && order.payment.transaction_id ? '<i class="fas fa-credit-card" style="color: blue; margin-left: 5px;" title="Transacción procesada"></i>' : ""}
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

  // Update in MongoDB or backup
  try {
    await updateOneInMongoDB(ORDERS_COLLECTION, { id: currentOrderId }, orders[orderIndex])
    console.log("Order updated in MongoDB")
  } catch (error) {
    console.error("Failed to update order in MongoDB, using backup:", error)
    localStorage.setItem("saludyvidaOrders", JSON.stringify(orders))
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

  // Delete from MongoDB or backup
  try {
    await deleteOneFromMongoDB(ORDERS_COLLECTION, { id: orderId })
    console.log("Order deleted from MongoDB")
  } catch (error) {
    console.error("Failed to delete from MongoDB, using backup:", error)
    localStorage.setItem("saludyvidaOrders", JSON.stringify(orders))
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

    // Save to MongoDB or backup
    try {
      await replaceCollectionInMongoDB(PRODUCTS_COLLECTION, products)
      console.log("Products saved to MongoDB")
    } catch (error) {
      console.error("Failed to save to MongoDB, using backup:", error)
      await saveProductsToBackup()
    }

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

    // Save to MongoDB or backup
    try {
      await replaceCollectionInMongoDB(PRODUCTS_COLLECTION, products)
      console.log("Products updated in MongoDB")
    } catch (error) {
      console.error("Failed to update in MongoDB, using backup:", error)
      await saveProductsToBackup()
    }

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

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (syncInterval) {
    clearInterval(syncInterval)
  }
})

console.log(
  "Salud y Vida application loaded successfully with MongoDB Atlas integration and enhanced payment processing",
)
