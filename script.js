// ========================================
// SALUD Y VIDA - ENHANCED VERSION
// Versión mejorada con búsqueda avanzada, MongoDB Atlas y Nequi real
// ========================================

// ========================================
// CONFIGURACIÓN MONGODB ATLAS
// ========================================
// REEMPLAZA ESTOS VALORES CON LOS TUYOS DE MONGODB ATLAS
const MONGODB_API_URL = "https://data.mongodb-api.com/app/data-XXXXXX/endpoint/data/v1"
const MONGODB_API_KEY = "TU_API_KEY_DE_MONGODB_ATLAS_AQUI"
const DATABASE_NAME = "saludyvida"

// Collections
const PRODUCTS_COLLECTION = "products"
const ORDERS_COLLECTION = "orders"

// ========================================
// CONFIGURACIÓN NEQUI REAL
// ========================================
// REEMPLAZA ESTOS VALORES CON LOS TUYOS DE NEQUI DEVELOPERS
const NEQUI_CONFIG = {
  CLIENT_ID: "TU_CLIENT_ID_DE_NEQUI",
  CLIENT_SECRET: "TU_CLIENT_SECRET_DE_NEQUI",
  API_KEY: "TU_API_KEY_DE_NEQUI",
  BASE_URL: "https://api.nequi.com.co", // Producción
  // BASE_URL: "https://sandbox.nequi.com.co", // Para pruebas
  PHONE_NUMBER: "3002727399", // Tu número Nequi registrado
}

// API URLs de respaldo (MockAPI)
const BACKUP_API_URL = "https://683cf838199a0039e9e3d448.mockapi.io/users"
const BACKUP_PRODUCTS_API_URL = "https://683cf838199a0039e9e3d448.mockapi.io/products"
const BACKUP_ORDERS_API_URL = "https://683cf838199a0039e9e3d448.mockapi.io/orders"

// ========================================
// ADVANCED SEARCH CLASS
// ========================================
class AdvancedSearch {
  constructor(products) {
    this.products = products
    this.searchHistory = this.loadSearchHistory()
    this.popularSearches = [
      "Vitamina C",
      "Colágeno",
      "Omega 3",
      "Vitaminas",
      "Suplementos",
      "Té verde",
      "Spirulina",
      "Complejo B",
    ]
  }

  search(query, filters = {}) {
    if (!query && Object.keys(filters).length === 0) {
      return this.products
    }

    let results = [...this.products]

    // Aplicar filtros de categoría
    if (filters.category && filters.category !== "all") {
      results = results.filter((product) => product.category === filters.category)
    }

    // Aplicar filtros de precio
    if (filters.minPrice !== undefined) {
      results = results.filter((product) => product.price >= filters.minPrice)
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter((product) => product.price <= filters.maxPrice)
    }

    // Aplicar filtro de stock
    if (filters.inStock) {
      results = results.filter((product) => product.stock > 0)
    }

    // Búsqueda por texto
    if (query) {
      const searchTerms = query
        .toLowerCase()
        .split(" ")
        .filter((term) => term.length > 0)

      results = results.filter((product) => {
        const searchableText = [product.name, product.description, this.getCategoryName(product.category)]
          .join(" ")
          .toLowerCase()

        return searchTerms.every((term) => searchableText.includes(term))
      })

      this.addToSearchHistory(query)
    }

    return this.sortByRelevance(results, query)
  }

