import { Request, Response } from 'express';
import { Libro } from '../models';

// Crear un libro
export const crear = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { titulo, autor, disponible } = req.body;
    if (!titulo || !autor) {
      return res.status(400).json({ error: 'titulo y autor son obligatorios.' });
    }
    const libro = await Libro.create({ titulo, autor, disponible });
    return res.status(201).json(libro);
  } catch (err) {
    return res.status(500).json({ error: 'Error al crear el libro.', detalle: (err as Error).message });
  }
};

// Listar todos los libros
export const listar = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const libros = await Libro.findAll({ order: [['id', 'ASC']] });
    return res.json(libros);
  } catch (err) {
    return res.status(500).json({ error: 'Error al listar los libros.', detalle: (err as Error).message });
  }
};

// Obtener un libro por ID
export const obtener = async (req: Request, res: Response): Promise<Response> => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado.' });
    }
    return res.json(libro);
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener el libro.', detalle: (err as Error).message });
  }
};

// Actualizar un libro
export const actualizar = async (req: Request, res: Response): Promise<Response> => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado.' });
    }
    const { titulo, autor, disponible } = req.body;
    await libro.update({
      titulo: titulo ?? libro.titulo,
      autor: autor ?? libro.autor,
      disponible: disponible ?? libro.disponible,
    });
    return res.json(libro);
  } catch (err) {
    return res.status(500).json({ error: 'Error al actualizar el libro.', detalle: (err as Error).message });
  }
};

// Eliminar un libro
export const eliminar = async (req: Request, res: Response): Promise<Response> => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado.' });
    }
    await libro.destroy();
    return res.json({ mensaje: 'Libro eliminado correctamente.' });
  } catch (err) {
    return res.status(500).json({ error: 'Error al eliminar el libro.', detalle: (err as Error).message });
  }
};
