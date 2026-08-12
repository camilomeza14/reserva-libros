import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UsuarioAttributes {
  id: number;
  nombre: string;
  email: string;
}

// Al crear, el id es opcional (lo genera la BD).
interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 'id'> {}

class Usuario
  extends Model<UsuarioAttributes, UsuarioCreationAttributes>
  implements UsuarioAttributes
{
  public id!: number;
  public nombre!: string;
  public email!: string;
}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
  },
  {
    sequelize,
    tableName: 'usuarios',
    timestamps: true,
  }
);

export default Usuario;
