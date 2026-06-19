# Despliegue: GitHub Container Registry (GHCR) + VPS con Dokploy

Esta guía explica **paso a paso** cómo:

1. Hacer que GitHub construya y publique automáticamente la imagen Docker de tu
   portafolio en **GHCR** (GitHub Container Registry).
2. Desplegar esa imagen en tu **VPS usando Dokploy**.

> **Datos de tu proyecto** (ya configurados, no tienes que cambiarlos):
> - Repositorio: `github.com/sebas19957/smv-portfolio`
> - Imagen publicada: `ghcr.io/sebas19957/smv-portfolio`
> - Puerto interno del contenedor: `3000`
> - Variables de entorno que necesita en runtime: `EMAIL_USER`, `EMAIL_PASS`,
>   `EMAIL_RECEIVER`, `REDIS_URL`

---

## Parte 1 — Cómo se crea la imagen en GitHub (GHCR)

### ¿Qué es GHCR?

GHCR es el registro de contenedores de GitHub. Es como Docker Hub, pero integrado
en tu repositorio. Las imágenes quedan en:

```
ghcr.io/sebas19957/smv-portfolio
```

### ¿Cuándo se construye la imagen? (Aquí está el "dónde hacer el pull")

El workflow [.github/workflows/docker-publish.yml](../.github/workflows/docker-publish.yml)
se dispara **automáticamente** en dos casos:

| Evento en GitHub                    | Imagen que se publica                              |
| ----------------------------------- | ------------------------------------------------- |
| **Push / merge a la rama `main`**   | `ghcr.io/sebas19957/smv-portfolio:latest` y `:sha-<commit>` |
| **Push de un tag `vX.Y.Z`**         | `:X.Y.Z`, `:X.Y` y `:latest`                       |

> ⚠️ **Importante:** la rama de trabajo `dev` y `feat/*` **NO** construyen imagen
> (solo corren lint + build de verificación). La imagen para producción solo se
> crea cuando el código llega a **`main`**.

**Entonces, "dónde hacer el pull para que se cree la imagen":**
debes integrar tu trabajo a la rama `main` del repositorio. En cuanto un commit
llega a `main`, GitHub Actions construye la imagen y la sube a GHCR. El flujo
recomendado es:

1. Trabajas en `dev` (o ramas `feat/*`).
2. Abres un **Pull Request** de `dev` → `main` en GitHub.
3. Haces **merge** del PR a `main`.
4. Eso dispara el workflow → la imagen aparece en GHCR.

> Para una versión etiquetada (ej. `v1.0.0`):
> ```bash
> git checkout main && git pull
> git tag v1.0.0
> git push origin v1.0.0
> ```
> Esto publica `:1.0.0`, `:1.0` y mueve `:latest`.

### Paso 1.1 — Ver la construcción en marcha

1. Ve a tu repo en GitHub → pestaña **Actions**.
2. Verás el workflow **"Build and Publish Docker Image"** ejecutándose.
3. Cuando termine en verde, la imagen ya está publicada.

### Paso 1.2 — Confirmar que la imagen existe

En GitHub, ve a tu perfil/repositorio → **Packages** (o directamente
`https://github.com/sebas19957?tab=packages`). Verás el paquete
`smv-portfolio` con sus tags (`latest`, etc.).

### Paso 1.3 — Hacer la imagen accesible para el VPS

Por defecto, los packages de GHCR son **privados**. Tienes dos opciones:

- **Opción A (más simple): hacer el package público.**
  GitHub → Packages → `smv-portfolio` → **Package settings** → **Change visibility**
  → **Public**. Así el VPS puede hacer `pull` sin autenticarse.

- **Opción B (privado, recomendado para producción): usar un token.**
  Crea un **Personal Access Token (classic)** en GitHub:
  - Settings → Developer settings → Personal access tokens → Tokens (classic)
    → Generate new token.
  - Marca el scope **`read:packages`**.
  - Guárdalo (lo usarás en Dokploy para autenticar el registro).

---

## Parte 2 — Desplegar en el VPS con Dokploy

Dokploy es un panel (tipo PaaS self-hosted) que corre en tu VPS y despliega
aplicaciones desde imágenes Docker. Vamos a desplegar la imagen de GHCR.

### Requisitos previos

- Tener **Dokploy ya instalado** en tu VPS. Si no lo tienes:
  ```bash
  curl -sSL https://dokploy.com/install.sh | sh
  ```
  Luego entra al panel en `http://IP_DE_TU_VPS:3000`.
- Tener a mano tus valores reales de `EMAIL_USER`, `EMAIL_PASS`,
  `EMAIL_RECEIVER` y `REDIS_URL`.

### Paso 2.1 — (Solo si el package es privado) Registrar GHCR en Dokploy

Si elegiste la **Opción B** (package privado):

1. En Dokploy, ve a **Settings → Registry** (o **Docker Registries**).
2. Añade un registro nuevo:
   - **Registry URL:** `ghcr.io`
   - **Username:** `sebas19957`
   - **Password:** el Personal Access Token con `read:packages`.
3. Guarda. Dokploy ya podrá hacer pull de tu imagen privada.

> Si hiciste el package **público** (Opción A), puedes saltarte este paso.

### Paso 2.2 — Crear el proyecto y la aplicación

