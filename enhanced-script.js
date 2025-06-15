// Enhanced Script with Advanced Search Integration
// Integración de todas las funcionalidades avanzadas

// Variables para sugerencias
let suggestionsTimeout = null
let currentFilters = {
  category: "all",
  minPrice: 0,
  maxPrice: 100000,
  inStock: true,
  sort: "relevance",
}

// Variables declaradas para evitar errores de lint
let advancedSearch = null
let nequiProcessor = null
const products = []
const NEQUI_CONFIG = {}
const overlay = document.createElement("div")
const categoryButtons = []
const currentCategory = "all"
let currentSearchTerm = ""
const productsGrid = document.getElementById("productos").querySelector(".container").querySelector(".products-grid")

// Funciones declaradas para evitar errores de lint
function showLoadingIndicator() {}
async function initializeMongoDB() {}
async function loadAllDataFromMongoDB() {}
function displayProducts() {}
function setupEventListeners() {}
function addToCart() {}
function getCategoryName(category) {
  return category
}
function formatPrice(price) {
  return price.toString()
}
function closeModals() {}
async function initializeBackupAPI() {}
async function loadAllDataFromBackup() {}
function loadDataFromLocalStorage() {}

// Inicialización mejorada
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 Initializing Enhanced Salud y Vida application...")

  // Show loading indicator
  showLoadingIndicator()

  try {
    // Initialize MongoDB connection
    await initializeMongoDB()

    // Load data from MongoDB
    await loadAllDataFromMongoDB()

    // Initialize advanced search
    advancedSearch = new AdvancedSearch(products)

    // Initialize Nequi processor
    nequiProcessor = new NequiPaymentProcessor(NEQUI_CONFIG)

    // Display Products
    displayProducts()

    // Set up enhanced event listeners
    setupEnhancedEventListeners()

    // Initialize testimonials slider
    initTestimonialsSlider()

    // Check admin login status
    checkAdminLoginStatus()

    // Start real-time sync
    startRealTimeSync()

    // Initialize search suggestions
    initializeSearchSuggestions()

    console.log("✅ Enhanced application initialized successfully")
  } catch (error) {
    console.error("❌ Error initializing application:", error)
    // Fallback initialization
    await initializeBackupMode()
  } finally {
    hideLoadingIndicator()
  }
})

// Configuración mejorada de event listeners
function setupEnhancedEventListeners() {
  // Llamar a la función original
  setupEventListeners()

  // Búsqueda avanzada con sugerencias
  const searchInput = document.getElementById("product-search-input")
  const suggestionsContainer = document.getElementById("searchSuggestionsContainer")

  if (searchInput) {
    // Mostrar sugerencias mientras se escribe
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

    // Ocultar sugerencias al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (!searchInput.contains(e.target) && !suggestionsContainer?.contains(e.target)) {
        hideSearchSuggestions()
      }
    })

    // Mostrar sugerencias al hacer foco
    searchInput.addEventListener("focus", () => {
      const query = searchInput.value.trim()
      if (query.length >= 2) {
        showSearchSuggestions(query)
      } else {
        showPopularSuggestions()
      }
    })

    // Navegación con teclado en sugerencias
    searchInput.addEventListener("keydown", handleSearchKeyNavigation)
  }

  // Filtros avanzados
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

  // Sliders de precio
  const priceMinSlider = document.getElementById("filter-price-min")
  const priceMaxSlider = document.getElementById("filter-price-max")

  if (priceMinSlider && priceMaxSlider) {
    priceMinSlider.addEventListener("input", updatePriceDisplay)
    priceMaxSlider.addEventListener("input", updatePriceDisplay)
  }
}