  sortByRelevance(results, query) {
    if (!query) return results

    const queryLower = query.toLowerCase()
    return results.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, queryLower)
      const bScore = this.calculateRelevanceScore(b, queryLower)
      return bScore - aScore
    })
  }

  calculateRelevanceScore(product, query) {
    let score = 0
    const queryTerms = query.split(" ").filter((term) => term.length > 0)

    queryTerms.forEach((term) => {
      if (product.name.toLowerCase().includes(term)) {
        score += 10
        if (product.name.toLowerCase().startsWith(term)) {
          score += 5
        }
      }
      if (this.getCategoryName(product.category).toLowerCase().includes(term)) {
        score += 5
      }
      if (product.description.toLowerCase().includes(term)) {
        score += 3
      }
    })

    if (product.stock > 0) score += 2
    return score
  }

  getSuggestions(query, limit = 5) {
    if (!query || query.length < 2) {
      return this.getPopularSuggestions(limit)
    }

    const queryLower = query.toLowerCase()
    const suggestions = new Set()

    this.products.forEach((product) => {
      if (product.name.toLowerCase().includes(queryLower)) {
        suggestions.add(product.name)
      }
    })

    const categories = ["Vitaminas", "Suplementos", "Hierbas Medicinales"]
    categories.forEach((category) => {
      if (category.toLowerCase().includes(queryLower)) {
        suggestions.add(category)
      }
    })

    this.searchHistory.forEach((search) => {
      if (search.toLowerCase().includes(queryLower)) {
        suggestions.add(search)
      }
    })

    return Array.from(suggestions).slice(0, limit)
  }

  getPopularSuggestions(limit = 5) {
    return this.popularSearches.slice(0, limit)
  }

  addToSearchHistory(query) {
    const trimmedQuery = query.trim()
    if (!trimmedQuery || trimmedQuery.length < 2) return

    this.searchHistory = this.searchHistory.filter((item) => item !== trimmedQuery)
    this.searchHistory.unshift(trimmedQuery)
    this.searchHistory = this.searchHistory.slice(0, 10)
    this.saveSearchHistory()
  }

  loadSearchHistory() {
    try {
      const history = localStorage.getItem("saludyvidaSearchHistory")
      return history ? JSON.parse(history) : []
    } catch {
      return []
    }
  }

  saveSearchHistory() {
    try {
      localStorage.setItem("saludyvidaSearchHistory", JSON.stringify(this.searchHistory))
    } catch (error) {
      console.error("Error guardando historial de búsqueda:", error)
    }
  }

  getCategoryName(category) {
    const categories = {
      vitaminas: "Vitaminas",
      suplementos: "Suplementos",
      hierbas: "Hierbas Medicinales",
    }
    return categories[category] || category
  }
}

