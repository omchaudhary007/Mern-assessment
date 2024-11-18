import express from "express";
import multer from "multer";
import isAuth from "../middlewares/authMiddleware.js";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "../controllers/employeeControllers.js";

const router = express.Router();

// multer upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1mb size
});

router.get("/all-employee", isAuth, getEmployees);
router.post(
  "/create",
  isAuth,
  (req, res, next) => {
    upload.single("profileimage")(req, res, (err) => {
      if (err) {
        return res.status(400).send({
          success: false,
          message: "Error in image upload.",
        });
      }
      next();
    });
  },
  createEmployee
);
router.post(
  "/update",
  isAuth,
  (req, res, next) => {
    upload.single("profileimage")(req, res, (err) => {
      if (err) {
        return res.status(400).send({
          success: false,
          message: "Error in image upload.",
        });
      }
      next();
    });
  },
  updateEmployee
);
router.post("/delete", isAuth, deleteEmployee);

export default router;
