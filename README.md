# Gamers Needs

## Requisitos
- Docker
- Docker Compose
- Node.js 18+

## Instalación

1. Clonar el repositorio
```bash
git clone https://github.com/USERNAME/REPO.git
cd gamerneeds
```

2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus valores
```

3. Iniciar con Docker Compose
```bash
docker-compose up -d
```

## Desarrollo

Para desarrollo local:

1. Backend:
```bash
cd Backend
npm install
npm run dev
```

2. Frontend:
```bash
cd Frontend
npm install
npm run dev
```

## Producción

Para desplegar en producción:

```bash
docker-compose -f docker-compose.yml up -d
```

## Estructura del Proyecto

- `/Backend`: API REST con Node.js
- `/Frontend`: Cliente React con Vite
- `/docker-compose.yml`: Configuración de contenedores
