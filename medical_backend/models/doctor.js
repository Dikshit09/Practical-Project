import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    description: {
        type: String,
        required: true,
      },
  },
  { timestamps: true }
);

const Doctor =  mongoose.model('Doctor', doctorSchema);
export default Doctor;
