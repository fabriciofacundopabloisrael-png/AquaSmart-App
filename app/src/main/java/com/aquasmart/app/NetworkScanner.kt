package com.aquasmart.app

import android.content.Context
import android.net.wifi.WifiManager
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

/**
 * Resultado de encontrar un AquaSmart en la red: su IP y el nombre
 * configurado en el propio ESP32 (endpoint /info).
 */
data class DispositivoEncontrado(val ip: String, val nombre: String)

object NetworkScanner {

    private const val TIMEOUT_MS = 350
    private const val CONCURRENCIA = 40

    /**
     * Pregunta directamente a una IP si es un AquaSmart, consultando /info.
     * Se usa tanto para revalidar la última IP guardada como durante el
     * escaneo completo de la subred.
     */
    suspend fun probarIp(ip: String): DispositivoEncontrado? = withContext(Dispatchers.IO) {
        try {
            val url = URL("http://$ip/info")
            val conn = url.openConnection() as HttpURLConnection
            conn.connectTimeout = TIMEOUT_MS
            conn.readTimeout = TIMEOUT_MS
            conn.requestMethod = "GET"

            if (conn.responseCode != 200) return@withContext null

            val body = conn.inputStream.bufferedReader().use { it.readText() }
            val json = JSONObject(body)

            // Firma mínima del firmware AquaSmart: el /info siempre trae
            // "nombre" y "ssidAP". Si ambos existen, asumimos que es nuestro
            // dispositivo (no un router u otro aparato cualquiera).
            if (!json.has("nombre") || !json.has("ssidAP")) return@withContext null

            DispositivoEncontrado(ip = ip, nombre = json.optString("nombre", "AquaSmart"))
        } catch (e: Exception) {
            null
        }
    }

    /**
     * Escanea toda la subred /24 en la que está el celular (asumiendo que
     * el ESP32 está en modo estación, conectado al mismo WiFi de casa), y
     * devuelve el primer AquaSmart que responda.
     *
     * También revisa la puerta de enlace típica del modo Access Point del
     * propio ESP32 (192.168.4.1), por si el celular sigue conectado a esa
     * red mientras se configura.
     */
    suspend fun buscarEnRed(context: Context): DispositivoEncontrado? = withContext(Dispatchers.IO) {
        // Primero, el caso más común cuando el ESP32 aún no salió del modo AP.
        probarIp("192.168.4.1")?.let { return@withContext it }

        val prefijo = obtenerPrefijoSubred(context) ?: return@withContext null

        // Se prueban los 254 hosts posibles en bloques concurrentes para
        // que el escaneo tome pocos segundos.
        for (bloqueInicio in 1..254 step CONCURRENCIA) {
            val bloqueFin = minOf(bloqueInicio + CONCURRENCIA - 1, 254)
            val resultados = (bloqueInicio..bloqueFin).map { host ->
                async { probarIp("$prefijo.$host") }
            }.awaitAll()

            resultados.firstOrNull { it != null }?.let { return@withContext it }
        }

        null
    }

    /**
     * Obtiene el prefijo de la subred actual del celular (ej. "192.168.1")
     * a partir de la IP asignada por DHCP en la interfaz WiFi.
     */
    private fun obtenerPrefijoSubred(context: Context): String? {
        val wifiManager = context.applicationContext
            .getSystemService(Context.WIFI_SERVICE) as? WifiManager ?: return null

        @Suppress("DEPRECATION")
        val ip = wifiManager.connectionInfo?.ipAddress ?: return null
        if (ip == 0) return null

        // La IP viene en formato little-endian; se arma el string manualmente.
        val partes = intArrayOf(
            ip and 0xFF,
            ip shr 8 and 0xFF,
            ip shr 16 and 0xFF,
            ip shr 24 and 0xFF
        )
        return "${partes[0]}.${partes[1]}.${partes[2]}"
    }
}
