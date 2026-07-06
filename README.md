# AquaSmart App (Android)

Puente inteligente entre el celular y el panel web del ESP32 **AquaSmart**.

La app **no tiene dashboard propio**. Su único trabajo es:

1. Buscar el ESP32 en la red (WiFi de casa o su red propia `AquaSmart`).
2. Recordar la última IP conocida para abrir directo la próxima vez.
3. Mostrar el panel web del ESP32 dentro de un WebView a pantalla completa,
   como si fuera una pantalla nativa más (el usuario nunca ve la IP).

## Cómo funciona el descubrimiento

- Al abrir la app, primero intenta la última IP guardada (`/info`).
- Si no responde, escanea:
  - `192.168.4.1` (la IP fija del ESP32 en modo Access Point).
  - Toda la subred del WiFi actual del celular (ej. `192.168.1.1..254`),
    consultando `http://IP/info` con un timeout corto (350 ms) y en
    paralelo, para que el escaneo tome pocos segundos.
- Identifica al ESP32 porque su `/info` siempre responde un JSON con los
  campos `nombre` y `ssidAP` (ver `WebPortal.cpp` → `manejarInfo()` en el
  firmware).
- Guarda la IP encontrada en `SharedPreferences` y abre el panel.

## Primera configuración (sin WiFi de casa aún)

El ESP32 no permite que la app le envíe el SSID/clave por su cuenta (eso
requeriría permisos especiales y APIs distintas según la versión de
Android, algo frágil de mantener). En su lugar:

1. El botón **"Conectar a la red del dispositivo"** abre los Ajustes de
   WiFi de Android para que el usuario se conecte a la red `AquaSmart`
   (clave `12345678`).
2. Al volver a la app y presionar **"Buscar nuevamente"**, la app encuentra
   el ESP32 en `192.168.4.1` y abre su panel — que ya trae su propia
   pestaña **Configuración** para poner el WiFi de casa.
3. Ese formulario ya existe en el firmware (`WebPage.h` / `WebPortal.cpp`),
   así que no se duplica nada: la app solo lo muestra.

## Botón "Cambiar WiFi"

Abre el panel y hace clic automáticamente en la pestaña
`Configuración` del dashboard (usa el mismo JS que ya tiene la página,
`data-tab="tabConfig"`), para que el usuario no tenga que buscarla.

## Estructura del proyecto

```
app/
 └─ src/main/
     ├─ java/com/aquasmart/app/
     │   ├─ MainActivity.kt      -> pantalla única: busca y muestra estado
     │   ├─ PanelActivity.kt     -> WebView de pantalla completa
     │   ├─ NetworkScanner.kt    -> escaneo de la red / detección del ESP32
     │   └─ DevicePrefs.kt       -> guarda la última IP conocida
     ├─ res/layout/              -> pantallas (XML)
     └─ AndroidManifest.xml
```

## Compilar

1. Abre la carpeta `AquaSmartApp` con **Android Studio** (Hedgehog o más
   reciente). Android Studio detectará el proyecto Gradle y se ofrecerá a
   regenerar el wrapper (`gradlew`) automáticamente — acepta.
2. Espera el *Gradle Sync*.
3. Conecta un celular (o usa un emulador) y presiona **Run**.

También puedes generar el APK sin abrir la interfaz gráfica:

```bash
./gradlew assembleRelease
# el APK queda en app/build/outputs/apk/release/app-release-unsigned.apk
```

## Publicar el código en GitHub

Desde la carpeta `AquaSmartApp`:

```bash
git init
git add .
git commit -m "AquaSmart App: puente inteligente hacia el panel del ESP32"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/aquasmart-app.git
git push -u origin main
```

(Crea antes el repositorio vacío en github.com/new, sin README ni
.gitignore, para que no haya conflictos al hacer el primer push).

## Próximas mejoras posibles

- Agregar `MDNS.begin("aquasmart")` en el firmware (`WiFiManager.cpp`) para
  que además de escanear IPs, la app pueda resolver `aquasmart.local`
  directamente — más rápido en redes grandes.
- Firmar el APK con una keystore propia para distribuirlo fuera de Google
  Play (por ahora `assembleRelease` genera un APK sin firmar).
- Ícono y splash screen definitivos (el ícono actual es un vector simple
  de marcador de posición).
