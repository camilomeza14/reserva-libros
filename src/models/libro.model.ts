import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface LibroAttributes {
  id: number;
  titulo: string;
  autor: string;
  disponible: boolean;
}

// id y disponible son opcionales al crear (id lo genera la BD,
// disponible tiene valor por defecto).
interface LibroCreationAttributes
  extends Optional<LibroAttributes, 'id' | 'disponible'> {}

class Libro
  extends Model<LibroAttributes, LibroCreationAttributes>
  implements LibroAttributes
{
  public id!: number;
  public titulo!: string;
  public autor!: string;
  public disponible!: boolean;
}

Libro.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Control de disponibilidad: evita que dos usuarios reserven el mismo libro.
    disponible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'libros',
    timestamps: true,
  }
);

export default Libro;
