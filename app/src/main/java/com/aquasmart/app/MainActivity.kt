package com.aquasmart.app

import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.aquasmart.app.databinding.ActivityMainBinding
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var prefs: DevicePrefs

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        prefs = DevicePrefs(this)

        binding.btnBuscar.setOnClickListener { buscarDispositivo(forzarEscaneoCompleto = true) }
        binding.btnAbrirPanel.setOnClickListener { abrirPanel(prefs.lastIp) }
        binding.btnCambiarWifi.setOnClickListener { abrirPanel(prefs.lastIp, rutaConfig = true) }
        binding.btnConectarAP.setOnClickListener {
            startActivity(Intent(Settings.ACTION_WIFI_SETTINGS))
        }

        buscarDispositivo(forzarEscaneoCompleto = false)
    }

    override fun onResume() {
        super.onResume()
        // Si el usuario vuelve de Ajustes de WiFi (después de conectarse al
        // AP del ESP32 o a su red de casa), reintentamos automáticamente.
    }

    private fun buscarDispositivo(forzarEscaneoCompleto: Boolean) {
        mostrarCargando()

        lifecycleScope.launch {
            // 1) Camino rápido: si ya conocíamos una IP, solo confirmamos
            //    que el dispositivo sigue ahí antes de escanear toda la red.
            val ipGuardada = prefs.lastIp
            if (!forzarEscaneoCompleto && ipGuardada != null) {
                val encontrado = NetworkScanner.probarIp(ipGuardada)
                if (encontrado != null) {
                    guardarYMostrarEncontrado(encontrado)
                    return@launch
                }
            }

            // 2) Camino completo: buscar por toda la red (y el AP 192.168.4.1).
            val encontrado = NetworkScanner.buscarEnRed(this@MainActivity)
            if (encontrado != null) {
                guardarYMostrarEncontrado(encontrado)
            } else {
                mostrarNoEncontrado()
            }
        }
    }

    private fun guardarYMostrarEncontrado(d: DispositivoEncontrado) {
        prefs.lastIp = d.ip
        prefs.deviceName = d.nombre
        mostrarEncontrado(d)
    }

    private fun mostrarCargando() {
        binding.progress.visibility = View.VISIBLE
        binding.txtEstado.text = getString(R.string.buscando)
        binding.txtNombre.visibility = View.GONE
        binding.txtIp.visibility = View.GONE
        binding.btnAbrirPanel.visibility = View.GONE
        binding.btnCambiarWifi.visibility = View.GONE
        binding.btnConectarAP.visibility = View.GONE
    }

    private fun mostrarEncontrado(d: DispositivoEncontrado) {
        binding.progress.visibility = View.GONE
        binding.txtEstado.text = "🟢 ${getString(R.string.encontrado)}"
        binding.txtNombre.text = "Nombre: ${d.nombre}"
        binding.txtNombre.visibility = View.VISIBLE
        binding.txtIp.text = "IP: ${d.ip}"
        binding.txtIp.visibility = View.VISIBLE
        binding.btnAbrirPanel.visibility = View.VISIBLE
        binding.btnCambiarWifi.visibility = View.VISIBLE
        binding.btnConectarAP.visibility = View.GONE

        // Abre el panel automáticamente en la primera detección, tal como
        // se pidió: el usuario no necesita tocar nada más.
        abrirPanel(d.ip)
    }

    private fun mostrarNoEncontrado() {
        binding.progress.visibility = View.GONE
        binding.txtEstado.text = getString(R.string.no_encontrado)
        binding.btnConectarAP.visibility = View.VISIBLE
        Toast.makeText(
            this,
            "Conéctate a la red WiFi \"AquaSmart\" o revisa que el dispositivo esté encendido",
            Toast.LENGTH_LONG
        ).show()
    }

    private fun abrirPanel(ip: String?, rutaConfig: Boolean = false) {
        if (ip == null) return
        val intent = Intent(this, PanelActivity::class.java)
        intent.putExtra(PanelActivity.EXTRA_URL, "http://$ip/")
        // El dashboard del ESP32 usa pestañas manejadas con JS (data-tab),
        // no rutas de URL. Si el usuario quiere cambiar el WiFi, le pedimos
        // al WebView que haga clic en la pestaña "Configuración" apenas
        // termine de cargar la página.
        if (rutaConfig) {
            intent.putExtra(PanelActivity.EXTRA_TAB, "tabConfig")
        }
        startActivity(intent)
    }
}
