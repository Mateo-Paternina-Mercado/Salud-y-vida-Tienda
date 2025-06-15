// Nequi Integration Helper
// Funciones avanzadas para integración con Nequi

class NequiPaymentProcessor {
  constructor(config) {
    this.config = config
    this.accessToken = null
    this.tokenExpiry = null
  }

  // Obtener token de acceso con cache
  async getAccessToken() {
    // Verificar si el token actual es válido
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

      // Guardar token con tiempo de expiración
      this.accessToken = data.access_token
      this.tokenExpiry = Date.now() + data.expires_in * 1000 - 60000 // 1 minuto antes de expirar

      return this.accessToken
    } catch (error) {
      console.error("Error obteniendo token de Nequi:", error)
      throw error
    }
  }

  // Procesar pago push (el más común)
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
          message: "Pago procesado exitosamente",
          nequiResponse: result,
        }
      } else {
        return {
          success: false,
          errorCode: result.errorCode || "PAYMENT_FAILED",
          message: result.errorMessage || "Error procesando el pago",
          nequiResponse: result,
        }
      }
    } catch (error) {
      console.error("Error en pago Nequi:", error)
      return {
        success: false,
        errorCode: "NETWORK_ERROR",
        message: "Error de conexión con Nequi",
        error: error.message,
      }
    }
  }

  // Consultar estado de transacción
  async checkTransactionStatus(transactionId) {
    try {
      const token = await this.getAccessToken()

      const response = await fetch(
        `${this.config.BASE_URL}/payments/v2/-services-paymentservice-gettransactionstatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-api-key": this.config.API_KEY,
          },
          body: JSON.stringify({
            transactionId: transactionId,
          }),
        },
      )

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error consultando estado de transacción:", error)
      throw error
    }
  }

  // Reversar transacción (si es necesario)
  async reverseTransaction(transactionId, reason = "Solicitud del cliente") {
    try {
      const token = await this.getAccessToken()

      const response = await fetch(`${this.config.BASE_URL}/payments/v2/-services-paymentservice-reversetransaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-api-key": this.config.API_KEY,
        },
        body: JSON.stringify({
          transactionId: transactionId,
          reason: reason,
        }),
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error reversando transacción:", error)
      throw error
    }
  }
}

// Exportar clase para uso en la aplicación
if (typeof window !== "undefined") {
  window.NequiPaymentProcessor = NequiPaymentProcessor
}
