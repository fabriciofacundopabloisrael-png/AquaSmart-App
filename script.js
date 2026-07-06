/* ==========================================================
   AquaSmart — script.js
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  initTheme();
  initLang();
  initNavbar();
  initWaveCanvas();
  initReveal();
  initCounters();
  initFlowDot();
  initCarousel();
  initAccordion();
});

/* ===================== THEME (light / dark) ===================== */
function initTheme(){
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const icon = btn.querySelector('i');

  const saved = localStorage.getItem('aquasmart-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(initial);

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('aquasmart-theme', next);
  });

  function applyTheme(theme){
    if (theme === 'dark'){
      root.setAttribute('data-theme', 'dark');
      icon.className = 'fa-solid fa-sun';
    } else {
      root.removeAttribute('data-theme');
      icon.className = 'fa-solid fa-moon';
    }
  }
}

/* ===================== LANGUAGE (ES / EN) ===================== */
const I18N = {
  es: {
    'nav.about':'Proyecto','nav.features':'Características','nav.how':'Cómo funciona',
    'nav.gallery':'Capturas','nav.downloads':'Descargas','nav.faq':'FAQ','nav.cta':'APK',
    'hero.eyebrow':'ESP32 · IoT · Android','hero.subtitle':'Monitoreo inteligente del consumo de agua',
    'hero.desc':'Convierte cualquier tubería en un sistema conectado: mide en tiempo real, predice tu consumo, detecta fugas y cuida tu bolsillo — todo desde tu teléfono.',
    'hero.btn1':'Descargar APK','hero.btn2':'Ver en GitHub',
    'hero.stat1':'ahorro potencial de agua','hero.stat2':'monitoreo continuo','hero.stat3':'código abierto',
    'apkhero.title':'Descarga AquaSmart',
    'apkhero.desc':'Conéctate fácilmente a tu dispositivo AquaSmart desde tu teléfono Android. Sin cuentas, sin nube: la app habla directo con tu ESP32.',
    'apkhero.li1':'Detección automática del dispositivo en tu red','apkhero.li2':'Panel completo dentro de la app','apkhero.li3':'Compatible con Android 8.0 o superior',
    'apkhero.btn':'Descargar APK','apkhero.meta':'v1.0 · ~6 MB · APK directo',
    'about.tag':'El proyecto','about.title':'¿Qué es AquaSmart?',
    'about.p1':'AquaSmart es un sistema de monitoreo de agua construido sobre un microcontrolador ESP32, pensado para instalarse en la tubería principal de una vivienda. Mide el flujo en tiempo real, lo transforma en datos útiles y los entrega a través de una red WiFi propia o de casa.',
    'about.p2':'Todo eso se sirve como un panel web ligero alojado en el propio ESP32, y la app Android actúa como puente inteligente: encuentra el dispositivo en la red y muestra ese panel a pantalla completa, como si fuera una pantalla nativa más.',
    'features.tag':'Funciones','features.title':'Todo lo que AquaSmart controla por ti',
    'f1.t':'Medición en tiempo real','f1.p':'Caudal y consumo instantáneo, actualizados segundo a segundo.',
    'f2.t':'Consumo diario','f2.p':'Resumen claro de cuánta agua se usó cada día en tu hogar.',
    'f3.t':'Historial mensual','f3.p':'Tendencias mes a mes para entender tus hábitos de consumo.',
    'f4.t':'Predicción de consumo','f4.p':'Estimaciones a futuro basadas en tu comportamiento real.',
    'f5.t':'Cálculo del costo','f5.p':'Convierte litros en dinero según la tarifa de tu localidad.',
    'f6.t':'Alertas inteligentes','f6.p':'Avisos cuando el consumo se sale de lo habitual.',
    'f7.t':'Detección de fugas','f7.p':'Identifica consumo continuo anómalo típico de una fuga.',
    'f8.t':'Panel web integrado','f8.p':'Todo el dashboard vive dentro del propio ESP32.',
    'f9.t':'Aplicación Android','f9.p':'Puente nativo que encuentra tu ESP32 y muestra su panel.',
    'f10.t':'Configuración WiFi','f10.p':'Conecta el dispositivo a tu red de casa en un par de pasos.',
    'how.tag':'Arquitectura','how.title':'Cómo funciona AquaSmart','how.desc':'Del sensor a tu mano, en seis pasos.',
    'flow1.t':'Sensor de flujo','flow1.p':'Registra cada pulso de agua que pasa por la tubería.',
    'flow2.t':'ESP32','flow2.p':'Procesa los pulsos y los convierte en litros y caudal.',
    'flow3.t':'WiFi','flow3.p':'Publica los datos en tu red doméstica o su propia red AP.',
    'flow4.t':'Servidor web','flow4.p':'Un panel completo servido directamente desde el propio chip.',
    'flow5.t':'Aplicación Android','flow5.p':'Encuentra el ESP32 y muestra su panel a pantalla completa.',
    'flow6.t':'Usuario','flow6.p':'Ve, entiende y controla su consumo desde el teléfono.',
    'gallery.tag':'Vista previa','gallery.title':'La app en acción',
    'shot1':'Panel en tiempo real','shot2':'Historial y tendencias','shot3':'Alertas de consumo','shot4':'Configuración WiFi',
    'gallery.note':'*Capturas ilustrativas — se actualizarán con imágenes reales de la app.',
    'downloads.tag':'Descargas','downloads.title':'Llévate AquaSmart contigo',
    'dl1.t':'Descargar APK','dl1.p':'Instala la app en tu Android y conéctate al instante.',
    'dl2.t':'Código Fuente','dl2.p':'Repositorio completo: firmware, app y esta misma web.','dl2.link':'Ver repositorio',
    'dl3.t':'Manual PDF','dl3.p':'Guía paso a paso de instalación, configuración y uso.','dl3.link':'Descargar guía',
    'tech.tag':'Stack','tech.title':'Tecnologías utilizadas',
    'faq.tag':'Dudas frecuentes','faq.title':'Preguntas frecuentes',
    'faq1.q':'¿Necesito internet para usar AquaSmart?','faq1.a':'No. El ESP32 crea su propia red WiFi y sirve el panel localmente; el internet solo es útil si quieres acceder también desde tu red de casa.',
    'faq2.q':'¿Qué necesito para instalarlo?','faq2.a':'Un ESP32, un sensor de flujo compatible y unos minutos para conectarlo a la tubería principal. El manual PDF detalla cada paso.',
    'faq3.q':'¿La app funciona en cualquier Android?','faq3.a':'Funciona en Android 8.0 o superior. No requiere Google Play: se instala directamente desde el APK.',
    'faq4.q':'¿Es un proyecto de código abierto?','faq4.a':'Sí. Todo el firmware, la app Android y esta web están disponibles públicamente en GitHub.',
    'ctafinal.title':'Empieza a cuidar tu agua hoy','ctafinal.desc':'Descarga la app, conecta tu ESP32 y ve tu consumo en tiempo real.','ctafinal.btn':'Descargar APK',
    'footer.tag':'Monitoreo inteligente del consumo de agua.','footer.h1':'Proyecto','footer.h2':'Enlaces','footer.h3':'Autor',
    'footer.version':'Versión 1.0','footer.author':'Fabricio Facundo Pablo Israel','footer.rights':'Todos los derechos reservados.'
  },
  en: {
    'nav.about':'Project','nav.features':'Features','nav.how':'How it works',
    'nav.gallery':'Screenshots','nav.downloads':'Downloads','nav.faq':'FAQ','nav.cta':'APK',
    'hero.eyebrow':'ESP32 · IoT · Android','hero.subtitle':'Smart water consumption monitoring',
    'hero.desc':'Turn any pipe into a connected system: measure in real time, predict your usage, detect leaks and save money — all from your phone.',
    'hero.btn1':'Download APK','hero.btn2':'View on GitHub',
    'hero.stat1':'potential water savings','hero.stat2':'continuous monitoring','hero.stat3':'open source',
    'apkhero.title':'Download AquaSmart',
    'apkhero.desc':'Easily connect to your AquaSmart device from your Android phone. No accounts, no cloud: the app talks directly to your ESP32.',
    'apkhero.li1':'Automatic device detection on your network','apkhero.li2':'Full dashboard inside the app','apkhero.li3':'Compatible with Android 8.0 or higher',
    'apkhero.btn':'Download APK','apkhero.meta':'v1.0 · ~6 MB · Direct APK',
    'about.tag':'The project','about.title':'What is AquaSmart?',
    'about.p1':'AquaSmart is a water monitoring system built on an ESP32 microcontroller, designed to be installed on a home\'s main pipe. It measures flow in real time, turns it into useful data and delivers it over its own WiFi network or your home network.',
    'about.p2':'Everything is served as a lightweight web panel hosted on the ESP32 itself, and the Android app acts as a smart bridge: it finds the device on the network and shows that panel full-screen, like a native screen of its own.',
    'features.tag':'Features','features.title':'Everything AquaSmart controls for you',
    'f1.t':'Real-time measurement','f1.p':'Flow rate and instant consumption, updated every second.',
    'f2.t':'Daily consumption','f2.p':'Clear summary of how much water was used each day.',
    'f3.t':'Monthly history','f3.p':'Month-to-month trends to understand your habits.',
    'f4.t':'Consumption prediction','f4.p':'Future estimates based on your real behavior.',
    'f5.t':'Cost calculation','f5.p':'Converts liters into money based on your local rate.',
    'f6.t':'Smart alerts','f6.p':'Notifications when consumption looks unusual.',
    'f7.t':'Leak detection','f7.p':'Identifies the continuous flow typical of a leak.',
    'f8.t':'Built-in web panel','f8.p':'The whole dashboard lives inside the ESP32 itself.',
    'f9.t':'Android app','f9.p':'Native bridge that finds your ESP32 and shows its panel.',
    'f10.t':'WiFi setup','f10.p':'Connect the device to your home network in a couple of steps.',
    'how.tag':'Architecture','how.title':'How AquaSmart works','how.desc':'From the sensor to your hand, in six steps.',
    'flow1.t':'Flow sensor','flow1.p':'Registers every pulse of water passing through the pipe.',
    'flow2.t':'ESP32','flow2.p':'Processes the pulses and converts them into liters and flow rate.',
    'flow3.t':'WiFi','flow3.p':'Publishes the data on your home network or its own AP network.',
    'flow4.t':'Web server','flow4.p':'A full panel served directly from the chip itself.',
    'flow5.t':'Android app','flow5.p':'Finds the ESP32 and shows its panel full-screen.',
    'flow6.t':'User','flow6.p':'Sees, understands and controls their consumption from the phone.',
    'gallery.tag':'Preview','gallery.title':'The app in action',
    'shot1':'Real-time panel','shot2':'History and trends','shot3':'Consumption alerts','shot4':'WiFi setup',
    'gallery.note':'*Illustrative screenshots — will be updated with real app images.',
    'downloads.tag':'Downloads','downloads.title':'Take AquaSmart with you',
    'dl1.t':'Download APK','dl1.p':'Install the app on your Android and connect instantly.',
    'dl2.t':'Source Code','dl2.p':'Full repository: firmware, app and this website.','dl2.link':'View repository',
    'dl3.t':'PDF Manual','dl3.p':'Step-by-step installation, setup and usage guide.','dl3.link':'Download guide',
    'tech.tag':'Stack','tech.title':'Technologies used',
    'faq.tag':'Common questions','faq.title':'Frequently asked questions',
    'faq1.q':'Do I need internet to use AquaSmart?','faq1.a':'No. The ESP32 creates its own WiFi network and serves the panel locally; internet is only useful if you also want access from your home network.',
    'faq2.q':'What do I need to install it?','faq2.a':'An ESP32, a compatible flow sensor and a few minutes to connect it to the main pipe. The PDF manual covers every step.',
    'faq3.q':'Does the app work on any Android?','faq3.a':'It works on Android 8.0 or higher. No Google Play required: it installs directly from the APK.',
    'faq4.q':'Is it an open source project?','faq4.a':'Yes. All the firmware, the Android app and this website are publicly available on GitHub.',
    'ctafinal.title':'Start taking care of your water today','ctafinal.desc':'Download the app, connect your ESP32 and see your consumption in real time.','ctafinal.btn':'Download APK',
    'footer.tag':'Smart water consumption monitoring.','footer.h1':'Project','footer.h2':'Links','footer.h3':'Author',
    'footer.version':'Version 1.0','footer.author':'Fabricio Facundo Pablo Israel','footer.rights':'All rights reserved.'
  }
};

