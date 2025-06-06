// Admin Panel JavaScript para Salud y Vida

// DOM Elements
const loginSection = document.getElementById("login-section")
const adminDashboard = document.getElementById("admin-dashboard")
const loginForm = document.getElementById("login-form")
const loginError = document.getElementById("login-error")
const logoutBtn = document.getElementById("logout-btn")
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
const closeModalButtons = document.querySelectorAll(".close-modal")
const overlay = document.querySelector(".overlay")

// Variables globales
let products = []
let orders = []
let currentOrderId = null
let currentUser = null

// API URL para autenticación
const API_URL = "https://683cf838199a0039e9e3d448.mockapi.io/users"

// Funciones de utilidad
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

function generateUniqueId() {
  return Date.now() + Math.floor(Math.random() * 1000)
}

function showNotification(message, type = "success") {
  // Crear elemento de notificación
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  // Estilos para la notificación
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

  // Remover después de 3 segundos
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  console.log("Iniciando panel administrativo...")

  // Verificar estado de login
  checkLoginStatus()

  // Configurar event listeners
  setupEventListeners()

  // Inicializar datos por defecto si no existen
  initializeDefaultData()

  // Agregar estilos para animaciones
  addAnimationStyles()
})

// Verificar estado de login
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem("saludyvidaAdminLoggedIn")
  const userData = localStorage.getItem("saludyvidaAdminUser")

  if (isLoggedIn === "true" && userData) {
    currentUser = JSON.parse(userData)
    showAdminDashboard()
    loadData()
  } else {
    showLoginForm()
  }
}

// Mostrar formulario de login
function showLoginForm() {
  if (loginSection) {
    loginSection.style.display = "block"
  }
  if (adminDashboard) {
    adminDashboard.style.display = "none"
  }
  if (logoutBtn) {
    logoutBtn.style.display = "none"
  }
}

// Mostrar dashboard administrativo
function showAdminDashboard() {
  if (loginSection) {
    loginSection.style.display = "none"
  }
  if (adminDashboard) {
    adminDashboard.style.display = "block"
  }
  if (logoutBtn) {
    logoutBtn.style.display = "block"
  }
}

// Cargar datos
function loadData() {
  console.log("Cargando datos...")

  // Cargar productos desde localStorage
  const storedProducts = localStorage.getItem("saludyvidaProducts")
  if (storedProducts) {
    products = JSON.parse(storedProducts)
  }

  // Cargar pedidos desde localStorage
  const storedOrders = localStorage.getItem("saludyvidaOrders")
  if (storedOrders) {
    orders = JSON.parse(storedOrders)
  }

  // Mostrar datos
  displayOrders()
  displayProducts()

  console.log(`Cargados ${products.length} productos y ${orders.length} pedidos`)
}

// Configurar event listeners
function setupEventListeners() {
  // Login form
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout)
  }

  // Tab buttons
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.getAttribute("data-tab")
      switchTab(tab)
    })
  })

  // Filtros de pedidos
  if (orderStatusFilter) {
    orderStatusFilter.addEventListener("change", filterOrders)
  }
  if (orderSearch) {
    orderSearch.addEventListener("input", filterOrders)
  }

  // Filtros de productos
  if (productCategoryFilter) {
    productCategoryFilter.addEventListener("change", filterProducts)
  }
  if (productSearch) {
    productSearch.addEventListener("input", filterProducts)
  }

  // Botón agregar producto
  if (addProductBtn) {
    addProductBtn.addEventListener("click", () => {
      openProductModal()
    })
  }

  // Formulario de producto
  if (productForm) {
    productForm.addEventListener("submit", saveProduct)
  }

  // Botón actualizar estado de pedido
  if (updateOrderStatusBtn) {
    updateOrderStatusBtn.addEventListener("click", updateOrderStatus)
  }

  // Botones cerrar modal
  closeModalButtons.forEach((button) => {
    button.addEventListener("click", closeModals)
  })

  // Overlay
  if (overlay) {
    overlay.addEventListener("click", closeModals)
  }
}

// Cambiar tab
function switchTab(tabName) {
  // Actualizar botones de tab
  tabButtons.forEach((btn) => btn.classList.remove("active"))
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active")

  // Actualizar contenido de tab
  tabContents.forEach((content) => content.classList.remove("active"))
  document.getElementById(`${tabName}-tab`).classList.add("active")
}

