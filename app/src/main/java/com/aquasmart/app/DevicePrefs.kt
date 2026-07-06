package com.aquasmart.app

import android.content.Context

/**
 * Guarda la última IP conocida del ESP32 (y su nombre), para poder
 * abrir el panel directamente la próxima vez sin tener que re-escanear
 * toda la red.
 */
class DevicePrefs(context: Context) {

    private val prefs = context.getSharedPreferences("aquasmart_prefs", Context.MODE_PRIVATE)

    var lastIp: String?
        get() = prefs.getString(KEY_IP, null)
        set(value) = prefs.edit().putString(KEY_IP, value).apply()

    var deviceName: String?
        get() = prefs.getString(KEY_NAME, null)
        set(value) = prefs.edit().putString(KEY_NAME, value).apply()

    fun clear() {
        prefs.edit().clear().apply()
    }

    companion object {
        private const val KEY_IP = "last_ip"
        private const val KEY_NAME = "device_name"
    }
}
