import { emailValidator, mobileValidator } from "../services/validators.js";
import {
  uploadFileToCloudinary,
  deleteFromCloudinary,
} from "../services/cloudinaryServices.js";
import employee from "../model/employee.js";

export const createEmployee = async (req, res) => {
  try {
    const { name, email, mobile, designation, gender, course } = req.body;
    if (
      !name ||
      !email ||
      !mobile ||
      !designation ||
      !emailValidator(email) ||
      !mobileValidator(mobile)
    ) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required field in valid format.",
      });
    }
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "Profile Picture is required.",
      });
    }
    const isValidImage = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ].includes(req.file.mimetype);
    if (!isValidImage) {
      return res.status(400).send({
        success: false,
        message: "Image type is invalid.",
      });
    }
    const { public_id, url } = await uploadFileToCloudinary(
      req.file,
      "employee",
      "employeeImg"
    );
    const newEmployee = await employee.create({
      name,
      email,
      mobile,
      designation,
      gender,
      course,
      image: {
        url,
        public_id,
      },
    });
    return res.status(200).send({
      success: true,
      message: "Employee created successfully.",
      newEmployee,
    });
  } catch (error) {
    console.log(error);
    if (error.code == 11000) {
      return res.status(400).send({
        success: false,
        message: "Email already exists.",
      });
    }
    return res.status(501).send({
      success: false,
      message: "Error in create API",
    });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    const searchQuery = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const sortOptions = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const employees = await employee
      .find(searchQuery)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await employee.countDocuments(searchQuery);

    return res.status(200).send({
      success: true,
      message: "Employee fetched successfully.",
      total,
      employees,
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "Error in get employee API.",
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).send({
        success: false,
        message: "Please specify the employee to be updated.",
      });
    }
    const { name, email, mobile, designation, gender, course } = req.body;
    if (email && !emailValidator(email)) {
      return res.status(400).send({
        success: false,
        message: "Email is invalid",
      });
    }
    if (mobile && !mobileValidator(mobile)) {
      return res.status(400).send({
        success: false,
        message: "Mobile number is invalid",
      });
    }

    // updating specified fields
    let empData = await employee.findById({ _id });
    if (!empData) {
      return res.status(400).send({
        success: false,
        message: "Employee not exists",
      });
    }

    if (req.file) {
      const isValidImage = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ].includes(req.file.mimetype);

      if (!isValidImage) {
        return res.status(400).send({
          success: false,
          message: "Image type is invalid.",
        });
      }
      const { public_id, url } = await uploadFileToCloudinary(
        req.file,
        "employee",
        "employeeImg"
      );
      deleteFromCloudinary(empData.image?.public_id);
      empData.image = { public_id, url };
    }

    empData.name = name || empData.name;
    empData.email = email || empData.email;
    empData.mobile = mobile || empData.mobile;
    empData.designation = designation || empData.designation;
    empData.gender = gender || empData.gender;
    empData.course = course || empData.course;

    await empData.save();
    return res.status(200).send({
      success: true,
      message: "Employee updated successfully",
      employee: empData,
    });
  } catch (error) {
    if (error.code == 11000) {
      return res.status(400).send({
        success: false,
        message: "Email already exists.",
      });
    }
    return res.status(501).send({
      success: false,
      message: "Error in update API",
    });
  }
};
export const deleteEmployee = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).send({
        success: false,
        message: "Please specify the employee to be deleted.",
      });
    }
    const employeeData = await employee.findOne({ _id });
    if (!employeeData) {
      return res.status(400).send({
        success: false,
        message: "Employee not found.",
      });
    }

    // deleting image from cloud
    await deleteFromCloudinary(employeeData.image.public_id);
    const deleted = await employee.deleteOne({ _id });
    return res.status(200).send({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(501).send({
      success: false,
      message: "Error in employee delete API.",
    });
  }
};