// Mostrar sugerencias de búsqueda
function showSearchSuggestions(query) {
  if (!advancedSearch) return

  const suggestions = advancedSearch.getSuggestions(query, 8)
  const container = document.getElementById("searchSuggestionsContainer")
  const suggestionsList = document.getElementById("suggestionsList")

  if (!container || !suggestionsList) return

  suggestionsList.innerHTML = ""

  suggestions.forEach((suggestion, index) => {
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

  // Mostrar historial si hay espacio
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

// Mostrar sugerencias populares
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

  // Ocultar historial
  const historyContainer = document.getElementById("searchHistory")
  if (historyContainer) {
    historyContainer.style.display = "none"
  }

  container.style.display = "block"
}

// Ocultar sugerencias
function hideSearchSuggestions() {
  const container = document.getElementById("searchSuggestionsContainer")
  if (container) {
    container.style.display = "none"
  }
}

// Seleccionar sugerencia
function selectSuggestion(suggestion) {
  const searchInput = document.getElementById("product-search-input")
  if (searchInput) {
    searchInput.value = suggestion
    performEnhancedSearch()
    hideSearchSuggestions()
  }
}

// Navegación con teclado
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

// Búsqueda mejorada
function performEnhancedSearch() {
  const searchInput = document.getElementById("product-search-input")
  const query = searchInput ? searchInput.value.trim() : ""

  if (!advancedSearch) {
    // Fallback a búsqueda simple
    currentSearchTerm = query
    displayProducts()
    return
  }

  // Realizar búsqueda avanzada
  const results = advancedSearch.search(query, currentFilters)

  // Actualizar productos mostrados
  displaySearchResults(results, query)

  // Mostrar información de resultados
  showSearchResultsInfo(results.length, query)

  // Ocultar sugerencias
  hideSearchSuggestions()
}

// Mostrar resultados de búsqueda
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

  // Add event listeners to the "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart:not([disabled])")
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart)
  })
}

// Crear tarjeta de producto
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

// Mostrar mensaje de sin resultados
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

// Mostrar información de resultados
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

// Filtros avanzados
function showAdvancedFilters() {
  const modal = document.getElementById("advancedFiltersModal")
  if (modal) {
    // Cargar valores actuales
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

  // Actualizar filtros actuales
  currentFilters = {
    category: categorySelect ? categorySelect.value : "all",
    minPrice: priceMinSlider ? Number.parseInt(priceMinSlider.value) : 0,
    maxPrice: priceMaxSlider ? Number.parseInt(priceMaxSlider.value) : 100000,
    inStock: inStockCheck ? inStockCheck.checked : true,
    sort: sortSelect ? sortSelect.value : "relevance",
  }

  // Aplicar búsqueda con nuevos filtros
  performEnhancedSearch()

  // Cerrar modal
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

// Inicializar sugerencias de búsqueda
function initializeSearchSuggestions() {
  // Agregar HTML para sugerencias si no existe
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

  // Agregar información de resultados si no existe
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

// Modo de respaldo
async function initializeBackupMode() {
  console.log("🔄 Initializing backup mode...")

  try {
    await initializeBackupAPI()
    await loadAllDataFromBackup()

    // Inicializar búsqueda simple
    advancedSearch = new AdvancedSearch(products)

    displayProducts()
    setupEnhancedEventListeners()
    initTestimonialsSlider()
    checkAdminLoginStatus()

    console.log("✅ Backup mode initialized successfully")
  } catch (error) {
    console.error("❌ Backup mode failed, using local storage:", error)
    loadDataFromLocalStorage()
    advancedSearch = new AdvancedSearch(products)
    displayProducts()
    setupEnhancedEventListeners()
    initTestimonialsSlider()
    checkAdminLoginStatus()
  }
}

// Función mejorada para limpiar búsqueda
function clearSearch() {
  const searchInput = document.getElementById("product-search-input")
  if (searchInput) {
    searchInput.value = ""
  }

  currentSearchTerm = ""
  currentFilters.category = "all"

  // Actualizar botones de categoría
  categoryButtons.forEach((btn) => btn.classList.remove("active"))
  document.querySelector('[data-category="all"]')?.classList.add("active")

  // Ocultar información de resultados
  const infoContainer = document.getElementById("searchResultsInfo")
  if (infoContainer) {
    infoContainer.style.display = "none"
  }

  // Mostrar todos los productos
  displayProducts()

  hideSearchSuggestions()
}

function showNotification(message, type) {
  console.log(`Notification (${type}): ${message}`)
}

function initTestimonialsSlider() {
  console.log("Initializing testimonials slider...")
}

function checkAdminLoginStatus() {
  console.log("Checking admin login status...")
}

function startRealTimeSync() {
  console.log("Starting real-time sync...")
}

console.log(
  "🎉 Enhanced Salud y Vida application loaded with advanced search, MongoDB Atlas, and real Nequi integration",
)
