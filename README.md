# API de Reservas de Libros (HU-001) — TypeScript

CRUD de Libros + reserva y devolución, con **TypeScript, Express, Sequelize y PostgreSQL**.

## Requisitos

- Node.js 18+
- PostgreSQL en ejecución (por ejemplo, en Docker)

## Instalación

```bash
npm install
cp .env.example .env   # ajusta credenciales de PostgreSQL
npm run dev            # arranca con ts-node + nodemon
```

Al arrancar, Sequelize crea/actualiza las tablas automáticamente.

## Scripts

- `npm run dev` — modo desarrollo (ts-node, recarga con nodemon).
- `npm run build` — compila TypeScript a JavaScript en `dist/`.
- `npm start` — ejecuta la versión compilada (requiere `build` previo).

## Modelo de datos

- **Usuario** (1) —— (N) **Reserva** (N) —— (1) **Libro**
- Cada `Reserva` tiene un `libroId` y un `usuarioId` únicos → "un libro por reserva" garantizado por el modelo.
- `Libro.disponible` (boolean) impide reservar dos veces el mismo libro.

Estados de reserva: `pendiente` → `completada` (devuelto) | `cancelada`.

## Endpoints

### Libros

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/libros` | Crear. Body: `{ titulo, autor, disponible? }` |
| GET | `/libros` | Listar todos |
| GET | `/libros/:id` | Obtener por ID |
| PUT | `/libros/:id` | Actualizar |
| DELETE | `/libros/:id` | Eliminar |

### Reservas

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/reservas` | Reservar. Body: `{ usuarioId, libroId }` |
| POST | `/reservas/devolucion` | Devolver. Body: `{ reservaId }` o `{ usuarioId, libroId }` |

## Validaciones

| Criterio | Regla | Respuesta al fallar |
|---|---|---|
| 3 | Un libro por reserva | Garantizado por el modelo |
| 4 | El libro debe existir | 404 |
| — | El libro debe estar disponible | 409 |
| 5 | Sin reserva pendiente previa | 409 |
| 6 | Devolución requiere reserva pendiente | 404 |

Reserva y devolución corren en una transacción con bloqueo de fila (`FOR UPDATE`)
para evitar condiciones de carrera bajo peticiones concurrentes.

## Usuario de prueba

El CRUD de Usuarios no es parte de esta historia. Inserta uno para probar:

```sql
INSERT INTO usuarios (nombre, email, "createdAt", "updatedAt")
VALUES ('Ana', 'ana@test.com', NOW(), NOW());
```