// Manejar login
async function handleLogin(e) {
  e.preventDefault()

  const username = document.getElementById("username").value.trim()
  const password = document.getElementById("password").value.trim()

  if (!username || !password) {
    showLoginError("Por favor ingresa usuario y contraseña.")
    return
  }

  try {
    showLoginError("Verificando credenciales...", "info")

    // Fetch users from API
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error("Error al conectar con el servidor")
    }

    const users = await response.json()

    // Buscar usuario
    const user = users.find((user) => user.username === username && user.password === password)

    if (user) {
      // Login exitoso
      currentUser = {
        id: user.id,
        username: user.username,
      }

      // Guardar en localStorage
      localStorage.setItem("saludyvidaAdminLoggedIn", "true")
      localStorage.setItem("saludyvidaAdminUser", JSON.stringify(currentUser))

      // Mostrar dashboard
      showAdminDashboard()
      loadData()

      showNotification(`¡Bienvenido ${user.username}!`, "success")

      // Limpiar formulario
      loginForm.reset()
      loginError.textContent = ""
    } else {
      showLoginError("Usuario o contraseña incorrectos.")
    }
  } catch (error) {
    console.error("Error en login:", error)
    showLoginError("Error al conectar con el servidor. Intenta de nuevo.")
  }
}

// Mostrar error de login
function showLoginError(message, type = "error") {
  if (loginError) {
    loginError.textContent = message
    loginError.className = `error-message ${type}`
  }
}

// Manejar logout
function handleLogout() {
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    // Limpiar localStorage
    localStorage.removeItem("saludyvidaAdminLoggedIn")
    localStorage.removeItem("saludyvidaAdminUser")

    // Reset variables
    currentUser = null

    // Mostrar login
    showLoginForm()

    showNotification("Sesión cerrada correctamente", "success")
  }
}

// Mostrar pedidos
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

  // Ordenar por fecha (más recientes primero)
  const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date))

  sortedOrders.forEach((order) => {
    const row = document.createElement("tr")
    row.style.cursor = "pointer"

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

  // Agregar event listeners
  addOrderEventListeners()
}

// Agregar event listeners a los pedidos
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

// Filtrar pedidos
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

// Mostrar pedidos filtrados
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

  // Ordenar por fecha
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

  // Agregar event listeners
  addOrderEventListeners()
}

// Abrir modal de detalles del pedido
function openOrderDetailModal(orderId) {
  const order = orders.find((order) => order.id === orderId)

  if (!order) {
    showNotification("Pedido no encontrado", "error")
    return
  }

  currentOrderId = orderId

  // Llenar información del pedido
  if (orderDetailNumber) orderDetailNumber.textContent = order.id
  if (orderCustomerName) orderCustomerName.textContent = order.customer.name
  if (orderCustomerPhone) orderCustomerPhone.textContent = order.customer.phone
  if (orderCustomerAddress) orderCustomerAddress.textContent = order.customer.address

  // Método de pago
  if (orderPaymentMethod) {
    orderPaymentMethod.textContent = getPaymentMethodName(order.payment.method)
  }

  // Estado del pago
  if (orderPaymentStatus) {
    orderPaymentStatus.textContent = getStatusName(order.status)
    orderPaymentStatus.className = `order-status status-${order.status}`
  }

  // Número de confirmación
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

  // Items del pedido
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

  // Total del pedido
  if (orderDetailTotal) {
    orderDetailTotal.textContent = formatPrice(order.total)
  }

  // Estado actual
  if (orderStatus) {
    orderStatus.value = order.status
  }

  // Mostrar modal
  if (orderDetailModal) {
    orderDetailModal.style.display = "block"
  }
  if (overlay) {
    overlay.style.display = "block"
  }
}

// Actualizar estado del pedido
function updateOrderStatus() {
  if (!currentOrderId) return

  const newStatus = orderStatus ? orderStatus.value : null

  if (!newStatus) {
    showNotification("Selecciona un estado válido", "error")
    return
  }

  // Encontrar el pedido
  const orderIndex = orders.findIndex((order) => order.id === currentOrderId)

  if (orderIndex === -1) {
    showNotification("Pedido no encontrado", "error")
    return
  }

  // Actualizar estado
  orders[orderIndex].status = newStatus

  // Guardar en localStorage
  localStorage.setItem("saludyvidaOrders", JSON.stringify(orders))

  // Actualizar UI
  if (orderPaymentStatus) {
    orderPaymentStatus.textContent = getStatusName(newStatus)
    orderPaymentStatus.className = `order-status status-${newStatus}`
  }

  // Actualizar tabla de pedidos
  displayOrders()

  showNotification("Estado del pedido actualizado correctamente", "success")
}

