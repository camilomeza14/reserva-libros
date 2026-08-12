import { Request, Response } from 'express';
import { sequelize, Usuario, Libro, Reserva } from '../models';

// POST /reservas — reserva un libro para un usuario, con validaciones dentro
// de una transacción con bloqueo de fila para evitar condiciones de carrera.
export const reservar = async (req: Request, res: Response): Promise<Response> => {
  const { usuarioId, libroId } = req.body;

  if (!usuarioId || !libroId) {
    return res.status(400).json({ error: 'usuarioId y libroId son obligatorios.' });
  }

  const t = await sequelize.transaction();
  try {
    const usuario = await Usuario.findByPk(usuarioId, { transaction: t });
    if (!usuario) {
      await t.rollback();
      return res.status(404).json({ error: 'El usuario no existe.' });
    }

    // Criterio 4: validar existencia del libro (con bloqueo FOR UPDATE).
    const libro = await Libro.findByPk(libroId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!libro) {
      await t.rollback();
      return res.status(404).json({ error: 'El libro no existe.' });
    }

    // Validación de disponibilidad: un libro no puede reservarse dos veces.
    if (!libro.disponible) {
      await t.rollback();
      return res.status(409).json({ error: 'El libro no está disponible.' });
    }

    // Criterio 5: el usuario no puede tener otra reserva pendiente.
    const reservaPendiente = await Reserva.findOne({
      where: { usuarioId, estado: 'pendiente' },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (reservaPendiente) {
      await t.rollback();
      return res.status(409).json({
        error: 'El usuario ya tiene una reserva pendiente. Debe completarla o cancelarla antes de reservar otro libro.',
      });
    }

    const reserva = await Reserva.create({ usuarioId, libroId, estado: 'pendiente' }, { transaction: t });
    await libro.update({ disponible: false }, { transaction: t });

    await t.commit();
    return res.status(201).json(reserva);
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ error: 'Error al crear la reserva.', detalle: (err as Error).message });
  }
};

// POST /reservas/devolucion — registra la devolución. Acepta reservaId,
// o bien usuarioId + libroId.
export const devolver = async (req: Request, res: Response): Promise<Response> => {
  const { reservaId, usuarioId, libroId } = req.body;

  if (!reservaId && !(usuarioId && libroId)) {
    return res.status(400).json({ error: 'Debe indicar reservaId, o bien usuarioId y libroId.' });
  }

  const t = await sequelize.transaction();
  try {
    const where = reservaId
      ? { id: reservaId, estado: 'pendiente' as const }
      : { usuarioId, libroId, estado: 'pendiente' as const };

    const reserva = await Reserva.findOne({ where, transaction: t, lock: t.LOCK.UPDATE });

    // Criterio 6: si no hay reserva pendiente, rechazar la devolución.
    if (!reserva) {
      await t.rollback();
      return res.status(404).json({ error: 'No existe una reserva pendiente asociada.' });
    }

    await reserva.update({ estado: 'completada' }, { transaction: t });
    await Libro.update({ disponible: true }, { where: { id: reserva.libroId }, transaction: t });

    await t.commit();
    return res.json({ mensaje: 'Devolución registrada. Reserva completada.', reserva });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ error: 'Error al registrar la devolución.', detalle: (err as Error).message });
  }
};
