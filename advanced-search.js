// Advanced Search Functionality
// Búsqueda avanzada con filtros múltiples y sugerencias

class AdvancedSearch {
  constructor(products) {
    this.products = products
    this.searchHistory = this.loadSearchHistory()
    this.popularSearches = this.loadPopularSearches()
  }

  // Búsqueda principal con múltiples criterios
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

      // Guardar búsqueda en historial
      this.addToSearchHistory(query)
    }

    // Ordenar resultados por relevancia
    return this.sortByRelevance(results, query)
  }

  // Ordenar por relevancia
  sortByRelevance(results, query) {
    if (!query) return results

    const queryLower = query.toLowerCase()

    return results.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, queryLower)
      const bScore = this.calculateRelevanceScore(b, queryLower)
      return bScore - aScore
    })
  }

  // Calcular puntuación de relevancia
  calculateRelevanceScore(product, query) {
    let score = 0
    const queryTerms = query.split(" ").filter((term) => term.length > 0)

    queryTerms.forEach((term) => {
      // Coincidencia exacta en nombre (puntuación alta)
      if (product.name.toLowerCase().includes(term)) {
        score += 10
        // Bonus si coincide al inicio del nombre
        if (product.name.toLowerCase().startsWith(term)) {
          score += 5
        }
      }

      // Coincidencia en categoría
      if (this.getCategoryName(product.category).toLowerCase().includes(term)) {
        score += 5
      }

      // Coincidencia en descripción
      if (product.description.toLowerCase().includes(term)) {
        score += 3
      }
    })

    // Bonus por productos en stock
    if (product.stock > 0) {
      score += 2
    }

    // Bonus por productos populares (más vendidos)
    if (product.sales && product.sales > 10) {
      score += 1
    }

    return score
  }

  // Obtener sugerencias de búsqueda
  getSuggestions(query, limit = 5) {
    if (!query || query.length < 2) {
      return this.getPopularSuggestions(limit)
    }

    const queryLower = query.toLowerCase()
    const suggestions = new Set()

    // Sugerencias basadas en nombres de productos
    this.products.forEach((product) => {
      if (product.name.toLowerCase().includes(queryLower)) {
        suggestions.add(product.name)
      }
    })

    // Sugerencias basadas en categorías
    const categories = ["Vitaminas", "Suplementos", "Hierbas Medicinales"]
    categories.forEach((category) => {
      if (category.toLowerCase().includes(queryLower)) {
        suggestions.add(category)
      }
    })

    // Sugerencias del historial
    this.searchHistory.forEach((search) => {
      if (search.toLowerCase().includes(queryLower)) {
        suggestions.add(search)
      }
    })

    return Array.from(suggestions).slice(0, limit)
  }

  // Sugerencias populares
  getPopularSuggestions(limit = 5) {
    return this.popularSearches.slice(0, limit)
  }

  // Gestión del historial de búsqueda
  addToSearchHistory(query) {
    const trimmedQuery = query.trim()
    if (!trimmedQuery || trimmedQuery.length < 2) return

    // Remover si ya existe
    this.searchHistory = this.searchHistory.filter((item) => item !== trimmedQuery)

    // Agregar al inicio
    this.searchHistory.unshift(trimmedQuery)

    // Mantener solo los últimos 10
    this.searchHistory = this.searchHistory.slice(0, 10)

    // Guardar en localStorage
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

  loadPopularSearches() {
    return ["Vitamina C", "Colágeno", "Omega 3", "Vitaminas", "Suplementos", "Té verde", "Spirulina", "Complejo B"]
  }

  getCategoryName(category) {
    const categories = {
      vitaminas: "Vitaminas",
      suplementos: "Suplementos",
      hierbas: "Hierbas Medicinales",
    }
    return categories[category] || category
  }

  // Filtros avanzados
  getAvailableFilters() {
    const priceRanges = this.products.map((p) => p.price)
    const minPrice = Math.min(...priceRanges)
    const maxPrice = Math.max(...priceRanges)

    return {
      categories: [
        { value: "all", label: "Todas las categorías" },
        { value: "vitaminas", label: "Vitaminas" },
        { value: "suplementos", label: "Suplementos" },
        { value: "hierbas", label: "Hierbas Medicinales" },
      ],
      priceRange: {
        min: minPrice,
        max: maxPrice,
        step: 1000,
      },
      stockOptions: [
        { value: "all", label: "Todos los productos" },
        { value: "inStock", label: "Solo en stock" },
        { value: "lowStock", label: "Stock bajo (≤5)" },
        { value: "outOfStock", label: "Agotados" },
      ],
    }
  }
}

// Exportar para uso global
if (typeof window !== "undefined") {
  window.AdvancedSearch = AdvancedSearch
}