// Eliminar pedido
function deleteOrder(orderId) {
  if (!confirm("¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.")) {
    return
  }

  // Remover pedido del array
  orders = orders.filter((order) => order.id !== orderId)

  // Guardar en localStorage
  localStorage.setItem("saludyvidaOrders", JSON.stringify(orders))

  // Actualizar tabla
  displayOrders()

  showNotification("Pedido eliminado correctamente", "success")
}

// Mostrar productos
function displayProducts() {
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

    // Determinar color del stock
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

  // Agregar event listeners
  addProductEventListeners()
}

// Agregar event listeners a los productos
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

// Filtrar productos
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

// Mostrar productos filtrados
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

  // Agregar event listeners
  addProductEventListeners()
}

// Abrir modal de producto
function openProductModal(productId = null) {
  if (productId) {
    // Modo edición
    const product = products.find((p) => p.id === productId)

    if (!product) {
      showNotification("Producto no encontrado", "error")
      return
    }

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
    // Modo agregar
    if (productModalTitle) productModalTitle.textContent = "Agregar Nuevo Producto"
    if (productForm) productForm.reset()
    if (productIdInput) productIdInput.value = ""
    if (saveProductBtn) saveProductBtn.textContent = "Guardar Producto"
  }

  // Mostrar modal
  if (productModal) productModal.style.display = "block"
  if (overlay) overlay.style.display = "block"
}

// Guardar producto
function saveProduct(e) {
  e.preventDefault()

  const productId = productIdInput ? productIdInput.value : ""
  const name = productNameInput ? productNameInput.value.trim() : ""
  const category = productCategoryInput ? productCategoryInput.value : ""
  const price = productPriceInput ? Number.parseInt(productPriceInput.value) : 0
  const stock = productStockInput ? Number.parseInt(productStockInput.value) : 0
  const description = productDescriptionInput ? productDescriptionInput.value.trim() : ""
  const image = productImageInput ? productImageInput.value.trim() : ""

  // Validaciones
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

  if (productId) {
    // Actualizar producto existente
    const productIndex = products.findIndex((p) => p.id === Number.parseInt(productId))

    if (productIndex !== -1) {
      products[productIndex] = {
        id: Number.parseInt(productId),
        ...productData,
      }
      showNotification("Producto actualizado correctamente", "success")
    }
  } else {
    // Agregar nuevo producto
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1

    products.push({
      id: newId,
      ...productData,
    })
    showNotification("Producto agregado correctamente", "success")
  }

  // Guardar en localStorage
  localStorage.setItem("saludyvidaProducts", JSON.stringify(products))

  // Actualizar UI
  displayProducts()

  // Cerrar modal
  closeModals()
}

