import cron from 'node-cron';
import nodemailer from 'nodemailer';
import MedicineSchedule from '../models/medicineSchedule.js';
import User from '../models/User.js';

// ✅ Fixed - port 587
const sendEmail = async (to, subject, text) => {
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'armanansarizzzz66@gmail.com',
        pass: 'wccj btzj amnk zbyh',
      },
    });

    let mailOptions = {
      from: 'armanansarizzzz66@gmail.com',
      to: to,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

const checkSchedules = async () => {
  try {
    const currentTime = new Date();
    const formattedTime = `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`;

    const schedules = await MedicineSchedule.find().populate('user');
    schedules.forEach(async (schedule) => {
      if (schedule.scheduleTimes.includes(formattedTime)) {
        const subject = 'Medicine Reminder';
        const text = `Hello ${schedule.user.name},\n\nThis is a reminder to take your medicine: ${schedule.medicineName}.\n\nDosage: ${schedule.dosage}\nAmount per Dose: ${schedule.amountPerDose}\n\nThank you.`;
        await sendEmail(schedule.user.email, subject, text);
      }
    });
  } catch (error) {
    console.error('Error checking schedules:', error);
  }
};

cron.schedule('* * * * *', checkSchedules);

export const createMedicineSchedule = async (req, res) => {
  console.log(req.body);
  try {
    const { user, medicineName, dosage, timesPerDay, amountPerDose, startDate, endDate, scheduleTimes, doctor, notes } = req.body;

    const newMedicineSchedule = new MedicineSchedule({
      user, medicineName, dosage, timesPerDay, amountPerDose, startDate, endDate, scheduleTimes, doctor, notes,
    });

    const savedMedicineSchedule = await newMedicineSchedule.save();
    res.status(201).json(savedMedicineSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllMedicineSchedules = async (req, res) => {
  try {
    const medicineSchedules = await MedicineSchedule.find().populate('doctor').populate('user');
    res.json(medicineSchedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMedicineScheduleById = async (req, res) => {
  try {
    const medicineSchedule = await MedicineSchedule.findById(req.params.id).populate('doctor').populate('user');
    if (!medicineSchedule) {
      return res.status(404).json({ message: 'Medicine schedule not found' });
    }
    res.json(medicineSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMedicineScheduleById = async (req, res) => {
  try {
    const { medicineName, dosage, timesPerDay, amountPerDose, startDate, endDate, scheduleTimes, doctor, notes } = req.body;

    const updatedMedicineSchedule = await MedicineSchedule.findByIdAndUpdate(
      req.params.id,
      { medicineName, dosage, timesPerDay, amountPerDose, startDate, endDate, scheduleTimes, doctor, notes },
      { new: true }
    ).populate('doctor').populate('user');

    if (!updatedMedicineSchedule) {
      return res.status(404).json({ message: 'Medicine schedule not found' });
    }
    res.json(updatedMedicineSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMedicineScheduleById = async (req, res) => {
  try {
    const deletedMedicineSchedule = await MedicineSchedule.findByIdAndDelete(req.params.id);
    if (!deletedMedicineSchedule) {
      return res.status(404).json({ message: 'Medicine schedule not found' });
    }
    res.json({ message: 'Medicine schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};