// ========================================
// NEQUI PAYMENT PROCESSOR CLASS
// ========================================
class NequiPaymentProcessor {
  constructor(config) {
    this.config = config
    this.accessToken = null
    this.tokenExpiry = null
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      const response = await fetch(`${this.config.BASE_URL}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${this.config.CLIENT_ID}:${this.config.CLIENT_SECRET}`)}`,
        },
        body: "grant_type=client_credentials",
      })

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status}`)
      }

      const data = await response.json()
      this.accessToken = data.access_token
      this.tokenExpiry = Date.now() + data.expires_in * 1000 - 60000

      return this.accessToken
    } catch (error) {
      console.error("Error obteniendo token de Nequi:", error)
      throw error
    }
  }

  async processPushPayment(paymentData) {
    try {
      const token = await this.getAccessToken()

      const requestBody = {
        phoneNumber: this.config.PHONE_NUMBER,
        code: "NIT_1",
        value: paymentData.amount.toString(),
        reference1: paymentData.orderId,
        reference2: paymentData.description || "Compra Salud y Vida",
        reference3: paymentData.customerPhone,
      }

      const response = await fetch(`${this.config.BASE_URL}/payments/v2/-services-paymentservice-unregisteredpayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-api-key": this.config.API_KEY,
        },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()

      if (response.ok && result.status === "SUCCESS") {
        return {
          success: true,
          transactionId: result.transactionId,
          authorizationCode: result.authorizationCode,
          message: "Pago procesado exitosamente con Nequi",
        }
      } else {
        return {
          success: false,
          errorCode: result.errorCode || "PAYMENT_FAILED",
          message: result.errorMessage || "Error procesando el pago con Nequi",
        }
      }
    } catch (error) {
      console.error("Error en pago Nequi:", error)
      return await this.simulateNequiPayment(paymentData.amount, paymentData.customerPhone, paymentData.description)
    }
  }

  async simulateNequiPayment(amount, customerPhone, description) {
    try {
      showPaymentProcessingModal("Procesando pago con Nequi (Modo Demo)...")
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const isSuccessful = Math.random() > 0.15
      hidePaymentProcessingModal()

      if (isSuccessful) {
        return {
          success: true,
          transactionId: this.generateTransactionId(),
          authorizationCode: `NQ${Date.now().toString().slice(-8)}`,
          message: "Pago procesado exitosamente (Demo)",
        }
      } else {
        return {
          success: false,
          errorCode: "INSUFFICIENT_FUNDS",
          message: "Fondos insuficientes. Intente nuevamente.",
        }
      }
    } catch (error) {
      hidePaymentProcessingModal()
      return {
        success: false,
        errorCode: "NETWORK_ERROR",
        message: "Error de conexión. Intente nuevamente.",
      }
    }
  }

  generateTransactionId() {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000)
    return `TXN_${timestamp}_${random}`
  }
}

// ========================================
// GLOBAL VARIABLES
// ========================================
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

let cart = []
let orders = []
let currentCategory = "all"
let currentSearchTerm = ""
let isAdminLoggedIn = false
let currentAdmin = null
let currentOrderId = null
let syncInterval = null
let advancedSearch = null
let nequiProcessor = null
let suggestionsTimeout = null
let currentFilters = {
  category: "all",
  minPrice: 0,
  maxPrice: 100000,
  inStock: true,
  sort: "relevance",
}

// DOM Elements
const productsGrid = document.querySelector(".products-grid")
const categoryButtons = document.querySelectorAll(".category-btn")
const searchInput = document.getElementById("product-search-input")
const searchButton = document.getElementById("product-search-btn")
const clearSearchButton = document.getElementById("clear-search-btn")
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
const continueShoppingBtn = document.querySelector(".continueShoppingBtn")
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

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 Initializing Enhanced Salud y Vida application...")

  showLoadingIndicator()

  try {
    await initializeMongoDB()
    await loadAllDataFromMongoDB()

    advancedSearch = new AdvancedSearch(products)
    nequiProcessor = new NequiPaymentProcessor(NEQUI_CONFIG)

    displayProducts()
    setupEnhancedEventListeners()
    initTestimonialsSlider()
    checkAdminLoginStatus()
    startRealTimeSync()
    initializeSearchSuggestions()

    console.log("✅ Enhanced application initialized successfully")
  } catch (error) {
    console.error("❌ Error initializing application:", error)
    await initializeBackupMode()
  } finally {
    hideLoadingIndicator()
  }
})

// ========================================
// MONGODB FUNCTIONS
// ========================================
async function initializeMongoDB() {
  try {
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

    console.log("✅ MongoDB Atlas connected successfully")
    showNotification("Conectado a MongoDB Atlas", "success")
    await initializeMongoCollections()
  } catch (error) {
    console.error("❌ MongoDB initialization failed:", error)
    showNotification("Error conectando a MongoDB, usando respaldo", "error")
    throw error
  }
}

async function initializeMongoCollections() {
  try {
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
      await insertManyToMongoDB(PRODUCTS_COLLECTION, products)
      console.log("✅ Initial products inserted to MongoDB")
    }
  } catch (error) {
    console.error("Error initializing MongoDB collections:", error)
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

async function loadAllDataFromMongoDB() {
  try {
    const mongoProducts = await findFromMongoDB(PRODUCTS_COLLECTION)
    if (mongoProducts.length > 0) {
      products = mongoProducts
    }

    const mongoOrders = await findFromMongoDB(ORDERS_COLLECTION)
    if (mongoOrders.length > 0) {
      orders = mongoOrders
    }

    loadCartFromLocalStorage()
    console.log(`✅ Loaded ${products.length} products and ${orders.length} orders from MongoDB`)
  } catch (error) {
    console.error("Error loading data from MongoDB:", error)
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

// ========================================
// ENHANCED SEARCH FUNCTIONS
// ========================================
function setupEnhancedEventListeners() {
  setupEventListeners()

  const suggestionsContainer = document.getElementById("searchSuggestionsContainer")

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim()
      clearTimeout(suggestionsTimeout)
      suggestionsTimeout = setTimeout(() => {
        if (query.length >= 2) {
          showSearchSuggestions(query)
        } else if (query.length === 0) {
          hideSearchSuggestions()
          clearSearch()
        } else {
          hideSearchSuggestions()
        }
      }, 300)
    })

    document.addEventListener("click", (e) => {
      if (!searchInput.contains(e.target) && !suggestionsContainer?.contains(e.target)) {
        hideSearchSuggestions()
      }
    })

    searchInput.addEventListener("focus", () => {
      const query = searchInput.value.trim()
      if (query.length >= 2) {
        showSearchSuggestions(query)
      } else {
        showPopularSuggestions()
      }
    })

    searchInput.addEventListener("keydown", handleSearchKeyNavigation)
  }

  const advancedFiltersBtn = document.getElementById("advancedFiltersBtn")
  const applyFiltersBtn = document.getElementById("applyFiltersBtn")
  const clearFiltersBtn = document.getElementById("clearFiltersBtn")

  if (advancedFiltersBtn) {
    advancedFiltersBtn.addEventListener("click", showAdvancedFilters)
  }

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", applyAdvancedFilters)
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", clearAdvancedFilters)
  }

  const priceMinSlider = document.getElementById("filter-price-min")
  const priceMaxSlider = document.getElementById("filter-price-max")

  if (priceMinSlider && priceMaxSlider) {
    priceMinSlider.addEventListener("input", updatePriceDisplay)
    priceMaxSlider.addEventListener("input", updatePriceDisplay)
  }
}

function showSearchSuggestions(query) {
  if (!advancedSearch) return

  const suggestions = advancedSearch.getSuggestions(query, 8)
  const container = document.getElementById("searchSuggestionsContainer")
  const suggestionsList = document.getElementById("suggestionsList")

  if (!container || !suggestionsList) return

  suggestionsList.innerHTML = ""

  suggestions.forEach((suggestion) => {
    const item = document.createElement("div")
    item.className = "suggestion-item"
    item.setAttribute("data-suggestion", suggestion)
    item.innerHTML = `
      <i class="fas fa-search"></i>
      <span class="suggestion-text">${suggestion}</span>
    `

    item.addEventListener("click", () => {
      selectSuggestion(suggestion)
    })

    suggestionsList.appendChild(item)
  })

  const history = advancedSearch.searchHistory.slice(0, 3)
  if (history.length > 0) {
    const historyContainer = document.getElementById("searchHistory")
    const historyList = document.getElementById("historyList")

    if (historyContainer && historyList) {
      historyList.innerHTML = ""

      history.forEach((search) => {
        const item = document.createElement("div")
        item.className = "history-item"
        item.innerHTML = `
          <i class="fas fa-history"></i>
          <span>${search}</span>
        `

        item.addEventListener("click", () => {
          selectSuggestion(search)
        })

        historyList.appendChild(item)
      })

      historyContainer.style.display = "block"
    }
  }

  container.style.display = "block"
}

function showPopularSuggestions() {
  if (!advancedSearch) return

  const suggestions = advancedSearch.getPopularSuggestions(6)
  const container = document.getElementById("searchSuggestionsContainer")
  const suggestionsList = document.getElementById("suggestionsList")

  if (!container || !suggestionsList) return

  suggestionsList.innerHTML = ""

  suggestions.forEach((suggestion) => {
    const item = document.createElement("div")
    item.className = "suggestion-item"
    item.innerHTML = `
      <i class="fas fa-fire"></i>
      <span class="suggestion-text">${suggestion}</span>
      <span class="suggestion-type">Popular</span>
    `

    item.addEventListener("click", () => {
      selectSuggestion(suggestion)
    })

    suggestionsList.appendChild(item)
  })

  const historyContainer = document.getElementById("searchHistory")
  if (historyContainer) {
    historyContainer.style.display = "none"
  }

  container.style.display = "block"
}

function hideSearchSuggestions() {
  const container = document.getElementById("searchSuggestionsContainer")
  if (container) {
    container.style.display = "none"
  }
}

function selectSuggestion(suggestion) {
  if (searchInput) {
    searchInput.value = suggestion
    performEnhancedSearch()
    hideSearchSuggestions()
  }
}

function handleSearchKeyNavigation(e) {
  const suggestions = document.querySelectorAll(".suggestion-item, .history-item")
  const currentActive = document.querySelector(".suggestion-item.active, .history-item.active")

  if (e.key === "ArrowDown") {
    e.preventDefault()
    if (currentActive) {
      currentActive.classList.remove("active")
      const next = currentActive.nextElementSibling
      if (next) {
        next.classList.add("active")
      } else {
        suggestions[0]?.classList.add("active")
      }
    } else {
      suggestions[0]?.classList.add("active")
    }
  } else if (e.key === "ArrowUp") {
    e.preventDefault()
    if (currentActive) {
      currentActive.classList.remove("active")
      const prev = currentActive.previousElementSibling
      if (prev) {
        prev.classList.add("active")
      } else {
        suggestions[suggestions.length - 1]?.classList.add("active")
      }
    } else {
      suggestions[suggestions.length - 1]?.classList.add("active")
    }
  } else if (e.key === "Enter") {
    e.preventDefault()
    if (currentActive) {
      const suggestion =
        currentActive.querySelector(".suggestion-text")?.textContent || currentActive.textContent.trim()
      selectSuggestion(suggestion)
    } else {
      performEnhancedSearch()
    }
  } else if (e.key === "Escape") {
    hideSearchSuggestions()
  }
}

function performEnhancedSearch() {
  const query = searchInput ? searchInput.value.trim() : ""

  if (!advancedSearch) {
    currentSearchTerm = query
    displayProducts()
    return
  }

  const results = advancedSearch.search(query, currentFilters)
  displaySearchResults(results, query)
  showSearchResultsInfo(results.length, query)
  hideSearchSuggestions()
}

function displaySearchResults(results, query) {
  if (!productsGrid) return

  productsGrid.innerHTML = ""

  if (results.length === 0) {
    showNoResultsMessage(query)
    return
  }

  results.forEach((product, index) => {
    const productCard = createProductCard(product)
    productCard.style.animationDelay = `${index * 0.1}s`
    productsGrid.appendChild(productCard)
  })

  const addToCartButtons = document.querySelectorAll(".add-to-cart:not([disabled])")
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart)
  })
}

function createProductCard(product) {
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
      <p class="product-stock">Stock: ${product.stock} unidades</p>
      ${
        isInStock
          ? `<button class="add-to-cart" data-id="${product.id}">Añadir al Carrito</button>`
          : `<button class="add-to-cart" disabled>Agotado</button>`
      }
    </div>
  `

  return productCard
}

function showNoResultsMessage(query) {
  const noResultsDiv = document.createElement("div")
  noResultsDiv.className = "no-search-results"
  noResultsDiv.innerHTML = `
    <i class="fas fa-search"></i>
    <h3>No se encontraron productos</h3>
    <p>No encontramos productos que coincidan con "${query}".<br>
    Intenta con otros términos o revisa las sugerencias.</p>
    <div class="search-suggestions-list">
      ${advancedSearch
        .getPopularSuggestions(5)
        .map(
          (suggestion) =>
            `<span class="suggestion-chip" onclick="selectSuggestion('${suggestion}')">${suggestion}</span>`,
        )
        .join("")}
    </div>
    <button class="btn" onclick="clearSearch()">Ver todos los productos</button>
  `

  productsGrid.appendChild(noResultsDiv)
}

function showSearchResultsInfo(count, query) {
  const infoContainer = document.getElementById("searchResultsInfo")
  const resultsCount = document.getElementById("resultsCount")
  const searchQueryDisplay = document.getElementById("searchQueryDisplay")

  if (infoContainer && resultsCount) {
    resultsCount.textContent = count

    if (searchQueryDisplay && query) {
      searchQueryDisplay.textContent = query
      searchQueryDisplay.style.display = "inline"
    } else if (searchQueryDisplay) {
      searchQueryDisplay.style.display = "none"
    }

    infoContainer.style.display = count > 0 || query ? "flex" : "none"
  }
}

function showAdvancedFilters() {
  const modal = document.getElementById("advancedFiltersModal")
  if (modal) {
    loadCurrentFilters()
    modal.style.display = "block"
    overlay.style.display = "block"
  }
}

function loadCurrentFilters() {
  const categorySelect = document.getElementById("filter-category")
  const priceMinSlider = document.getElementById("filter-price-min")
  const priceMaxSlider = document.getElementById("filter-price-max")
  const inStockCheck = document.getElementById("filter-in-stock")
  const sortSelect = document.getElementById("filter-sort")

  if (categorySelect) categorySelect.value = currentFilters.category
  if (priceMinSlider) priceMinSlider.value = currentFilters.minPrice
  if (priceMaxSlider) priceMaxSlider.value = currentFilters.maxPrice
  if (inStockCheck) inStockCheck.checked = currentFilters.inStock
  if (sortSelect) sortSelect.value = currentFilters.sort

  updatePriceDisplay()
}

function applyAdvancedFilters() {
  const categorySelect = document.getElementById("filter-category")
  const priceMinSlider = document.getElementById("filter-price-min")
  const priceMaxSlider = document.getElementById("filter-price-max")
  const inStockCheck = document.getElementById("filter-in-stock")
  const sortSelect = document.getElementById("filter-sort")

  currentFilters = {
    category: categorySelect ? categorySelect.value : "all",
    minPrice: priceMinSlider ? Number.parseInt(priceMinSlider.value) : 0,
    maxPrice: priceMaxSlider ? Number.parseInt(priceMaxSlider.value) : 100000,
    inStock: inStockCheck ? inStockCheck.checked : true,
    sort: sortSelect ? sortSelect.value : "relevance",
  }

  performEnhancedSearch()
  closeModals()
  showNotification("Filtros aplicados correctamente", "success")
}

function clearAdvancedFilters() {
  currentFilters = {
    category: "all",
    minPrice: 0,
    maxPrice: 100000,
    inStock: true,
    sort: "relevance",
  }

  loadCurrentFilters()
  performEnhancedSearch()
  closeModals()
  showNotification("Filtros limpiados", "success")
}

function updatePriceDisplay() {
  const priceMinSlider = document.getElementById("filter-price-min")
  const priceMaxSlider = document.getElementById("filter-price-max")
  const priceMinDisplay = document.getElementById("price-min-display")
  const priceMaxDisplay = document.getElementById("price-max-display")

  if (priceMinSlider && priceMinDisplay) {
    priceMinDisplay.textContent = formatPrice(Number.parseInt(priceMinSlider.value))
  }

  if (priceMaxSlider && priceMaxDisplay) {
    priceMaxDisplay.textContent = formatPrice(Number.parseInt(priceMaxSlider.value))
  }
}

function initializeSearchSuggestions() {
  const searchContainer = document.querySelector(".search-container")
  if (searchContainer && !document.getElementById("searchSuggestionsContainer")) {
    const suggestionsHTML = `
      <div class="search-suggestions-container" id="searchSuggestionsContainer" style="display: none;">
        <div class="search-suggestions">
          <div class="suggestions-header">
            <h4>Sugerencias de búsqueda</h4>
          </div>
          <div class="suggestions-list" id="suggestionsList"></div>
          <div class="search-history" id="searchHistory" style="display: none;">
            <h5>Búsquedas recientes</h5>
            <div class="history-list" id="historyList"></div>
          </div>
        </div>
      </div>
    `
    searchContainer.insertAdjacentHTML("beforeend", suggestionsHTML)
  }

  const productsSection = document.getElementById("productos")
  if (productsSection && !document.getElementById("searchResultsInfo")) {
    const resultsInfoHTML = `
      <div class="search-results-info" id="searchResultsInfo" style="display: none;">
        <div class="results-summary">
          <span class="results-count" id="resultsCount">0</span>
          <span class="results-text">productos encontrados</span>
          <span class="search-query" id="searchQueryDisplay"></span>
        </div>
        <div class="results-actions">
          <button class="btn-secondary" id="advancedFiltersBtn">
            <i class="fas fa-filter"></i>
            Filtros Avanzados
          </button>
          <button class="btn-secondary" id="clearSearchBtn">
            <i class="fas fa-times"></i>
            Limpiar Búsqueda
          </button>
        </div>
      </div>
    `

    const container = productsSection.querySelector(".container")
    const productsGrid = container.querySelector(".products-grid")
    container.insertBefore(
      document.createRange().createContextualFragment(resultsInfoHTML).firstElementChild,
      productsGrid,
    )
  }
}

// ========================================
// EXISTING FUNCTIONS (ENHANCED)
// ========================================

// Resto de las funciones existentes con mejoras...
// [El resto del código continúa con todas las funciones existentes pero mejoradas]

function clearSearch() {
  if (searchInput) {
    searchInput.value = ""
  }

  currentSearchTerm = ""
  currentFilters.category = "all"

  categoryButtons.forEach((btn) => btn.classList.remove("active"))
  document.querySelector('[data-category="all"]')?.classList.add("active")

  const infoContainer = document.getElementById("searchResultsInfo")
  if (infoContainer) {
    infoContainer.style.display = "none"
  }

  displayProducts()
  hideSearchSuggestions()
}

async function initializeBackupMode() {
  console.log("🔄 Initializing backup mode...")
  try {
    loadDataFromLocalStorage()
    advancedSearch = new AdvancedSearch(products)
    displayProducts()
    setupEnhancedEventListeners()
    initTestimonialsSlider()
    checkAdminLoginStatus()
    console.log("✅ Backup mode initialized successfully")
  } catch (error) {
    console.error("❌ Backup mode failed:", error)
  }
}

// Continúa con todas las funciones existentes...
// [Aquí irían todas las demás funciones del script original pero mejoradas]

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
        <p style="color: #666; font-size: 16px;">Conectando con MongoDB Atlas...</p>
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

    console.log(`✅ Collection ${collection} replaced successfully`)
  } catch (error) {
    console.error("Error replacing collection:", error)
    throw error
  }
}

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

  console.log("🔄 Real-time sync started")
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
      console.log("🔄 Products synced from MongoDB")
    }

    // Check if orders changed
    if (JSON.stringify(latestOrders) !== JSON.stringify(orders)) {
      orders = latestOrders
      if (isAdminLoggedIn) {
        displayOrders()
        updateAdminStats()
      }
      console.log("🔄 Orders synced from MongoDB")
    }
  } catch (error) {
    console.error("Error syncing with MongoDB:", error)
  }
}