// Eliminar producto
function deleteProduct(productId) {
  const product = products.find((p) => p.id === productId)

  if (!product) {
    showNotification("Producto no encontrado", "error")
    return
  }

  if (!confirm(`¿Estás seguro de que deseas eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
    return
  }

  // Remover producto del array
  products = products.filter((product) => product.id !== productId)

  // Guardar en localStorage
  localStorage.setItem("saludyvidaProducts", JSON.stringify(products))

  // Actualizar tabla
  displayProducts()

  showNotification("Producto eliminado correctamente", "success")
}

// Cerrar modales
function closeModals() {
  if (productModal) productModal.style.display = "none"
  if (orderDetailModal) orderDetailModal.style.display = "none"
  if (overlay) overlay.style.display = "none"

  // Reset variables
  currentOrderId = null
}

// Inicializar datos por defecto
function initializeDefaultData() {
  // Inicializar productos si no existen
  if (!localStorage.getItem("saludyvidaProducts")) {
    const initialProducts = [
      {
        id: 1,
        name: "Colagesan",
        category: "suplementos",
        price: 45000,
        stock: 25,
        image: "/placeholder.svg?height=200&width=200&text=Colagesan",
        description: "Colágeno con vitamina E para la piel, cabello y articulaciones.",
      },
      {
        id: 2,
        name: "Vita Francesa",
        category: "vitaminas",
        price: 38000,
        stock: 30,
        image: "/placeholder.svg?height=200&width=200&text=Vita%20Francesa",
        description: "Suplemento con Borojó, Chontaduro y Maca. Energizante natural.",
      },
      {
        id: 3,
        name: "Omega 3",
        category: "suplementos",
        price: 42000,
        stock: 20,
        image: "/placeholder.svg?height=200&width=200&text=Omega%203",
        description: "Aceite de pescado rico en ácidos grasos esenciales para la salud cardiovascular.",
      },
      {
        id: 4,
        name: "Spirulina",
        category: "suplementos",
        price: 35000,
        stock: 15,
        image: "/placeholder.svg?height=200&width=200&text=Spirulina",
        description: "Alga rica en proteínas, vitaminas y minerales. Potente antioxidante.",
      },
      {
        id: 5,
        name: "Vitamina C",
        category: "vitaminas",
        price: 28000,
        stock: 40,
        image: "/placeholder.svg?height=200&width=200&text=Vitamina%20C",
        description: "Refuerza el sistema inmunológico y favorece la absorción de hierro.",
      },
      {
        id: 6,
        name: "Té Verde",
        category: "hierbas",
        price: 18000,
        stock: 35,
        image: "/placeholder.svg?height=200&width=200&text=T%C3%A9%20Verde",
        description: "Antioxidante natural que ayuda a acelerar el metabolismo.",
      },
      {
        id: 7,
        name: "Manzanilla",
        category: "hierbas",
        price: 15000,
        stock: 50,
        image: "/placeholder.svg?height=200&width=200&text=Manzanilla",
        description: "Hierba con propiedades antiinflamatorias y relajantes.",
      },
      {
        id: 8,
        name: "Complejo B",
        category: "vitaminas",
        price: 32000,
        stock: 22,
        image: "/placeholder.svg?height=200&width=200&text=Complejo%20B",
        description: "Conjunto de vitaminas B esenciales para el metabolismo energético.",
      },
    ]

    localStorage.setItem("saludyvidaProducts", JSON.stringify(initialProducts))
    console.log("Productos iniciales creados")
  }

  // Inicializar pedidos de ejemplo si no existen
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
        date: new Date(Date.now() - 86400000).toISOString(), // Ayer
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
      {
        id: 100003,
        date: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
        customer: {
          name: "Ana Martínez",
          phone: "3157894561",
          address: "Avenida Santander #45-67, Sincelejo",
        },
        payment: {
          method: "bancolombia",
          confirmation: "BC987654321",
        },
        items: [
          {
            id: 5,
            name: "Vitamina C",
            price: 28000,
            quantity: 3,
          },
          {
            id: 6,
            name: "Té Verde",
            price: 18000,
            quantity: 2,
          },
        ],
        total: 120000,
        status: "shipped",
      },
    ]

    localStorage.setItem("saludyvidaOrders", JSON.stringify(initialOrders))
    console.log("Pedidos de ejemplo creados")
  }
}

// Agregar estilos para animaciones
function addAnimationStyles() {
  const style = document.createElement("style")
  style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .stock-indicator {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .stock-good {
            background-color: #d4edda;
            color: #155724;
        }
        
        .stock-low {
            background-color: #fff3cd;
            color: #856404;
        }
        
        .stock-out {
            background-color: #f8d7da;
            color: #721c24;
        }
        
        .error-message.info {
            color: #0c5460;
        }
        
        .action-btn:hover {
            transform: scale(1.1);
        }
        
        .orders-table tr:hover,
        .products-table tr:hover {
            background-color: #f8f9fa;
        }
    `

  document.head.appendChild(style)
}

// Función para exportar datos (opcional)
function exportData() {
  const data = {
    products: products,
    orders: orders,
    exportDate: new Date().toISOString(),
  }

  const dataStr = JSON.stringify(data, null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })

  const link = document.createElement("a")
  link.href = URL.createObjectURL(dataBlob)
  link.download = `salud-y-vida-backup-${new Date().toISOString().split("T")[0]}.json`
  link.click()
}

// Función para importar datos (opcional)
function importData(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)

      if (data.products && data.orders) {
        if (confirm("¿Estás seguro de que deseas importar estos datos? Esto sobrescribirá los datos actuales.")) {
          products = data.products
          orders = data.orders

          localStorage.setItem("saludyvidaProducts", JSON.stringify(products))
          localStorage.setItem("saludyvidaOrders", JSON.stringify(orders))

          displayProducts()
          displayOrders()

          showNotification("Datos importados correctamente", "success")
        }
      } else {
        showNotification("Archivo de datos inválido", "error")
      }
    } catch (error) {
      showNotification("Error al leer el archivo", "error")
    }
  }

  reader.readAsText(file)
}

console.log("Admin.js cargado correctamente")
