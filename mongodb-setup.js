// MongoDB Atlas Setup Script
// Este script te ayuda a configurar MongoDB Atlas paso a paso

const MONGODB_SETUP_GUIDE = {
  steps: [
    {
      step: 1,
      title: "Crear Cuenta en MongoDB Atlas",
      description: "Registrarse en la plataforma gratuita",
      actions: [
        "Ir a https://cloud.mongodb.com",
        "Hacer clic en 'Try Free'",
        "Registrarse con email o Google",
        "Verificar email",
      ],
    },
    {
      step: 2,
      title: "Crear Cluster Gratuito",
      description: "Configurar base de datos M0 (gratis)",
      actions: [
        "Seleccionar 'Build a Database'",
        "Elegir M0 Sandbox (FREE)",
        "Región: us-east-1 (más cercana a Colombia)",
        "Nombre: SaludyVida",
        "Crear cluster",
      ],
    },
    {
      step: 3,
      title: "Configurar Acceso",
      description: "Crear usuario y permitir conexiones",
      actions: [
        "Database Access → Add New Database User",
        "Username: saludyvida",
        "Password: SaludVida2024!",
        "Privileges: Read and write to any database",
        "Network Access → Add IP Address: 0.0.0.0/0",
      ],
    },
    {
      step: 4,
      title: "Habilitar Data API",
      description: "Activar API para conexión desde JavaScript",
      actions: [
        "Data API → Enable the Data API",
        "Create API Key: SaludyVida-API",
        "Permissions: Read and Write",
        "Copiar API Key y URL Endpoint",
      ],
    },
  ],

  // Función para verificar conexión
  async testConnection(apiUrl, apiKey) {
    try {
      const response = await fetch(`${apiUrl}/action/findOne`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          collection: "test",
          database: "saludyvida",
          filter: {},
        }),
      })

      return response.ok
    } catch (error) {
      return false
    }
  },
}

// Exportar para uso en la aplicación
if (typeof module !== "undefined" && module.exports) {
  module.exports = MONGODB_SETUP_GUIDE
}