1. En el panel de Dokploy, crea un **Project** (ej. `portfolio`).
2. Dentro del proyecto, crea una **Application**.
3. En el tipo/fuente de la aplicación, elige **Docker** (desplegar desde una
   imagen existente, **no** desde código fuente).
4. En **Docker Image**, escribe:
   ```
   ghcr.io/sebas19957/smv-portfolio:latest
   ```
5. Si usaste registro privado, selecciona el registro `ghcr.io` que creaste en
   el paso 2.1.

### Paso 2.3 — Configurar el puerto

La aplicación escucha internamente en el puerto **3000**.

- En la configuración de la app (sección **Ports / Networking**), indica que el
  puerto interno del contenedor es **`3000`**.
- Dokploy se encarga del proxy hacia ese puerto (no necesitas exponer 3000 al
  exterior manualmente; el dominio lo enruta).

### Paso 2.4 — Configurar las variables de entorno (¡clave!)

Las credenciales **NO** están dentro de la imagen (por seguridad). Debes
pasarlas como variables de entorno en Dokploy.

En la app → **Environment** (Variables de entorno), añade:

```
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASS=tu-app-password-de-gmail
EMAIL_RECEIVER=correo-donde-recibes-los-mensajes@ejemplo.com
REDIS_URL=redis://default:password@host-redis:6379
```

> - `EMAIL_PASS` debe ser una **App Password de Gmail** (no tu contraseña
>   normal). Se genera en la configuración de seguridad de tu cuenta Google con
>   verificación en 2 pasos activa.
> - `REDIS_URL` es la cadena de conexión a tu Redis (ej. de Upstash o un Redis
>   que levantes en el mismo VPS). El formulario de contacto la usa para limitar
>   los intentos por IP.

### Paso 2.5 — Configurar el dominio

1. En la app → **Domains**, añade tu dominio (ej. `sebastianmv.dev` o
   `www.sebastianmv.dev`).
2. Apunta el DNS de tu dominio (registro **A**) a la **IP de tu VPS**.
3. Activa **HTTPS / SSL (Let's Encrypt)** en Dokploy — lo hace automático.

### Paso 2.6 — Desplegar

1. Pulsa **Deploy**.
2. Dokploy hace `pull` de `ghcr.io/sebas19957/smv-portfolio:latest`, levanta el
   contenedor y lo conecta al dominio.
3. Revisa los **Logs** en Dokploy. Deberías ver:
   ```
   ▲ Next.js 15.1.6
   - Network: http://0.0.0.0:3000
   ✓ Ready in ...ms
   ```
4. Abre tu dominio en el navegador → el portafolio debe cargar. 🎉

---

## Parte 3 — Actualizaciones futuras (el ciclo completo)

Cada vez que quieras publicar cambios:

```text
1. Trabajas en dev / feat/*  ──>  2. PR a main  ──>  3. Merge a main
                                                          │
                                                          ▼
                          GitHub Actions construye y sube la imagen a GHCR
                                                          │
                                                          ▼
                              4. En Dokploy, "Redeploy" la app
                                 (descarga el nuevo :latest)
```

### Redeploy manual

En Dokploy → tu app → botón **Redeploy**. Vuelve a hacer pull de `:latest` y
reinicia el contenedor con la nueva versión.

### Redeploy automático (opcional, recomendado)

Dokploy soporta **Webhooks de despliegue automático**:

1. En la app → **Deployments / Auto Deploy**, copia la **URL del webhook** que
   te da Dokploy.
2. En GitHub: repo → **Settings → Webhooks → Add webhook**, pega esa URL.

   Alternativa más directa: en
   [.github/workflows/docker-publish.yml](../.github/workflows/docker-publish.yml)
   puedes añadir un paso final que haga `curl` a esa URL del webhook tras
   publicar la imagen, para que Dokploy se actualice solo. (Si quieres, puedo
   agregarte ese paso.)

Con eso, cada merge a `main` → nueva imagen → Dokploy se actualiza solo.

---

## Resumen rápido (TL;DR)

| Quiero...                         | Hago...                                                        |
| --------------------------------- | ------------------------------------------------------------- |
| Que se cree la imagen             | Merge a la rama **`main`** (o push de un tag `vX.Y.Z`)        |
| Ver la imagen                     | GitHub → **Packages** → `smv-portfolio`                       |
| Desplegar en el VPS               | Dokploy → App tipo Docker → `ghcr.io/sebas19957/smv-portfolio:latest` |
| Que arranque bien                 | Puerto **3000** + variables `EMAIL_*` y `REDIS_URL`           |
| Publicar cambios nuevos           | Merge a `main` → **Redeploy** en Dokploy                      |

---

## Solución de problemas

- **Dokploy no puede hacer pull (`denied` / `unauthorized`):** el package es
  privado y falta autenticar. Haz el package público (Parte 1, Opción A) o
  registra GHCR con un token `read:packages` (Paso 2.1).
- **La app arranca pero el formulario de contacto da error 500:** falta o está
  mal `REDIS_URL`. El home funciona sin Redis, pero el envío de correo lo
  necesita. Revisa la variable en Dokploy.
- **El correo no se envía:** revisa `EMAIL_USER` / `EMAIL_PASS`. Recuerda que
  `EMAIL_PASS` debe ser una **App Password** de Gmail, no la contraseña normal.
- **El dominio no carga:** confirma que el DNS (registro A) apunta a la IP del
  VPS y que el puerto configurado en Dokploy es **3000**.
