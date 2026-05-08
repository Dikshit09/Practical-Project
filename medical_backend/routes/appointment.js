// routes/appointment.js
import express from 'express';
import {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getSingleAppointment,
  getAllAppointments,
} from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/', createAppointment);
router.put('/update/:id', updateAppointment);
router.delete('/delete/:id', deleteAppointment);
router.get('/getById/:id', getSingleAppointment);
router.get('/getAll', getAllAppointments);

export default router;