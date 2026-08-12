import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type EstadoReserva = 'pendiente' | 'completada' | 'cancelada';

interface ReservaAttributes {
  id: number;
  estado: EstadoReserva;
  usuarioId: number;
  libroId: number;
}

// id y estado son opcionales al crear (id lo genera la BD,
// estado tiene valor por defecto 'pendiente').
interface ReservaCreationAttributes
  extends Optional<ReservaAttributes, 'id' | 'estado'> {}

class Reserva
  extends Model<ReservaAttributes, ReservaCreationAttributes>
  implements ReservaAttributes
{
  public id!: number;
  public estado!: EstadoReserva;
  public usuarioId!: number;
  public libroId!: number;
}

Reserva.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'completada', 'cancelada'),
      allowNull: false,
      defaultValue: 'pendiente',
    },
    // usuarioId y libroId se completan por las asociaciones (index.ts).
    // Al haber un solo libroId por reserva, "un libro por reserva"
    // queda garantizado por el modelo.
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    libroId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'reservas',
    timestamps: true,
  }
);

export default Reserva;
