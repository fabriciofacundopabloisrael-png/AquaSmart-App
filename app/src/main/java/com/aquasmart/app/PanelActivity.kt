package com.aquasmart.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.View
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import com.aquasmart.app.databinding.ActivityPanelBinding

/**
 * Muestra el dashboard web del ESP32 dentro de la app, como si fuera una
 * pantalla nativa más. El usuario nunca ve la IP ni una barra de Chrome.
 *
 * El login de administrador (usuario/clave) lo sigue pidiendo el propio
 * WebView mediante HTTP Basic Auth (lo maneja el sistema automáticamente
 * con un diálogo), tal como ya funciona en un navegador normal.
 */
class PanelActivity : AppCompatActivity() {

    private lateinit var binding: ActivityPanelBinding

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPanelBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val url = intent.getStringExtra(EXTRA_URL) ?: return
        val pestanaObjetivo = intent.getStringExtra(EXTRA_TAB)

        val webView: WebView = binding.webView
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.useWideViewPort = true
        webView.settings.loadWithOverviewMode = true

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView, url: String?) {
                binding.progressBar.visibility = View.GONE

                // Si se pidió abrir directamente la pestaña de Configuración
                // (botón "Cambiar WiFi"), simulamos el clic en esa pestaña
                // usando el mismo JS que ya trae el dashboard.
                if (pestanaObjetivo != null) {
                    view.evaluateJavascript(
                        """
                        (function() {
                            var boton = document.querySelector('[data-tab="$pestanaObjetivo"]');
                            if (boton) { boton.click(); }
                        })();
                        """.trimIndent(),
                        null
                    )
                }
            }
        }

        webView.loadUrl(url)
    }

    override fun onBackPressed() {
        val webView = binding.webView
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    companion object {
        const val EXTRA_URL = "extra_url"
        const val EXTRA_TAB = "extra_tab"
    }
}
