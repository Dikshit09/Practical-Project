import nodemailer from 'nodemailer';
import User from '../models/User.js'; 
import Appointment from '../models/apointment.js'; 
import Doctor from '../models/doctor.js';
import dotenv from 'dotenv';

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
      from: 'armanansarizzzz66@gmail.com',
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

// Create new Appointment
export const createAppointment = async (req, res) => {
  const { doctor, user, ...appointmentData } = req.body;

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  if (!doctor) {
    return res.status(400).json({
      success: false,
      message: "Doctor ID is required",
    });
  }

  try {
    const foundUser = await User.findById(user);
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const foundDoctor = await Doctor.findById(doctor);
    if (!foundDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const newAppointment = new Appointment({ doctor, user, ...appointmentData });
    const savedAppointment = await newAppointment.save();

    // ✅ User ko email
    const userSubject = 'Appointment Scheduled';
    const userText = `Hello ${foundUser.name},\n\nYour appointment with Dr. ${foundDoctor.name} has been scheduled successfully for ${appointmentData.firstName} ${appointmentData.lastName} on ${appointmentData.appointmentDate}.\n\nThank you.`;
    await sendEmail(foundUser.email, userSubject, userText);

    // ✅ Aapko email - dikshitchoudhary09@gmail.com
    const adminSubject = '🏥 New Appointment Booked!';
    const adminText = `New Appointment Details:\n
Patient Name: ${appointmentData.firstName} ${appointmentData.lastName}
Patient Email: ${appointmentData.email}
Patient Phone: ${appointmentData.phoneNumber}
Doctor: ${foundDoctor.name}
Appointment Date: ${appointmentData.appointmentDate}
Message: ${appointmentData.message}
Booked By: ${foundUser.name} (${foundUser.email})`;
    await sendEmail('dikshitchoudhary09@gmail.com', adminSubject, adminText);

    res.status(200).json({
      success: true,
      message: "Appointment created successfully",
      data: savedAppointment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create appointment. Try again",
    });
  }
};

// Update Appointment
export const updateAppointment = async (req, res) => {
  const id = req.params.id;
  const { doctor, user, ...appointmentData } = req.body;

  try {
    if (user) {
      const foundUser = await User.findById(user);
      if (!foundUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    }

    if (!doctor) {
      const foundUser = await User.findById(user);
      if (!foundUser) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: { doctor, user, ...appointmentData } },
      { new: true }
    ).populate("user").populate("doctor");

    res.status(200).json({
      success: true,
      message: "Successfully updated appointment",
      data: updatedAppointment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update appointment.",
    });
  }
};

// Delete Appointment
export const deleteAppointment = async (req, res) => {
  const id = req.params.id;
  try {
    await Appointment.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Successfully deleted appointment",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete appointment.",
    });
  }
};

// Get Single Appointment
export const getSingleAppointment = async (req, res) => {
  const id = req.params.id;
  try {
    const appointment = await Appointment.findById(id).populate("user");
    res.status(200).json({
      success: true,
      message: "Successfully retrieved appointment",
      data: appointment,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Appointment not found",
    });
  }
};

// Get All Appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({}).populate("doctor").populate("user");
    res.status(200).json({
      success: true,
      message: "Successfully retrieved all appointments",
      data: appointments,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Appointments not found",
    });
  }
};