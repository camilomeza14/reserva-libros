import dotenv from 'dotenv';
import app from './app';
import { sequelize } from './models';

dotenv.config();

const PORT = process.env.PORT || 3001;

async function iniciar(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida.');

    // sync crea/actualiza las tablas. En producción usar migraciones.
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados.');

    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  } catch (err) {
    console.error('No se pudo iniciar el servidor:', (err as Error).message);
    process.exit(1);
  }
}

iniciar();
