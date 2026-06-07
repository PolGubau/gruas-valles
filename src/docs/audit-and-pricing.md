# Auditoría Técnica y Propuesta Económica
### Grúas del Vallès S.A. - Rediseño web, migración y mantenimiento

---

## 1. Diagnóstico: Problemas detectados en la web actual

A continuación se detallan los **fallos críticos** identificados en `www.gruasdelvalles.com`, junto con la **solución concreta** que aplicaremos en cada caso.

### 1.1. Problemas tecnológicos y de infraestructura

| #   | Problema actual                                                                           | Impacto en el negocio                                             | Solución propuesta                                                                       |
| --- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | Sitio desarrollado en **Classic ASP** (tecnología de los años 90, obsoleta y sin soporte) | Imposible mantener, alto coste de hosting, riesgo de caída        | Migración a **Astro 5** estático servido desde CDN                                       |
| 2   | Servidor Windows con IIS clásico, sin HTTPS moderno ni HTTP/2                             | Penalización SEO de Google y avisos de "no seguro" en navegadores | Despliegue en **Cloudflare Pages / Vercel** con HTTPS, HTTP/3 y certificados automáticos |
| 3   | Sin sistema de caché ni CDN                                                               | Tiempos de carga de 4-8 s en móvil                                | CDN global, **TTFB < 150 ms** en toda Europa                                             |
| 4   | URLs dinámicas tipo `main.asp?Familia=279&Subfamilia=836`                                 | Imposibles de compartir, recordar e indexar correctamente         | URLs limpias y semánticas: `/flota/liebherr-mk-88`                                       |
| 5   | Sin copia de seguridad automatizada                                                       | Riesgo total de pérdida de datos                                  | Versionado en **GitHub** + despliegues atómicos con rollback inmediato                   |

### 1.2. Problemas de rendimiento

| #   | Problema actual                                    | Impacto                             | Solución                                                           |
| --- | -------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------ |
| 6   | Imágenes en JPG/PNG sin comprimir (>2 MB cada una) | LCP > 5 s en 4G                     | Conversión a **WebP/AVIF**, lazy-loading y `srcset` responsive     |
| 7   | JavaScript bloqueante y CSS sin minificar          | Bloqueo del renderizado             | Cero JS por defecto en Astro, CSS crítico inline                   |
| 8   | Sin optimización para móvil (no responsive real)   | 60% del tráfico B2B se pierde       | Diseño **mobile-first** con Tailwind v4                            |
| 9   | Lighthouse Score estimado: **25-40 / 100**         | Pérdida de posicionamiento orgánico | Garantía de **95-100 / 100** en todas las métricas Core Web Vitals |

### 1.3. Problemas de SEO y posicionamiento

| #   | Problema actual                                                                    | Impacto                                                 | Solución                                                                                |
| --- | ---------------------------------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 10  | Meta keywords con **errores ortográficos** ("tonelasa" en lugar de "toneladas")    | Mensaje poco profesional para Google y clientes         | Reescritura completa de metadatos con keywords B2B validadas                            |
| 11  | Sin jerarquía de encabezados (H1, H2, H3)                                          | Google no entiende la estructura del contenido          | Arquitectura semántica HTML5 con jerarquía clara                                        |
| 12  | Sin **Schema.org / JSON-LD** estructurado                                          | No aparece en resultados enriquecidos ni en Google Maps | Implementación de `LocalBusiness` + `ProfessionalService` + `FAQPage`                   |
| 13  | Tráfico mal segmentado: atrae a particulares que buscan "grúa asistencia coche"    | Llamadas inútiles que saturan administración            | Reposicionamiento semántico hacia **B2B industrial** (obra, construcción, instaladores) |
| 14  | Sin sitemap.xml ni robots.txt optimizados                                          | Indexación lenta e incompleta                           | Generación automática en cada despliegue                                                |
| 15  | Sin optimización **AEO** (motores de IA: ChatGPT, Perplexity, Google AI Overviews) | Invisible en el nuevo paradigma de búsqueda 2026        | FAQs estructuradas + contenido pre-renderizado accesible a LLMs                         |

### 1.4. Problemas de UX/UI y conversión

| #   | Problema actual                                                   | Impacto                                             | Solución                                                                  |
| --- | ----------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------- |
| 16  | Diseño visual de los años 2000, sin identidad de marca actual     | Pérdida de credibilidad frente a competidores       | Nueva identidad visual industrial: gris antracita + amarillo de seguridad |
| 17  | Sin llamadas a la acción claras (teléfono, WhatsApp, presupuesto) | Tasa de conversión < 0,5%                           | CTAs sticky en header, botón WhatsApp flotante, formulario rápido         |
| 18  | Catálogo de flota en páginas planas y desestructuradas            | El cliente no encuentra la grúa que necesita        | Grid interactivo filtrable por tonelaje, tipo y altura                    |
| 19  | Sin ficha técnica destacada para la **Liebherr MK 88-4.1**        | No se aprovecha el activo diferencial de la empresa | Bloque destacado con diagrama de carga y CTA específico                   |
| 20  | Formulario de contacto genérico sin campos técnicos               | Presupuestos imprecisos, ida y vuelta de emails     | Formulario B2B con peso, dimensiones, radio y ubicación                   |
| 21  | Sin galería de maniobras reales visible                           | No se transmite la experiencia de 55 años           | Carrusel lightbox con maniobras reales de la empresa                      |

### 1.5. Problemas legales y de cumplimiento

