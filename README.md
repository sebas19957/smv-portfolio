# Portafolio SMV (Sebastián Mosquera Valencia)

<p align="center">
  <a href="#" target="blank"><img src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/imgs/logo.png" width="400" alt="Nest Logo" /></a>
</p>

## Descripción

Este es mi portafolio personal, una landing page que muestra mi trayectoria profesional y académica como Ingeniero de Sistemas y desarrollador Front-end. El sitio está diseñado para resaltar mis habilidades, experiencia laboral, proyectos destacados y testimonios de colegas. Incluye secciones como Sobre Mí, Habilidades, Resumen, Proyectos, Testimonios y Contacto, ofreciendo una visión completa de mi perfil profesional.

## 🛠️ Tecnologías utilizadas

- **Frontend:**
  - Framework: [Next.js](https://nextjs.org/) (React) con TypeScript.
  - Estilos: [Tailwind CSS](https://tailwindcss.com/) y [Shadcn](https://ui.shadcn.com/).
- **Estado y datos:**
  - Consumo de API: [Redis](https://console.upstash.com/).
- **Almacenamiento de recursos:** Integración con [AWS S3](https://aws.amazon.com/s3/) para la carga y gestión de archivos multimedia.
- **Optimización:** Implementación de carga diferida de imágenes y uso de `srcset` para mejorar el rendimiento.

## Instalación Dependencias

Ejecuta el siguiente comando en la terminal ubicado en la carpeta del proyecto.

```bash
$ yarn install
```

## Configuración

Se debe renombrar el archivo `.env.template` a `.env.development` para desarrollo y `.env.production` para producccion, y llenar las variables de entorno que están vacías en el archivo, para el correcto funcionamiento de este proyecto.

## Compilar y ejecutar el proyecto

```bash
# Desarrollo
$ yarn dev
```

```bash
# Crear Build para producción
$ yarn build
```

```bash
# Producción
$ yarn start
```
