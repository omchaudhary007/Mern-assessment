import mongoose from "mongoose";
import bcrypt from "bcrypt";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Email is required'],
    },
    mobile: {
      type: Number,
      minlength: 10,
      required: [true, 'Mobile number is required'],
    },
    designation: {
      type: String,
      enum: ['hr', 'manager', 'sales'],
      required: [true, 'Designation is required'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'others'],
      default: 'others',
    },
    course: {
      type: String,
    },
    image: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const employee=mongoose.model("Employee", employeeSchema);
export default employee;
