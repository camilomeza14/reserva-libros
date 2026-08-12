import { Router } from 'express';
import * as ctrl from '../controllers/reserva.controller';

const router = Router();

router.post('/', ctrl.reservar);
router.post('/devolucion', ctrl.devolver);

export default router;
