import express, { Request, Response } from 'express';
import cors from 'cors';
import libroRoutes from './routes/libro.routes';
import reservaRoutes from './routes/reserva.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({ mensaje: 'API Reservas de Libros - HU-001' });
});

app.use('/libros', libroRoutes);
app.use('/reservas', reservaRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

export default app;
