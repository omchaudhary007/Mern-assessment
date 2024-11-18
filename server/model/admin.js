import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

const adminSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      lowercase:true,
      unique:true,
      required: [true, 'User name is required'],
    },
    password: {
      type: String,
      minlength: [6, 'Password length should be at least 6.'],
      required: [true, 'Password is required'],
    },
  },
  { timestamps: true }
);

// Method to compare passwords
adminSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// Method to generate JWT token
adminSchema.methods.generateToken = function () {
  return JWT.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