| #   | Problema actual                                    | Impacto                                               | Solución                                                               |
| --- | -------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| 22  | Sin aviso de cookies conforme al RGPD              | Sanciones potenciales de la AEPD (hasta 30.000 €)     | Banner de cookies conforme + política de privacidad actualizada        |
| 23  | Sin política de privacidad ni aviso legal visibles | Incumplimiento LSSI-CE                                | Páginas legales redactadas y enlazadas en footer                       |
| 24  | Sin accesibilidad (WCAG)                           | Excluye a usuarios con discapacidad, penalización SEO | Cumplimiento **WCAG 2.2 AA** (contraste, navegación por teclado, ARIA) |

---

## 2. Propuesta económica - Desarrollo

### 2.1. Desglose por fases

| Fase | Actividad                                                             | Duración   | Importe     |
| ---- | --------------------------------------------------------------------- | ---------- | ----------- |
| 1    | Auditoría técnica, extracción de contenido y optimización de imágenes | 1 sem.     | **600 €**   |
| 2    | Configuración del stack (Astro 5 + Tailwind v4 + GitHub)              | 1 sem.     | **800 €**   |
| 3    | Maquetación, UX/UI y componentes interactivos                         | 2 sem.     | **1.800 €** |
| 4    | SEO B2B, Schema.org JSON-LD, FAQs y metadatos                         | 1 sem.     | **700 €**   |
| 5    | Migración, redirecciones 301, DNS y lanzamiento                       | 1 sem.     | **600 €**   |
|      | **TOTAL DESARROLLO (pago único)**                                     | **6 sem.** | **4.500 €** |

### 2.2. Forma de pago propuesta

- **40 % al inicio** (1.800 €) - firma de propuesta
- **30 % a mitad** (1.350 €) - fin de Fase 3
- **30 % final** (1.350 €) - entrega y puesta en producción

---

## 3. Propuesta económica - Mantenimiento mensual

### 3.1. Plan Mantenimiento Profesional - **300 € / mes**

Una web moderna **no es un producto, es un servicio vivo**. Sin mantenimiento, en 12 meses pierde rendimiento, posicionamiento y seguridad. Este plan garantiza que la inversión inicial de 4.500 € siga generando valor año tras año.

#### ✅ Incluido en la cuota mensual

| Categoría           | Servicio                                                           | Valor de mercado |
| ------------------- | ------------------------------------------------------------------ | ---------------- |
| **Infraestructura** | Hosting CDN global (Cloudflare/Vercel) + dominio + SSL             | 35 €/mes         |
| **Infraestructura** | Backups automáticos diarios + versionado Git                       | 20 €/mes         |
| **Seguridad**       | Monitorización 24/7 de uptime y alertas                            | 25 €/mes         |
| **Seguridad**       | Actualizaciones de dependencias y parches de seguridad             | 30 €/mes         |
| **Rendimiento**     | Auditoría Lighthouse mensual y optimización continua               | 40 €/mes         |
| **SEO**             | Monitorización de posicionamiento (Google Search Console)          | 35 €/mes         |
| **SEO**             | Ajustes de keywords, metadatos y Schema según evolución            | 40 €/mes         |
| **Contenido**       | Hasta **2 h/mes** de cambios: nuevas grúas, fotos, textos, ofertas | 60 €/mes         |
| **Analítica**       | Informe mensual de tráfico, conversiones y recomendaciones         | 30 €/mes         |
| **Soporte**         | Email y WhatsApp con respuesta en < 24 h laborables                | 35 €/mes         |
|                     | **Valor real del servicio**                                        | **350 €/mes**    |
|                     | **Precio cliente**                                                 | **300 €/mes**    |

#### 🎯 Compromiso de servicio (SLA)

- **Uptime garantizado:** 99,9 % anual
- **Tiempo de respuesta:** < 24 h laborables
- **Resolución de incidencias críticas:** < 4 h
- **Informe mensual:** primer lunes de cada mes
- **Sin permanencia** tras los primeros 12 meses

### 3.2. ¿Por qué 300 €/mes está justificado?

1. **Coste de no mantenerlo:** una caída de 1 día puede suponer la pérdida de un contrato de obra de **10.000-50.000 €**.
2. **Coste de un técnico interno:** un desarrollador junior cuesta **2.500-3.000 €/mes**. Por 300 € se externaliza toda la responsabilidad.
3. **Coste comparativo:** las agencias del sector cobran entre **400 € y 800 €/mes** por servicios equivalentes.
4. **ROI directo:** captar **1 solo cliente B2B adicional al año** gracias al mantenimiento SEO cubre los 3.600 € anuales.
5. **Tranquilidad:** cero gestión técnica para Grúas del Vallès, foco 100 % en la operativa de elevación.

### 3.3. Resumen económico anual

| Concepto                        | Año 1       | Año 2 en adelante |
| ------------------------------- | ----------- | ----------------- |
| Desarrollo inicial (pago único) | 4.500 €     | -                 |
| Mantenimiento (12 × 300 €)      | 3.600 €     | 3.600 €           |
| **TOTAL**                       | **8.100 €** | **3.600 €/año**   |

---

## 4. Servicios opcionales (fuera de cuota)

| Servicio                                                                | Precio         |
| ----------------------------------------------------------------------- | -------------- |
| Campaña Google Ads (gestión mensual, sin contar inversión publicitaria) | 250 €/mes      |
| Sesión fotográfica profesional de flota y maniobras (1 día)             | 600 €          |
| Vídeo corporativo 60 s para hero de la web                              | 900 €          |
| Traducción al inglés (página completa + SEO internacional)              | 750 €          |
| Integración CRM (HubSpot / Pipedrive) con formularios                   | 400 €          |
| Blog técnico SEO (1 artículo/mes optimizado)                            | 150 €/artículo |

---

*Documento preparado para Grúas del Vallès S.A. - Válido durante 30 días desde la fecha de emisión.*
