# Auditoría SEO Completa — rentacardeleje.com

**Fecha:** 2026-07-05
**Dominio:** https://rentacardeleje.com
**Hosting:** Netlify (deploy desde GitHub)
**Repositorio:** github.com/mejiaeduarandres3/rentacar-del-eje-

---

## 1. Estructura del Sitio

| Aspecto | Estado |
|---------|--------|
| **Stack** | HTML estático puro + CSS + JS vanilla |
| **Generación** | Páginas escritas a mano, no hay framework ni SSG |
| **Total de páginas** | 8 archivos HTML |

### Mapa de rutas

| Ruta | Propósito |
|------|-----------|
| `index.html` | Home — catálogo resumido + FAQ + proceso + CTA |
| `todos.html` | Listado completo de la flota |
| `fortuner-2023.html` | Ficha de vehículo — Toyota Fortuner 2023 SRV |
| `hilux.html` | Ficha de vehículo — Toyota Hilux |
| `mazda-cx30.html` | Ficha de vehículo — Mazda CX30 |
| `kia-seltos.html` | Ficha de vehículo — Kia Seltos |
| `kia-picanto.html` | Ficha de vehículo — Kia Picanto |
| `nosotros.html` | Página "Sobre Nosotros" + cobertura |

### Landing pages por ciudad: NO EXISTEN

No hay páginas dedicadas para Pereira, Armenia ni Manizales. Todo el contenido de las 3 ciudades vive mezclado en textos genéricos como "Eje Cafetero". Esto es una **oportunidad SEO local enorme** sin explotar.

---

## 2. SEO Técnico

### 2.1 robots.txt — NO EXISTE [ALTO IMPACTO]

No hay archivo `robots.txt`. Google puede rastrear todo, pero no hay directiva hacia el sitemap.

### 2.2 sitemap.xml — NO EXISTE [ALTO IMPACTO]

No hay sitemap. Google no tiene un mapa de las páginas del sitio. Con solo 8 páginas no es crítico, pero es una best practice indispensable y será esencial si se crean landing pages por ciudad.

### 2.3 Canonical tags — NO EXISTEN [ALTO IMPACTO]

Ninguna página tiene `<link rel="canonical">`. Esto puede causar problemas de contenido duplicado si Netlify sirve la misma página con y sin trailing slash o con/sin `www`.

### 2.4 netlify.toml — NO EXISTE [ALTO IMPACTO]