function initLang(){
  const btn = document.getElementById('langToggle');
  const label = document.getElementById('langLabel');
  const saved = localStorage.getItem('aquasmart-lang') || 'es';
  applyLang(saved);

  btn.addEventListener('click', () => {
    const current = document.documentElement.lang === 'en' ? 'en' : 'es';
    const next = current === 'es' ? 'en' : 'es';
    applyLang(next);
    localStorage.setItem('aquasmart-lang', next);
  });

  function applyLang(lang){
    document.documentElement.lang = lang;
    label.textContent = lang.toUpperCase();
    const dict = I18N[lang] || I18N.es;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });
  }
}

/* ===================== NAVBAR (scroll state + mobile menu) ===================== */
function initNavbar(){
  const navbar = document.getElementById('navbar');
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  const progress = document.getElementById('scrollProgress');

  function onScroll(){
    const scrollTop = window.scrollY;
    navbar.classList.toggle('scrolled', scrollTop > 20);
    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (height > 0 ? (scrollTop / height) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* ===================== WAVE CANVAS BACKGROUND ===================== */
function initWaveCanvas(){
  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, t = 0;

  function resize(){
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }
  window.addEventListener('resize', resize);
  resize();

  const layers = [
    { amp: 26, len: 0.008, speed: 0.012, color: 'rgba(33,150,243,0.18)', offset: 0.55 },
    { amp: 34, len: 0.006, speed: 0.018, color: 'rgba(0,188,212,0.16)', offset: 0.68 },
    { amp: 20, len: 0.010, speed: 0.024, color: 'rgba(0,229,196,0.14)', offset: 0.80 }
  ];

  function draw(){
    ctx.clearRect(0, 0, w, h);
    layers.forEach(layer => {
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 8){
        const y = h * layer.offset + Math.sin(x * layer.len + t * layer.speed * 60) * layer.amp * devicePixelRatio;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = layer.color;
      ctx.fill();
    });
    t += 0.016;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ===================== SCROLL REVEAL ===================== */
function initReveal(){
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => observer.observe(el));
}

/* ===================== ANIMATED COUNTERS ===================== */
function initCounters(){
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(el => observer.observe(el));

  function animateCounter(el){
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const start = performance.now();
    function step(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
}

/* ===================== FLOW DOT (traveling pulse) ===================== */
function initFlowDot(){
  const path = document.getElementById('flowPath');
  const dot = document.getElementById('flowDot');
  const flow = document.getElementById('flow');
  if (!path || !dot || !flow) return;

  const length = path.getTotalLength();
  let progress = 0;
  let running = false;

  function tick(){
    if (!running) return;
    progress += 0.0035;
    if (progress > 1) progress = 0;
    const point = path.getPointAtLength(progress * length);
    dot.setAttribute('cx', point.x);
    dot.setAttribute('cy', point.y);
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      running = entry.isIntersecting;
      if (running) requestAnimationFrame(tick);
    });
  }, { threshold: 0.1 });
  observer.observe(flow);
}

/* ===================== CAROUSEL ===================== */
function initCarousel(){
  const track = document.getElementById('carouselTrack');
  const prev = document.getElementById('prevSlide');
  const next = document.getElementById('nextSlide');
  const dotsWrap = document.getElementById('carouselDots');
  if (!track) return;

  const slides = track.children.length;
  let index = 0;

  for (let i = 0; i < slides; i++){
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }

  function goTo(i){
    index = (i + slides) % slides;
    track.style.transform = `translateX(-${index * 100}%)`;
    dotsWrap.querySelectorAll('.dot').forEach((d, idx) => d.classList.toggle('active', idx === index));
  }

  prev.addEventListener('click', () => goTo(index - 1));
  next.addEventListener('click', () => goTo(index + 1));

  let autoplay = setInterval(() => goTo(index + 1), 5000);
  track.closest('.carousel').addEventListener('mouseenter', () => clearInterval(autoplay));
  track.closest('.carousel').addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo(index + 1), 5000);
  });
}

/* ===================== ACCORDION (FAQ) ===================== */
function initAccordion(){
  const items = document.querySelectorAll('.accordion-item');
  items.forEach(item => {
    const head = item.querySelector('.accordion-head');
    const body = item.querySelector('.accordion-body');
    head.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.accordion-body').style.maxHeight = null;
      });
      if (!isOpen){
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}
