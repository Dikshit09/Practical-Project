
// import MedicineSchedule from '../models/medicineSchedule.js';


// // Function to send email using nodemailer
// const sendEmail = async (to, subject, text) => {
//   try {
//     let transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD,
//       },
//     });

//     let mailOptions = {
//       from: process.env.EMAIL,
//       to: to,
//       subject: subject,
//       text: text,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Email sent:', mailOptions);
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw new Error('Failed to send email');
//   }
// };

// // Function to check schedules and send emails
// const checkSchedules = async () => {
//   try {
//     const currentTime = new Date();
//     const formattedTime = `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`;

//     const schedules = await MedicineSchedule.find().populate('user');
//     schedules.forEach(async (schedule) => {
//       if (schedule.scheduleTimes.includes(formattedTime)) {
//         const subject = 'Medicine Reminder';
//         const text = `Hello ${schedule.user.name},\n\nThis is a reminder to take your medicine: ${schedule.medicineName}.\n\nDosage: ${schedule.dosage}\nAmount per Dose: ${schedule.amountPerDose}\n\nThank you.`;
//         await sendEmail(schedule.user.email, subject, text);
//       }
//     });
//   } catch (error) {
//     console.error('Error checking schedules:', error);
//   }
// };

// // Schedule the check every minute
// cron.schedule('* * * * *', checkSchedules);


// // Create a new medicine schedule
// export const createMedicineSchedule = async (req, res) => {
//   console.log(req.body)
//   try {
//     const {
//       user,
//       medicineName,
//       dosage,
//       timesPerDay,
//       amountPerDose,
//       startDate,
//       endDate,
//       scheduleTimes,
//       doctor,
//       notes,
//     } = req.body;

//     const newMedicineSchedule = new MedicineSchedule({
//       user,
//       medicineName,
//       dosage,
//       timesPerDay,
//       amountPerDose,
//       startDate,
//       endDate,
//       scheduleTimes,
//       doctor,
//       notes,
//     });

//     const savedMedicineSchedule = await newMedicineSchedule.save();
//     res.status(201).json(savedMedicineSchedule);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Get all medicine schedules
// export const getAllMedicineSchedules = async (req, res) => {
//   try {
//     const medicineSchedules = await MedicineSchedule.find().populate('doctor').populate('user');
//     res.json(medicineSchedules);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get a single medicine schedule by ID
// export const getMedicineScheduleById = async (req, res) => {
//   try {
//     const medicineSchedule = await MedicineSchedule.findById(req.params.id).populate('doctor');
//     if (!medicineSchedule) {
//       return res.status(404).json({ message: 'Medicine schedule not found' });
//     }
//     res.json(medicineSchedule);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update a medicine schedule by ID
// export const updateMedicineScheduleById = async (req, res) => {
//   try {
//     const {
//       medicineName,
//       dosage,
//       timesPerDay,
//       amountPerDose,
//       startDate,
//       endDate,
//       scheduleTimes,
//       doctor,
//       notes,
//     } = req.body;

//     const updatedMedicineSchedule = await MedicineSchedule.findByIdAndUpdate(
//       req.params.id,
//       {
//         medicineName,
//         dosage,
//         timesPerDay,
//         amountPerDose,
//         startDate,
//         endDate,
//         scheduleTimes,
//         doctor,
//         notes,
//       },
//       { new: true }
//     );

//     if (!updatedMedicineSchedule) {
//       return res.status(404).json({ message: 'Medicine schedule not found' });
//     }

//     res.json(updatedMedicineSchedule);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete a medicine schedule by ID
// export const deleteMedicineScheduleById = async (req, res) => {
//   try {
//     const deletedMedicineSchedule = await MedicineSchedule.findByIdAndDelete(req.params.id);
//     if (!deletedMedicineSchedule) {
//       return res.status(404).json({ message: 'Medicine schedule not found' });
//     }
//     res.json({ message: 'Medicine schedule deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };















import cron from 'node-cron';
import nodemailer from 'nodemailer';
import MedicineSchedule from '../models/medicineSchedule.js';
import User from '../models/User.js';

// Function to send email using nodemailer
const sendEmail = async (to, subject, text) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'armanansarizzzz66@gmail.com',
        pass: 'wccj btzj amnk zbyh',
      },
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent:', mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

// Function to check schedules and send emails
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

// Schedule the check every minute
cron.schedule('* * * * *', checkSchedules);

// Create a new medicine schedule
export const createMedicineSchedule = async (req, res) => {
  console.log(req.body);
  try {
    const {
      user,
      medicineName,
      dosage,
      timesPerDay,
      amountPerDose,
      startDate,
      endDate,
      scheduleTimes,
      doctor,
      notes,
    } = req.body;

    const newMedicineSchedule = new MedicineSchedule({
      user,
      medicineName,
      dosage,
      timesPerDay,
      amountPerDose,
      startDate,
      endDate,
      scheduleTimes,
      doctor,
      notes,
    });

    const savedMedicineSchedule = await newMedicineSchedule.save();
    res.status(201).json(savedMedicineSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all medicine schedules
export const getAllMedicineSchedules = async (req, res) => {
  try {
    const medicineSchedules = await MedicineSchedule.find().populate('doctor').populate('user');
    res.json(medicineSchedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single medicine schedule by ID
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

// Update a medicine schedule by ID
export const updateMedicineScheduleById = async (req, res) => {
  try {
    const {
      medicineName,
      dosage,
      timesPerDay,
      amountPerDose,
      startDate,
      endDate,
      scheduleTimes,
      doctor,
      notes,
    } = req.body;

    const updatedMedicineSchedule = await MedicineSchedule.findByIdAndUpdate(
      req.params.id,
      {
        medicineName,
        dosage,
        timesPerDay,
        amountPerDose,
        startDate,
        endDate,
        scheduleTimes,
        doctor,
        notes,
      },
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

// Delete a medicine schedule by ID
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
