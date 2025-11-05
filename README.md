Proyecto fullstack para gestión de inventario con autenticación JWT, reportes automáticos y actualizaciones en tiempo real (Socket.IO).

## Tecnologías
- Backend: Node.js + Express + Mongoose
- Frontend: Angular (opcional)
- Socket.IO para tiempo real
- MongoDB
- Docker & docker-compose
- Postman para pruebas

## Levantar local (sin Docker)
1. Backend
```bash
cd FULLSTACK/backend
npm install
cp .env.sample .env
# editar .env con valores reales
npm run dev