No hay configuración de Netlify. Faltan:
- Headers de seguridad (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- Headers de cache para assets estáticos (imágenes, CSS, JS)
- Redirects para normalizar www vs no-www
- Pretty URLs / trailing slash consistency

### 2.5 Encabezados HTML (h1-h6)

| Página | h1 | h2 | Problema |
|--------|----|----|----------|
| `index.html` | **0** | 7 | **Falta h1** — usa h2 para todo |
| `todos.html` | **0** | 2 | **Falta h1** |
| `fortuner-2023.html` | **0** | 5 | **Falta h1** — el título principal es h2 |
| `hilux.html` | **0** | 3 | **Falta h1** |
| `kia-picanto.html` | **0** | 3 | **Falta h1** |
| `kia-seltos.html` | **0** | 3 | **Falta h1** |
| `mazda-cx30.html` | **0** | 3 | **Falta h1** |
| `nosotros.html` | 1 | 5 | OK — es la única página con h1 |

**7 de 8 páginas no tienen h1.** Esto es un problema grave de SEO on-page.

### 2.6 Imágenes

| Archivo | Tamaño | Dimensiones | Problemas |
|---------|--------|-------------|-----------|
| `banner.png` | **1.9 MB** | 1881x836 | Muy pesado, debería ser WebP (~200KB) |
| `logo.png` | **2.0 MB** | 1125x2000 | Excesivo para favicon/OG. Usar versión optimizada |
| `fortuner.jpg` | 155 KB | 800x1066 | Aceptable |
| `hilux.jpg` | 163 KB | 800x1000 | Aceptable |
| `kia-picanto.jpg` | 152 KB | 800x1066 | Aceptable |
| `kia-seltos.jpg` | 188 KB | 800x1066 | Aceptable |
| `mazda-cx30.jpg` | 161 KB | 800x1066 | Aceptable |

**Videos:**
| Archivo | Tamaño | Problema |
|---------|--------|---------|
| `kia-seltos.mp4` | **61 MB** | Extremadamente pesado, autoplay en home |
| `kia-picanto.mp4` | **46 MB** | Extremadamente pesado, autoplay en home |
| `fortuner.mp4` | 3.1 MB | Aceptable |

**Total de videos: ~110 MB cargados en autoplay en la home.** Esto destruye el rendimiento móvil.

**Problemas generales de imágenes:**
- Ninguna imagen tiene atributos `width` ni `height` → causa CLS (Cumulative Layout Shift)
- Ninguna imagen usa `loading="lazy"` → todo carga de golpe
- No se usan formatos modernos (WebP/AVIF)
- El `banner.png` de 1.9MB es el LCP (Largest Contentful Paint) — debería ser <200KB en WebP

### 2.7 Fuentes web

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:...');
```

- Se usa `@import` en CSS en lugar de `<link rel="preload">` → **bloquea el renderizado**
- Se cargan **10+ pesos de Inter** cuando solo se usan 4-5 → descarga innecesaria
- `Playfair Display` se importa pero **no parece usarse activamente** → peso muerto
- No hay `font-display: swap` explícito en el CSS (Google Fonts lo incluye por defecto con `&display=swap`)

### 2.8 lang, charset, viewport — OK

Todas las páginas tienen `lang="es"`, `charset="UTF-8"` y viewport correcto.

### 2.9 HTTPS — OK (gestionado por Netlify)

### 2.10 JavaScript

- `main.js` es ligero (3.7 KB, vanilla JS) — sin problemas
- No bloquea el renderizado (está al final del body)
- No hay scripts de terceros ni trackers

### 2.11 CSS

- Un solo archivo `styles.css` de 32 KB — aceptable
- No está minificado

### 2.12 Core Web Vitals (estimación)

| Métrica | Estimación | Riesgo |
|---------|-----------|--------|
| **LCP** | POBRE — banner.png de 1.9MB + videos de 110MB | Probablemente >4s en móvil |
| **CLS** | POBRE — ninguna imagen tiene width/height | Probablemente >0.25 |
| **INP** | BUENO — JS mínimo, sin frameworks pesados | <200ms |

---

## 3. SEO On-Page

### 3.1 Title tags

| Página | Title | Largo | Incluye ciudad | Evaluación |
|--------|-------|-------|----------------|------------|
| index.html | "Renta Car del Eje \| Alquiler de Vehículos en el Eje Cafetero" | 60 | No (solo "Eje Cafetero") | Mejorable: agregar Pereira |
| todos.html | "Todos los Vehículos \| Renta Car del Eje" | 43 | No | Mejorable |
| fortuner-2023.html | "Toyota Fortuner 2023 SRV Gris Oscuro \| Renta Car del Eje" | 55 | No | Mejorable |
| hilux.html | "Toyota Hilux 4x4 \| Renta Car del Eje" | 40 | No | Mejorable |
| kia-picanto.html | "Kia Picanto \| Renta Car del Eje" | 32 | No | Mejorable |
| kia-seltos.html | "Kia Seltos \| Renta Car del Eje" | 32 | No | Mejorable |
| mazda-cx30.html | "Mazda CX30 \| Renta Car del Eje" | 32 | No | Mejorable |
| nosotros.html | "Nosotros \| Renta Car del Eje" | 30 | No | Mejorable |

**Problema:** Ningún title incluye una ciudad específica. Todos son genéricos.

### 3.2 Meta descriptions

| Página | Largo | Incluye CTA | Incluye ciudad | Evaluación |
|--------|-------|-------------|----------------|------------|
| index.html | 98 chars | No | No (genérico) | Muy corta, mejorable |
| todos.html | 82 chars | No | No | Muy corta |
| fortuner-2023.html | 99 chars | Sí ("Reserva ahora") | No | Mejorable |
| hilux.html | 80 chars | Sí | No | Muy corta |
| kia-picanto.html | 77 chars | Sí | No | Muy corta |
| kia-seltos.html | 62 chars | Sí | No | Muy corta |
| mazda-cx30.html | 63 chars | Sí | No | Muy corta |
| nosotros.html | 105 chars | No | No | Mejorable |

**Problema:** Todas las descriptions son demasiado cortas (62-105 chars vs. ideal de 150-160). Ninguna menciona ciudades específicas.

### 3.3 Palabras clave objetivo

Keywords objetivo que deberían estar presentes pero faltan o están sub-representadas:

| Keyword | Presente en títulos | Presente en contenido |
|---------|--------------------|-----------------------|
| "renta de carros Pereira" | No | Parcial (solo en textos largos) |
| "alquiler de vehículos Pereira" | No | No |
| "rent a car Armenia" | No | No |
| "alquiler de carros Manizales" | No | No |
| "renta de carros Eje Cafetero" | No | Parcial |
| "alquiler de camionetas 4x4" | No | Parcial |
| "rent a car aeropuerto Matecaña" | No | Solo en Fortuner |

### 3.4 Texto alternativo (alt) en imágenes

Las imágenes principales tienen alt descriptivos razonables (ej: "Toyota Fortuner 2023 SRV Gris Oscuro"). Sin embargo:
- Los alt son genéricos y no incluyen contexto de alquiler ni ciudad
- Los videos no tienen ningún texto alternativo ni poster

### 3.5 Enlaces internos

- Las fichas de vehículo tienen enlaces a "Vehículos Similares" — bueno
- La home enlaza a las fichas — bueno
- **39 enlaces rotos apuntando a `#`** (redes sociales, categorías, Política de Privacidad, etc.)
- **1 enlace roto a `vehiculo.html`** (archivo que no existe) en fortuner-2023.html
- No hay enlaces cruzados entre contenido de ciudades (porque no existen páginas por ciudad)

### 3.6 Contenido

- Las fichas de vehículo tienen texto descriptivo único — bueno
- La home tiene texto hero con keywords — bueno
- `nosotros.html` tiene contenido original — bueno
- `todos.html` es solo un listado sin texto contextual — mejorable
- **No hay contenido específico por ciudad** (oportunidad grande)
- El copyright dice "2024" — debería ser 2025 o dinámico

---

## 4. Datos Estructurados (Schema.org)

### Estado actual: NO EXISTE NINGÚN JSON-LD

No hay datos estructurados de ningún tipo en ninguna página.

### Lo que debería existir:

| Schema | Página | Prioridad |
|--------|--------|-----------|
| `AutoRental` / `LocalBusiness` | Todas (en home como mínimo) | **ALTA** |
| `Organization` con logo y sameAs | Todas | **ALTA** |
| `Product` / `Offer` | Cada ficha de vehículo | **ALTA** |
| `FAQPage` | index.html, fortuner-2023.html | **ALTA** |
| `BreadcrumbList` | Fichas de vehículos | **MEDIA** |
| `WebSite` con SearchAction | index.html | **MEDIA** |

---

## 5. SEO Local

### 5.1 NAP (Nombre, Dirección, Teléfono)

| Elemento | Estado | Consistencia |
|----------|--------|--------------|
| **Nombre** | "Renta Car del Eje" | Consistente en todas las páginas |
| **Teléfono** | +57 314 758 2415 | Consistente |
| **Email** | info@rentacardeleje.com | Consistente |
| **Dirección física** | **NO EXISTE** | Solo dice "Eje Cafetero, Colombia" |

**Problema grave:** No hay dirección física en ninguna parte del sitio. Google necesita una dirección verificable para SEO local. Si no hay oficina fija, al menos se necesita la zona de servicio.

### 5.2 Mapa embebido / Google Maps — NO EXISTE

No hay ningún mapa embebido ni enlace a Google Maps.

### 5.3 Mención de ciudades

Las 3 ciudades (Pereira, Armenia, Manizales) se mencionan en:
- Texto hero de la home (parcial)
- Sección de cobertura en nosotros.html (como lista)
- Algunas respuestas del FAQ
- Algunas descripciones de vehículos

**Pero no hay contenido dedicado ni optimizado para ninguna ciudad individual.**

---

## 6. Redes Sociales

### 6.1 Enlaces a redes sociales

| Red | URL real | Estado |
|-----|----------|--------|
| Facebook | `#` | **ENLACE ROTO** — apunta a # |
| Instagram | `#` | **ENLACE ROTO** — apunta a # |
| TikTok | `#` | **ENLACE ROTO** — apunta a # |
| WhatsApp | `wa.me/573147582415` | OK |

Los íconos de redes sociales en footer/header son solo emoji (📘, 📷, 🎵) o texto (FB, IG, TK) — inconsistentes entre páginas. Todos apuntan a `#` excepto WhatsApp.

### 6.2 Open Graph tags

| Tag | Estado |
|-----|--------|
| `og:title` | Presente en todas las páginas |
| `og:description` | Presente en todas (pero cortas) |
| `og:image` | Apunta al logo (2MB, 1125x2000) — **no es formato 1200x630** |
| `og:type` | "website" en todas |
| `og:url` | **NO EXISTE en ninguna página** |
| `og:site_name` | **NO EXISTE** |

### 6.3 Twitter Cards

| Tag | Estado |
|-----|--------|
| `twitter:card` | "summary_large_image" — OK |
| `twitter:title` | Solo en index.html, falta en las demás |
| `twitter:description` | Solo en index.html, falta en las demás |
| `twitter:image` | Apunta al logo (no optimizado) |

### 6.4 Imagen de preview

El logo actual (`logo.png`, 1125x2000, 2MB) **no es adecuado** para Open Graph:
- Formato vertical (debería ser 1200x630 horizontal)
- Peso excesivo (debería ser <300KB)
- No tiene texto contextual sobre el servicio

Se necesita una imagen OG dedicada de 1200x630.

### 6.5 Enlaces `target="_blank"` sin `rel="noopener noreferrer"`

Todos los enlaces externos (WhatsApp, redes sociales) usan `target="_blank"` pero **ninguno tiene `rel="noopener noreferrer"`**. Esto es un problema menor de seguridad.

---

## 7. Indexabilidad

### 7.1 Google Search Console / Bing Webmaster Tools

No hay evidencia de verificación:
- No hay meta tag de verificación de Google
- No hay archivo de verificación en la raíz
- No hay DNS TXT record (no verificable desde aquí)

**Se necesita:** Dar de alta el sitio en Google Search Console y enviar el sitemap.

### 7.2 Bloqueos accidentales

- No hay meta `noindex` en ninguna página — OK
- No hay `robots.txt` que bloquee — OK (pero tampoco apunta al sitemap)
- No hay bloqueos accidentales detectados

---

## 8. Lista Priorizada de Hallazgos

### IMPACTO ALTO (resolver primero)

| # | Hallazgo | Páginas afectadas |
|---|----------|-------------------|
| 1 | **Videos de 110MB en autoplay en la home** — destruye LCP y experiencia móvil | index.html |
| 2 | **7 de 8 páginas sin `<h1>`** — falta la etiqueta más importante para SEO | Todas menos nosotros.html |
| 3 | **No existe robots.txt** | Sitio completo |
| 4 | **No existe sitemap.xml** | Sitio completo |
| 5 | **No existen canonical tags** | Todas las páginas |
| 6 | **No existe JSON-LD** (LocalBusiness, Product, FAQ, Organization) | Todas las páginas |
| 7 | **No existen landing pages por ciudad** — oportunidad SEO local enorme | N/A |
| 8 | **No hay dirección física** en el sitio | Todas las páginas |
| 9 | **Banner hero de 1.9MB en PNG** — debería ser WebP ~200KB | index.html |
| 10 | **Logo de 2MB usado como OG image** — necesita imagen OG de 1200x630 optimizada | Todas las páginas |
| 11 | **No hay netlify.toml** — falta cache, seguridad, redirects | Sitio completo |
| 12 | **Titles y descriptions sin ciudades** — no capturan búsquedas locales | Todas las páginas |

### IMPACTO MEDIO

| # | Hallazgo | Páginas afectadas |
|---|----------|-------------------|
| 13 | **39 enlaces rotos (`href="#"`)** — redes sociales, categorías, políticas | Múltiples páginas |
| 14 | **1 enlace roto a `vehiculo.html`** (no existe) | fortuner-2023.html |
| 15 | **Imágenes sin `width`/`height`** → CLS alto | Todas las páginas |
| 16 | **Imágenes sin `loading="lazy"`** | Todas las páginas |
| 17 | **Fuente importada con `@import`** en vez de `<link preload>` | styles.css (todas) |
| 18 | **Pesos de fuente innecesarios** cargados (10+ pesos de Inter) | styles.css (todas) |
| 19 | **Falta `og:url`** en todas las páginas | Todas las páginas |
| 20 | **Falta `twitter:title` y `twitter:description`** en 7 de 8 páginas | Todas menos index |
| 21 | **Copyright dice "2024"** — desactualizado | Todas las páginas |
| 22 | **Falta `rel="noopener noreferrer"` en enlaces `target="_blank"`** | Todas las páginas |
| 23 | **CSS no minificado** (32KB) | styles.css |
| 24 | **Descriptions demasiado cortas** (62-105 chars vs. 150-160 ideal) | Todas las páginas |

### IMPACTO BAJO

| # | Hallazgo | Páginas afectadas |
|---|----------|-------------------|
| 25 | **Alt de imágenes genéricos** — no incluyen contexto de alquiler ni ciudad | Todas las páginas |
| 26 | **No hay Google Search Console** configurado | Sitio completo |
| 27 | **Inconsistencia en íconos de redes** — algunos usan emoji, otros texto | Varias páginas |
| 28 | **Videos sin poster ni texto alternativo** | index.html |
| 29 | **Playfair Display importada pero posiblemente no usada** | styles.css |
| 30 | **`todos.html` sin texto contextual** — solo listado | todos.html |

---

## 9. Próximos Pasos Recomendados

### Fase 2 (SEO técnico + on-page):
1. Crear `robots.txt` y `sitemap.xml`
2. Agregar canonical tags a todas las páginas
3. Corregir la jerarquía de headings (agregar h1 a 7 páginas)
4. Optimizar titles y descriptions con ciudades
5. Configurar `netlify.toml`
6. Implementar JSON-LD
7. Optimizar imágenes (WebP, lazy loading, width/height)
8. Corregir enlaces rotos

### Fase 3 (redes sociales):
1. Crear imagen OG optimizada
2. Completar Open Graph y Twitter Cards
3. Conectar enlaces reales de redes sociales
4. Agregar `rel="noopener noreferrer"`

### Decisión pendiente:
**¿Crear landing pages por ciudad?** (Pereira, Armenia, Manizales)
- Pro: captura búsquedas locales específicas
- Pro: permite JSON-LD de LocalBusiness por ciudad
- Contra: requiere contenido único por página para no ser thin content
- **Recomendación: SÍ, pero con contenido sustancial y diferenciado**
