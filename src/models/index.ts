import sequelize from '../config/database';
import Usuario from './usuario.model';
import Libro from './libro.model';
import Reserva from './reserva.model';

// Relaciones uno a muchos:
Usuario.hasMany(Reserva, { foreignKey: 'usuarioId', as: 'reservas' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

Libro.hasMany(Reserva, { foreignKey: 'libroId', as: 'reservas' });
Reserva.belongsTo(Libro, { foreignKey: 'libroId', as: 'libro' });

export { sequelize, Usuario, Libro, Reserva };