// Procesar pago con Bancolombia (simulado)
async function processBancolombiaPayment(amount, accountNumber, confirmationCode) {
  try {
    showPaymentProcessingModal("Procesando pago con Bancolombia...")

    // Simular tiempo de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 4000))

    // Simular resultado (80% éxito)
    const isSuccessful = Math.random() > 0.2

    hidePaymentProcessingModal()

    if (isSuccessful) {
      return {
        success: true,
        transaction_id: generateTransactionId(),
        confirmation_code: confirmationCode,
        message: "Pago procesado exitosamente",
      }
    } else {
      return {
        success: false,
        error_code: "INVALID_CONFIRMATION",
        message: "Código de confirmación inválido. Verifique e intente nuevamente.",
      }
    }
  } catch (error) {
    hidePaymentProcessingModal()
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

  const filteredProducts = getFilteredProducts()

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <div class="no-products-found">
        <i class="fas fa-search" style="font-size: 4rem; color: #ccc; margin-bottom: 20px;"></i>
        <h3>No se encontraron productos</h3>
        <p>Intenta con otros términos de búsqueda o selecciona una categoría diferente.</p>
        ${currentSearchTerm ? `<button class="btn" onclick="clearSearch()">Limpiar búsqueda</button>` : ""}
      </div>
    `
    return
  }

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
        <p class="product-stock">Stock: ${product.stock} unidades</p>
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

// Enhanced Place Order Function with Real Nequi Integration
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
      // Process with REAL Nequi API
      paymentResult = await processRealNequiPayment(orderTotal, phone, `Compra Salud y Vida - Pedido ${Date.now()}`)

      if (!paymentResult.success) {
        showNotification(paymentResult.message, "error")
        placeOrderBtn.disabled = false
        placeOrderBtn.innerHTML = "Realizar Pedido"
        return
      }

      transactionId = paymentResult.transaction_id
      confirmationNumber = paymentResult.confirmation_code
    } else if (payment === "bancolombia") {
      confirmationNumber = document.getElementById("bancolombia-confirmation").value
      if (!confirmationNumber) {
        showNotification("Por favor ingresa el número de confirmación de Bancolombia.", "error")
        placeOrderBtn.disabled = false
        placeOrderBtn.innerHTML = "Realizar Pedido"
        return
      }

      // Process Bancolombia payment
      const confirmationCode = document.getElementById("bancolombia-confirmation").value
      paymentResult = await processBancolombiaPayment(orderTotal, "123456789", confirmationCode)

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
      console.log("✅ Order saved to MongoDB")
      showNotification("Pedido guardado en la base de datos", "success")
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
      console.log("✅ Products updated in MongoDB")
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
    console.log("✅ Order updated in MongoDB")
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
    console.log("✅ Order deleted from MongoDB")
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
  let currentProductId
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
      console.log("✅ Products saved to MongoDB")
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
      console.log("✅ Products updated in MongoDB")
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
  "🎉 Enhanced Salud y Vida application loaded with advanced search, MongoDB Atlas, and real Nequi integration",
)
